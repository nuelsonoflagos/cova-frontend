// Import Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.40.0/+esm';

// Initialize Supabase
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your_anon_key_here';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API Configuration
const API_URL = 'http://localhost:3000';

// Generic API call function
async function apiCall(endpoint, method = 'GET', data = null) {
  const token = localStorage.getItem('accessToken');
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // Add token if it exists
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Add body if sending data
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data: result,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      ok: false,
      status: 500,
      error: error.message,
    };
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