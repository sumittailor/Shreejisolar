// Cloudflare Worker for Shree Ji Solar Experts
// Full-Stack Serverless Backend powered by Cloudflare Workers & R2 Storage

const DEFAULT_SETTINGS = {
  business_name: 'SHREE JI SOLAR EXPERTS',
  business_email: 'shreejisolarexperts@gmail.com',
  whatsapp_number: '919785002188',
  contact_phone: '+91 97850 02188',
  address: 'Opposite Civil Hospital, Solar Energy Hub',
  office_hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
  subsidy_benchmark_note: 'PM Surya Ghar subsidy assistance up to ₹78,000 for 3kW+ rooftop systems is subject to government rules and DISCOM verification.',
  cleaning_service_starting_price: '₹499'
};

const DEFAULT_PLANS = [
  {
    id: 1,
    slug: 'plan-3kw',
    name: '3 kW Solar System',
    capacity: '3 kW',
    listed_price: 180000,
    estimated_net_price: 'Subject to scheme eligibility verification',
    subsidy_eligible: 1,
    subsidy_info: 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
    components: 'Tier-1 Mono PERC / TopCon Solar Panels, Grid-Tied Solar Inverter, GI Structure, AC/DC Protection Box, Earthing Kit (To be confirmed)',
    inclusions: 'Site Survey, Structural Installation, Net-Metering Assistance, Civil Work & Testing (To be confirmed)',
    warranty: '25-Year Panel Performance Warranty (To be confirmed)',
    property_type: 'Residential Rooftop / Small Commercial',
    is_active: 1,
    display_order: 1
  },
  {
    id: 2,
    slug: 'plan-5kw',
    name: '5 kW Solar System',
    capacity: '5 kW',
    listed_price: 270000,
    estimated_net_price: 'Subject to scheme eligibility verification',
    subsidy_eligible: 1,
    subsidy_info: 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
    components: 'High-Efficiency Solar Modules, High-Rating Inverter, Heavy-Duty Wind-Resistant Mounting (To be confirmed)',
    inclusions: 'End-to-end Installation, Earthing & Lightning Protection, Net-metering Paperwork support (To be confirmed)',
    warranty: '25-Year Module Warranty (To be confirmed)',
    property_type: 'Medium to Large Home / Independent Villa',
    is_active: 1,
    display_order: 2
  },
  {
    id: 3,
    slug: 'plan-6kw',
    name: '6 kW Solar System',
    capacity: '6 kW',
    listed_price: 350000,
    estimated_net_price: 'Subject to scheme eligibility verification',
    subsidy_eligible: 1,
    subsidy_info: 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
    components: 'High-Output Bifacial / Mono PERC Panels, Smart Inverter, Premium Cabling (To be confirmed)',
    inclusions: 'Custom Rooftop Engineering, Complete Electrical Inclusions, Safety Inspection (To be confirmed)',
    warranty: '25-Year Performance Warranty (To be confirmed)',
    property_type: 'Large Residential / Commercial Shops',
    is_active: 1,
    display_order: 3
  },
  {
    id: 4,
    slug: 'plan-8kw',
    name: '8 kW Solar System',
    capacity: '8 kW',
    listed_price: 400000,
    estimated_net_price: 'Subject to scheme eligibility verification',
    subsidy_eligible: 1,
    subsidy_info: 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
    components: 'Commercial Grade Solar Modules, Industrial String Inverter, Heavy Mounting Structure (To be confirmed)',
    inclusions: 'Full Turnkey Installation, Regulatory Grid Interconnection Support, System Commissioning (To be confirmed)',
    warranty: '25-Year Performance Warranty (To be confirmed)',
    property_type: 'Commercial Rooftop / Factory / Multi-Story Residence',
    is_active: 1,
    display_order: 4
  }
];

// --- Utilities & Crypto Helpers ---
function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(base64url) {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function signJwt(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const sigBytes = new Uint8Array(signature);
  let binary = '';
  for (let i = 0; i < sigBytes.length; i++) {
    binary += String.fromCharCode(sigBytes[i]);
  }
  const encodedSignature = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${data}.${encodedSignature}`;
}

async function verifyJwt(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  let sigBase64 = encodedSignature.replace(/-/g, '+').replace(/_/g, '/');
  while (sigBase64.length % 4) sigBase64 += '=';
  const binarySig = atob(sigBase64);
  const sigBytes = new Uint8Array(binarySig.length);
  for (let i = 0; i < binarySig.length; i++) {
    sigBytes[i] = binarySig.charCodeAt(i);
  }

  const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(data));
  if (!isValid) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}

async function sha256(str) {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- R2 Storage Helpers ---
async function getJson(bucket, key, fallback) {
  if (!bucket) return fallback;
  try {
    const obj = await bucket.get(key);
    if (!obj) return fallback;
    const text = await obj.text();
    return JSON.parse(text);
  } catch (err) {
    console.error(`Error reading ${key} from R2:`, err);
    return fallback;
  }
}

async function putJson(bucket, key, data) {
  if (!bucket) return;
  try {
    await bucket.put(key, JSON.stringify(data, null, 2), {
      httpMetadata: { contentType: 'application/json' }
    });
  } catch (err) {
    console.error(`Error writing ${key} to R2:`, err);
  }
}

// JSON Response Helper
function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers
    }
  });
}

function handleCors(request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}

// Auth Middleware Helper
async function authenticate(request, env) {
  const authHeader = request.headers.get('Authorization');
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Check cookies
    const cookieHeader = request.headers.get('Cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/admin_token=([^;]+)/);
      if (match) token = match[1];
    }
  }

  const secret = env.JWT_SECRET || 'shree-ji-solar-secret-key-prod-2026';
  return await verifyJwt(token, secret);
}

// --- Main Worker Fetch Handler ---
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return handleCors(request);
    }

    // 2. Route API Requests
    if (url.pathname.startsWith('/api')) {
      return handleApiRequest(request, env, url);
    }

    // 3. Fallback to Static Assets (Frontend)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};

async function handleApiRequest(request, env, url) {
  const path = url.pathname;
  const method = request.method;
  const bucket = env.STORAGE;
  const secret = env.JWT_SECRET || 'shree-ji-solar-secret-key-prod-2026';
  const defaultAdminPass = env.ADMIN_PASSWORD || 'ShreeJiSolar@2026';

  // --- Health Check ---
  if (path === '/api/health') {
    return jsonResponse({
      status: 'ok',
      service: 'Shree Ji Solar Experts Cloudflare Worker API',
      r2_connected: !!bucket,
      timestamp: new Date().toISOString()
    });
  }

  // --- Public Settings ---
  if (path === '/api/settings' && method === 'GET') {
    const settings = await getJson(bucket, 'settings.json', DEFAULT_SETTINGS);
    return jsonResponse({ success: true, settings });
  }

  // --- Admin Settings ---
  if (path === '/api/settings/admin' && method === 'GET') {
    const user = await authenticate(request, env);
    if (!user) return jsonResponse({ success: false, message: 'Unauthorized' }, 401);

    const settings = await getJson(bucket, 'settings.json', DEFAULT_SETTINGS);
    return jsonResponse({ success: true, settings });
  }

  if (path === '/api/settings' && method === 'POST') {
    const user = await authenticate(request, env);
    if (!user) return jsonResponse({ success: false, message: 'Unauthorized' }, 401);

    const current = await getJson(bucket, 'settings.json', DEFAULT_SETTINGS);
    const body = await request.json().catch(() => ({}));
    const updated = { ...current, ...body };
    await putJson(bucket, 'settings.json', updated);
    return jsonResponse({ success: true, message: 'Settings updated successfully', settings: updated });
  }

  // --- Plans API ---
  if (path === '/api/plans' && method === 'GET') {
    const plans = await getJson(bucket, 'plans.json', DEFAULT_PLANS);
    const activePlans = plans.filter(p => p.is_active !== 0);
    return jsonResponse({ success: true, plans: activePlans });
  }

  if (path === '/api/plans/admin/all' && method === 'GET') {
    const user = await authenticate(request, env);
    if (!user) return jsonResponse({ success: false, message: 'Unauthorized' }, 401);

    const plans = await getJson(bucket, 'plans.json', DEFAULT_PLANS);
    return jsonResponse({ success: true, plans });
  }

  if (path === '/api/plans' && method === 'POST') {
    const user = await authenticate(request, env);
    if (!user) return jsonResponse({ success: false, message: 'Unauthorized' }, 401);

    const body = await request.json().catch(() => ({}));
    const plans = await getJson(bucket, 'plans.json', DEFAULT_PLANS);

    const newPlan = {
      id: Date.now(),
      slug: body.slug || `plan-${Date.now()}`,
      name: body.name || 'Custom Solar System',
      capacity: body.capacity || '1 kW',
      listed_price: Number(body.listed_price) || 0,
      estimated_net_price: body.estimated_net_price || 'Subject to scheme eligibility verification',
      subsidy_eligible: body.subsidy_eligible ? 1 : 0,
      subsidy_info: body.subsidy_info || '',
      components: body.components || '',
      inclusions: body.inclusions || '',
      warranty: body.warranty || '',
      property_type: body.property_type || 'Residential',
      is_active: body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
      display_order: Number(body.display_order) || plans.length + 1
    };

    plans.push(newPlan);
    await putJson(bucket, 'plans.json', plans);
    return jsonResponse({ success: true, plan: newPlan, message: 'Plan created successfully' });
  }

  if (path.startsWith('/api/plans/') && method === 'PUT') {
    const user = await authenticate(request, env);
    if (!user) return jsonResponse({ success: false, message: 'Unauthorized' }, 401);

    const id = path.split('/')[3];
    const body = await request.json().catch(() => ({}));
    let plans = await getJson(bucket, 'plans.json', DEFAULT_PLANS);

    const index = plans.findIndex(p => String(p.id) === String(id));
    if (index === -1) {
      return jsonResponse({ success: false, message: 'Plan not found' }, 404);
    }

    plans[index] = { ...plans[index], ...body, id: plans[index].id };
    await putJson(bucket, 'plans.json', plans);
    return jsonResponse({ success: true, plan: plans[index], message: 'Plan updated successfully' });
  }

  if (path.startsWith('/api/plans/') && method === 'DELETE') {
    const user = await authenticate(request, env);
    if (!user) return jsonResponse({ success: false, message: 'Unauthorized' }, 401);

    const id = path.split('/')[3];
    let plans = await getJson(bucket, 'plans.json', DEFAULT_PLANS);
    plans = plans.filter(p => String(p.id) !== String(id));
    await putJson(bucket, 'plans.json', plans);
    return jsonResponse({ success: true, message: 'Plan deleted successfully' });
  }

  // --- Auth: Login ---
  if (path === '/api/auth/login' && method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const username = (body.username || '').trim();
    const password = (body.password || '').trim();

    if (!username || !password) {
      return jsonResponse({ success: false, message: 'Username and password are required.' }, 400);
    }

    // Check against custom admin credentials stored in R2, or default env credentials
    const adminConfig = await getJson(bucket, 'admin.json', null);
    let isValid = false;

    if (adminConfig && adminConfig.username === username) {
      const passHash = await sha256(password);
      isValid = (adminConfig.password_hash === passHash);
    } else if (username === 'admin' && password === defaultAdminPass) {
      isValid = true;
    }

    if (!isValid) {
      return jsonResponse({ success: false, message: 'Invalid credentials.' }, 401);
    }

    const payload = {
      id: 1,
      username: username,
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + (7 * 86400) // 7 days
    };

    const token = await signJwt(payload, secret);

    return jsonResponse({
      success: true,
      token,
      user: {
        id: 1,
        username: username,
        role: 'admin'
      }
    }, 200, {
      'Set-Cookie': `admin_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
    });
  }

  if (path === '/api/auth/me' && method === 'GET') {
    const user = await authenticate(request, env);
    if (!user) return jsonResponse({ success: false, message: 'Session expired' }, 401);
    return jsonResponse({ success: true, user });
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    return jsonResponse({ success: true, message: 'Logged out successfully' }, 200, {
      'Set-Cookie': 'admin_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    });
  }

  if (path === '/api/auth/change-password' && method === 'POST') {
    const user = await authenticate(request, env);
    if (!user) return jsonResponse({ success: false, message: 'Unauthorized' }, 401);

    const body = await request.json().catch(() => ({}));
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return jsonResponse({ success: false, message: 'Current and new password are required.' }, 400);
    }
    if (newPassword.length < 8) {
      return jsonResponse({ success: false, message: 'New password must be at least 8 characters long.' }, 400);
    }

    const adminConfig = await getJson(bucket, 'admin.json', null);
    let isCurrentValid = false;

    if (adminConfig) {
      const curHash = await sha256(currentPassword);
      isCurrentValid = (adminConfig.password_hash === curHash);
    } else {
      isCurrentValid = (currentPassword === defaultAdminPass);
    }

    if (!isCurrentValid) {
      return jsonResponse({ success: false, message: 'Incorrect current password.' }, 400);
    }

    const newHash = await sha256(newPassword);
    await putJson(bucket, 'admin.json', {
      username: user.username || 'admin',
      password_hash: newHash,
      updated_at: new Date().toISOString()
    });

    return jsonResponse({ success: true, message: 'Password changed successfully.' });
  }

  // --- Enquiries: Public Submission ---
  if (path === '/api/enquiries' && method === 'POST') {
    const body = await request.json().catch(() => ({}));

    if (!body.customer_name || !body.mobile || !body.city) {
      return jsonResponse({ success: false, message: 'Name, mobile number and city are required.' }, 400);
    }

    // Generate reference number SJS-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const reference_no = `SJS-${dateStr}-${randNum}`;

    const newEnquiry = {
      id: Date.now(),
      reference_no,
      customer_name: body.customer_name.trim(),
      mobile: body.mobile.trim(),
      email: (body.email || '').trim(),
      city: body.city.trim(),
      property_type: body.property_type || 'Residential',
      service_required: body.service_required || 'New Installation',
      desired_capacity: body.desired_capacity || '',
      selected_package: body.selected_package || '',
      monthly_bill: body.monthly_bill || '',
      panel_count: Number(body.panel_count) || 0,
      preferred_date: body.preferred_date || '',
      additional_notes: body.additional_notes || '',
      status: 'New',
      internal_notes: '',
      email_notification_status: 'saved_to_r2',
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    // 1. Save single file in R2: enquiries/{reference_no}.json
    await putJson(bucket, `enquiries/${reference_no}.json`, newEnquiry);

    // 2. Add to enquiries index list in R2
    const enquiries = await getJson(bucket, 'enquiries_index.json', []);
    enquiries.unshift(newEnquiry);
    await putJson(bucket, 'enquiries_index.json', enquiries);

    return jsonResponse({
      success: true,
      message: 'Your enquiry has been received successfully. Our solar team will contact you shortly.',
      reference_no,
      enquiry: newEnquiry
    }, 201);
  }

  // --- Enquiries: Admin Stats Summary ---
  if (path === '/api/enquiries/stats/summary' && method === 'GET') {
    const user = await authenticate(request, env);
    if (!user) return jsonResponse({ success: false, message: 'Unauthorized' }, 401);

    const enquiries = await getJson(bucket, 'enquiries_index.json', []);

    const total = enquiries.length;
    const newCount = enquiries.filter(e => e.status === 'New').length;
    const contactedCount = enquiries.filter(e => e.status === 'Contacted').length;
    const convertedCount = enquiries.filter(e => e.status === 'Converted' || e.status === 'Site Visit Completed').length;
    const archivedCount = enquiries.filter(e => e.status === 'Closed / Cancelled').length;

    return jsonResponse({
      success: true,
      stats: {
        total_enquiries: total,
        new_enquiries: newCount,
        contacted_enquiries: contactedCount,
        converted_enquiries: convertedCount,
        archived_enquiries: archivedCount,
        recent: enquiries.slice(0, 5)
      }
    });
  }

  // --- Enquiries: Export CSV ---
  if (path === '/api/enquiries/export/csv' && method === 'GET') {
    const user = await authenticate(request, env);
    if (!user) return jsonResponse({ success: false, message: 'Unauthorized' }, 401);

    const enquiries = await getJson(bucket, 'enquiries_index.json', []);
    const headers = [
      'Reference No', 'Date', 'Customer Name', 'Mobile', 'Email', 'City',
      'Property Type', 'Service Required', 'Capacity', 'Selected Package',
      'Monthly Bill', 'Panel Count', 'Preferred Date', 'Status', 'Internal Notes', 'Additional Notes'
    ];

    const escapeCsv = (field) => {
      if (field === null || field === undefined) return '""';
      const str = String(field).replace(/"/g, '""');
      return `"${str}"`;
    };

    let csv = headers.join(',') + '\r\n';
    enquiries.forEach(e => {
      const row = [
        escapeCsv(e.reference_no),
        escapeCsv(e.created_at),
        escapeCsv(e.customer_name),
        escapeCsv(e.mobile),
        escapeCsv(e.email),
        escapeCsv(e.city),
        escapeCsv(e.property_type),
        escapeCsv(e.service_required),
        escapeCsv(e.desired_capacity),
        escapeCsv(e.selected_package),
        escapeCsv(e.monthly_bill),
        escapeCsv(e.panel_count),
        escapeCsv(e.preferred_date),
        escapeCsv(e.status),
        escapeCsv(e.internal_notes),
        escapeCsv(e.additional_notes)
      ];
      csv += row.join(',') + '\r\n';
    });

    const today = new Date().toISOString().slice(0, 10);
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="shree-ji-solar-enquiries-${today}.csv"`
      }
    });
  }

  // --- Enquiries: Admin List ---
  if (path === '/api/enquiries' && method === 'GET') {
    const user = await authenticate(request, env);
    if (!user) return jsonResponse({ success: false, message: 'Unauthorized' }, 401);

    let enquiries = await getJson(bucket, 'enquiries_index.json', []);

    // Filter by status
    const statusParam = url.searchParams.get('status');
    if (statusParam && statusParam !== 'All') {
      enquiries = enquiries.filter(e => e.status === statusParam);
    }

    // Filter by search query
    const searchParam = (url.searchParams.get('search') || '').toLowerCase().trim();
    if (searchParam) {
      enquiries = enquiries.filter(e =>
        (e.customer_name && e.customer_name.toLowerCase().includes(searchParam)) ||
        (e.mobile && e.mobile.includes(searchParam)) ||
        (e.city && e.city.toLowerCase().includes(searchParam)) ||
        (e.reference_no && e.reference_no.toLowerCase().includes(searchParam))
      );
    }

    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const total = enquiries.length;
    const startIndex = (page - 1) * limit;
    const paginated = enquiries.slice(startIndex, startIndex + limit);

    return jsonResponse({
      success: true,
      enquiries: paginated,
      total,
      page,
      total_pages: Math.ceil(total / limit) || 1
    });
  }

  // --- Enquiries: Admin Update Status / Notes ---
  if (path.startsWith('/api/enquiries/') && method === 'PATCH') {
    const user = await authenticate(request, env);
    if (!user) return jsonResponse({ success: false, message: 'Unauthorized' }, 401);

    const id = path.split('/')[3];
    const body = await request.json().catch(() => ({}));
    let enquiries = await getJson(bucket, 'enquiries_index.json', []);

    const index = enquiries.findIndex(e => String(e.id) === String(id) || e.reference_no === id);
    if (index === -1) {
      return jsonResponse({ success: false, message: 'Enquiry not found.' }, 404);
    }

    const item = enquiries[index];
    if (body.status !== undefined) item.status = body.status;
    if (body.internal_notes !== undefined) item.internal_notes = body.internal_notes;
    item.updated_at = new Date().toISOString();

    enquiries[index] = item;

    // Update in index and in individual file
    await putJson(bucket, 'enquiries_index.json', enquiries);
    if (item.reference_no) {
      await putJson(bucket, `enquiries/${item.reference_no}.json`, item);
    }

    return jsonResponse({
      success: true,
      message: 'Enquiry updated successfully.',
      enquiry: item
    });
  }

  // --- Enquiries: Admin Single Details ---
  if (path.startsWith('/api/enquiries/') && method === 'GET') {
    const user = await authenticate(request, env);
    if (!user) return jsonResponse({ success: false, message: 'Unauthorized' }, 401);

    const id = path.split('/')[3];
    const enquiries = await getJson(bucket, 'enquiries_index.json', []);
    const item = enquiries.find(e => String(e.id) === String(id) || e.reference_no === id);

    if (!item) {
      return jsonResponse({ success: false, message: 'Enquiry not found.' }, 404);
    }

    return jsonResponse({ success: true, enquiry: item });
  }

  return jsonResponse({ success: false, message: 'API endpoint not found' }, 404);
}
