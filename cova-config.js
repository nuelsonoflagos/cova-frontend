// Cova — shared configuration loaded by every page.
// Defines the Supabase client ONCE so the anon key lives in a single place
// (easy to rotate) instead of being copy-pasted across every HTML file.
//
// This file runs SYNCHRONOUSLY. Each page must include the Supabase UMD bundle
// BEFORE this file:
//
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.40.0/dist/umd/supabase-full.min.js"></script>
//   <script src="cova-config.js"></script>
//   <script src="cova-auth.js"></script>   <!-- only on protected pages -->
//   <script>
//     const { supabaseClient } = window.cova;
//     ... your code ...
//   </script>
//
// NOTE: SUPABASE_ANON_KEY is the *publishable* anon key. It is safe to ship
// to the browser ONLY because Row-Level-Security is enabled on every table
// (see supabase/migrations/0001_init_security.sql). Never put a service_role
// key here.

(function () {
  if (typeof window.supabase === "undefined" || !window.supabase.createClient) {
    console.error(
      "[cova-config] Supabase bundle not loaded. Add the CDN <script> tag before cova-config.js."
    );
    return;
  }

  var COVA_SUPABASE_URL = "https://sipbkoxamzsurjsojsov.supabase.co";
  var COVA_SUPABASE_ANON_KEY = "sb_publishable_K5waOlfDMf1e7nwO7CkTmQ_fMyB5E5x";

  var supabaseClient = window.supabase.createClient(
    COVA_SUPABASE_URL,
    COVA_SUPABASE_ANON_KEY
  );

  window.cova = {
    SUPABASE_URL: COVA_SUPABASE_URL,
    SUPABASE_ANON_KEY: COVA_SUPABASE_ANON_KEY,
    supabaseClient: supabaseClient,
  };
})();
