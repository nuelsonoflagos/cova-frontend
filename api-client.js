// Cova API client.
//
// Previously this file hardcoded the Supabase URL/anon key and created its own
// client. It now defers to the shared config in cova-config.js (window.cova) so
// the key lives in exactly one place.
//
// Loading notes:
//   - On pages that load this as a plain <script src>, it reuses the client
//     already initialized by cova-config.js.
//   - On pages that load it with type="module", it imports the bundle itself
//     and mirrors the same config (kept in sync with cova-config.js).

// API Configuration
const API_URL = 'https://getcova.ng';

// Resolve the Supabase client: prefer the shared window.cova client; fall back
// to creating one from the ESM import only in a module context.
let supabase;
if (typeof window !== 'undefined' && window.cova && window.cova.supabaseClient) {
  supabase = window.cova.supabaseClient;
} else {
  try {
    // Only evaluated in a module context; silently skipped for plain <script>.
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.40.0/+esm');
    supabase = createClient(
      'https://sipbkoxamzsurjsojsov.supabase.co',
      'sb_publishable_K5waOlfDMf1e7nwO7CkTmQ_fMyB5E5x'
    );
  } catch (e) {
    console.warn('[api-client] Could not initialize Supabase client', e);
  }
}

// Generic API call function.
// Sends the current Supabase access token when available so the backend can
// identify the caller; falls back to a legacy localStorage token otherwise.
async function apiCall(endpoint, method = 'GET', data = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Prefer the live Supabase session token.
  if (supabase) {
    try {
      const { data: sess } = await supabase.auth.getSession();
      if (sess && sess.session && sess.session.access_token) {
        headers['Authorization'] = `Bearer ${sess.session.access_token}`;
      }
    } catch (_) { /* ignore — fall back below */ }
  }
  if (!headers['Authorization']) {
    const legacyToken = localStorage.getItem('accessToken');
    if (legacyToken) headers['Authorization'] = `Bearer ${legacyToken}`;
  }

  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();
    return { ok: response.ok, status: response.status, data: result };
  } catch (error) {
    console.error('API Error:', error);
    return { ok: false, status: 500, error: error.message };
  }
}

// Authentication Functions
async function signup(phone, email, firstName, lastName, accountType = 'personal') {
  return apiCall('/api/auth/signup', 'POST', {
    phone,
    email,
    first_name: firstName,
    last_name: lastName,
    account_type: accountType,
  });
}

async function verifyOTP(phone, token) {
  return apiCall('/api/auth/verify-otp', 'POST', { phone, token });
}

// Policy Functions
async function createPolicy(policyData) {
  return apiCall('/api/policies', 'POST', policyData);
}

async function getUserPolicies() {
  return apiCall('/api/policies', 'GET');
}

async function getPolicy(policyId) {
  return apiCall(`/api/policies/${policyId}`, 'GET');
}

async function renewPolicy(policyId) {
  return apiCall(`/api/policies/${policyId}`, 'PUT', { action: 'renew' });
}

// Payment Functions
async function initializePayment(policyId, amount, email) {
  return apiCall('/api/payments/initialize', 'POST', {
    policy_id: policyId,
    amount,
    email,
  });
}

// Claims Functions
async function fileClaim(claimData) {
  return apiCall('/api/claims', 'POST', claimData);
}

async function getClaimStatus(claimId) {
  return apiCall(`/api/claims/${claimId}`, 'GET');
}
