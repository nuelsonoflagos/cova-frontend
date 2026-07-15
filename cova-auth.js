// Cova — shared auth + XSS-escape helpers.
// Depends on cova-config.js (provides window.cova.supabaseClient).
//
// Usage:
//   <script src="cova-config.js"></script>
//   <script src="cova-auth.js"></script>
//   <script>
//     (async () => {
//       const session = await window.cova.requireUser();   // redirects if logged out
//       ... render the page ...
//     })();
//   </script>

(function () {
  function getClient() {
    if (!window.cova || !window.cova.supabaseClient) {
      throw new Error("cova-auth.js requires cova-config.js to be loaded first.");
    }
    return window.cova.supabaseClient;
  }

  // Redirect to the login page. `loginPage` defaults to the customer auth page;
  // admin/handler pages pass their own staff login page.
  function redirectToLogin(loginPage) {
    const target = loginPage || "cova-auth.html#login";
    // Preserve the page they tried to reach so we can bounce back after login.
    const returnUrl = window.location.pathname.split("/").pop() + window.location.search;
    window.location.href = target + (target.includes("?") ? "&" : "?") + "redirect=" + encodeURIComponent(returnUrl);
  }

  /**
   * Require a signed-in customer. Redirects to login if there is no session.
   * Returns the session object on success.
   */
  async function requireUser(loginPage) {
    const client = getClient();
    const { data, error } = await client.auth.getSession();
    if (error || !data || !data.session) {
      redirectToLogin(loginPage);
      return null;
    }
    return data.session;
  }

  /**
   * Require a signed-in staff member with a specific role ('admin' | 'handler').
   * Verifies the Supabase session AND that the user has a row in the `staff`
   * table with the matching role. Redirects to the staff login page otherwise.
   *
   * NOTE: this is a client-side convenience guard. The real security boundary
   * is RLS on the `staff` table plus any server-side admin APIs.
   */
  async function requireStaffRole(role) {
    const client = getClient();
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError || !sessionData || !sessionData.session) {
      redirectToLogin("cova-admin-login.html");
      return null;
    }

    const userId = sessionData.session.user.id;
    const { data: staffRow, error: staffError } = await client
      .from("staff")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (staffError || !staffRow || staffRow.role !== role) {
      // Not authorized for this portal — sign out and bounce to login.
      await client.auth.signOut();
      redirectToLogin("cova-admin-login.html");
      return null;
    }
    return sessionData.session;
  }

  /**
   * Escape a value for safe insertion into HTML text or an attribute.
   * Returns an empty string for null/undefined/objects (except numbers).
   */
  function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") return String(value);
    if (typeof value !== "string") {
      // Objects/arrays: stringify defensively, then escape the result.
      try {
        value = JSON.stringify(value);
      } catch (e) {
        return "";
      }
    }
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  window.cova = Object.assign(window.cova || {}, {
    requireUser: requireUser,
    requireStaffRole: requireStaffRole,
    escapeHtml: escapeHtml,
  });
})();
