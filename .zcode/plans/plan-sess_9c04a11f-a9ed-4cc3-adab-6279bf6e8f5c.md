## Plan: Fix all security findings + repo cleanup

### Part A — Centralize Supabase config (1 new file)
**Create `cova-config.js`** (loaded by every page before page-specific scripts):
- Exports `COVA_SUPABASE_URL`, `COVA_SUPABASE_ANON_KEY`, and a single shared `supabaseClient` via `window.cova`.
- Pinned CDN version (`@supabase/supabase-js@2.40.0`) instead of unscoped `@2`.

Then replace the inline `const supabaseUrl = ...; const supabaseAnonKey = ...; createClient(...)` block in all 6 files (cova-auth.html, cova-update-password.html, cova-dashboard.html, cova-sme-dashboard.html, cova-onboarding-personal-step7.html, api-client.js) with `<script src="cova-config.js"></script>` + `const { supabaseClient } = window.cova;`. The chatbot fetch URL/Authorization header in cova-chatbot.html also switches to `window.cova` constants.

### Part B — Auth helper (1 new file)
**Create `cova-auth.js`** with two reusable functions:
- `requireUser(loginPage)` — `await getSession()`, redirect to login if none. Returns the session.
- `requireStaffRole(role)` — verify session + fetch the staff member's role from the `staff` table; redirect to admin-login if unauthenticated or wrong role.
- `escapeHtml(str)` — single shared HTML-escaper (used by Part C).

### Part C — Fix all XSS sinks (add `escapeHtml()` to data → innerHTML)
Add escaping to every dynamic interpolation:
- `cova-dashboard.html:71` — escape `policy.product_type/status/premium_amount/sum_insured`, pass `policy.id` through `encodeURIComponent` for the onclick handlers.
- `cova-sme-dashboard.html:1240/1269/1298/1327/1353` — escape `policy.metadata.*`, `policy.status`, `claim.*` fields across all 5 tabs.
- `cova-policy.html:1453` — escape `metadata.device_name/imei`, `policy.insurer/cover_type/start_date/end_date`.
- `cova-sme-devices.html:1162` — escape `device.*` fields (CSV import is attacker-controlled).

### Part D — Real staff auth via Supabase + staff table (replaces hardcoded creds)
**SQL migration** — create `supabase/migrations/0001_init_security.sql`:
- `create table staff (user_id uuid references auth.users primary key, role text check (role in ('admin','handler')), created_at timestamptz default now());`
- Enable RLS on `staff`; policy `staff_read_self` (`user_id = auth.uid()`).
- Enable RLS on `policies` with `using (user_id = auth.uid())` so users can only read their own rows (closes the client-side `.eq()` trust gap).
- (Note: applying the migration to your live project requires a `supabase db push` or running it in the dashboard — I'll flag this clearly in the final summary since I can't run it here.)

**cova-admin-login.html** — rewrite both form handlers to use `supabaseClient.auth.signInWithPassword`. On success, verify the user exists in `staff` with the matching role; set nothing client-side (session is managed by Supabase SDK), redirect to the portal. Remove all hardcoded `validEmail`/`validPassword` constants.

**cova-admin.html** — add an inline guard at the top of its first script: `await window.cova.requireStaffRole('admin')` → redirect to `cova-admin-login.html` if not authorized. Fix `logout()` to call `supabaseClient.auth.signOut()` then redirect to the real login page (currently redirects to nonexistent `cova-login.html`).

**cova-handler.html** — same treatment with `requireStaffRole('handler')`, plus a `signOut()`-based logout.

### Part E — Add session guards to unguarded user pages
Add `requireUser()` guard to: cova-onboarding.html, cova-policy.html, cova-claim.html, cova-renewal.html. Also fix cova-renewal.html:950-951 (remove the hardcoded fallback email `adaeze@brightsupermarkets.com`, use the session user) and cova-policy.html:1410 (remove unchecked `localStorage["user"]` read, use session).

### Part F — Lock down chatbot edge function
**`supabase/functions/chatbot/index.ts`:**
- Change CORS `Access-Control-Allow-Origin` from `*` to the production origin (`https://getcova.ng`).
- Add caller auth: read the `Authorization` header, verify a valid Supabase JWT via `getUser()` before calling the LLM; reject unauthenticated requests with 401.
- Add a basic per-IP/per-user message rate limit (in-memory counter, e.g. 20 msgs/min) to prevent LLM bill abuse.
- Harden the prompt-injection surface: wrap `${JSON.stringify(userProfile)}` in a clearly-delimited, explicitly-untrusted block in the system prompt.
- Fix the `isOpneAI` variable naming by using two distinct env vars (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`) and routing on whichever is set.

### Part G — Minor / hygiene fixes
- cova-update-password.html: raise `minlength` from 6 to 12.
- Add `*.jpg`-style guidance to `.gitignore` is not appropriate (images are in-use), so instead leave images but note optimization in the summary.

### Part H — Delete ~65 unreferenced throwaway scripts
Remove from git: all `fix_*.js` (29), `update_*.js` (8), `add_login*.js`/`add_logos.js`, `make_*.js`, `remove_tabs.js`, `clean_patch.js`, `print_script0.js`, `temp*.js`, all `temp_failed_*.html.js` (9), `test2.js`, `test_prop.js`, `test.html`, `keep-alive.js` (root duplicate; the GitHub workflow is separate and stays). All recoverable from git history; none referenced by any HTML `<script src>`.

### What I will NOT change
- The 5 in-use images (cova-logo.png, cova-logo-white.png, img-1/2/3.jpg) — they're referenced by live pages.
- The keep-alive GitHub workflow (it correctly uses `${{ secrets }}`).
- recommendation-engine.js, api-client.js, chatbot-widget.js, styles.css (all referenced and kept; api-client.js gets the config refactor in Part A).

### Verification
After edits: `git grep` to confirm no remaining `password123`, no `validPassword`, no `*` CORS in the edge function, no remaining unescaped `${policy.` / `${claim.` / `${device.` in innerHTML sinks, and that every page either loads `cova-config.js` or is a login page. I'll report the grep results in the final summary. I'll also clearly flag the one manual step you must do: apply the SQL migration and create your staff account(s) in the Supabase dashboard.

### Files touched
- New: `cova-config.js`, `cova-auth.js`, `supabase/migrations/0001_init_security.sql`
- Modified: `api-client.js`, `cova-auth.html`, `cova-update-password.html`, `cova-dashboard.html`, `cova-sme-dashboard.html`, `cova-onboarding-personal-step7.html`, `cova-chatbot.html`, `cova-admin-login.html`, `cova-admin.html`, `cova-handler.html`, `cova-onboarding.html`, `cova-policy.html`, `cova-claim.html`, `cova-renewal.html`, `cova-sme-devices.html`, `supabase/functions/chatbot/index.ts`, `.gitignore`
- Deleted: ~65 throwaway root scripts