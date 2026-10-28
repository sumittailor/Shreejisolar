// Client API service with standard error handling

const API_BASE = '/api';

export async function fetchPublicSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load settings');
  return data.settings;
}

export async function fetchSolarPlans() {
  const res = await fetch(`${API_BASE}/plans`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load plans');
  return data.plans;
}

export async function submitEnquiry(enquiryData) {
  const res = await fetch(`${API_BASE}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiryData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to submit enquiry');
  }
  return data;
}

// Admin API
export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function checkAdminAuth(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Session expired');
  return data.user;
}

export async function fetchAdminStats(token) {
  const res = await fetch(`${API_BASE}/enquiries/stats/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load stats');
  return data;
}

export async function fetchAdminEnquiries(token, params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/enquiries?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load enquiries');
  return data;
}

export async function updateEnquiryStatus(token, id, status, internal_notes) {
  const res = await fetch(`${API_BASE}/enquiries/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, internal_notes }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update enquiry');
  return data;
}

export async function fetchAdminPlans(token) {
  const res = await fetch(`${API_BASE}/plans/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load plans');
  return data.plans;
}

export async function saveSolarPlan(token, planData, isEdit = false, id = null) {
  const url = isEdit ? `${API_BASE}/plans/${id}` : `${API_BASE}/plans`;
  const method = isEdit ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(planData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to save plan');
  return data;
}

export async function deleteSolarPlan(token, id) {
  const res = await fetch(`${API_BASE}/plans/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete plan');
  return data;
}

export async function fetchAdminSettings(token) {
  const res = await fetch(`${API_BASE}/settings/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load settings');
  return data.settings;
}

export async function updateAdminSettings(token, settingsMap) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settingsMap),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to save settings');
  return data;
}
