const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'solar.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for better concurrency
db.exec('PRAGMA journal_mode = WAL;');

// Initialize Tables
function initDb() {
  // 1. Enquiries Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_no TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT,
      city TEXT NOT NULL,
      property_type TEXT NOT NULL,
      service_required TEXT NOT NULL,
      desired_capacity TEXT,
      selected_package TEXT,
      monthly_bill TEXT,
      panel_count INTEGER DEFAULT 0,
      preferred_date TEXT,
      additional_notes TEXT,
      status TEXT DEFAULT 'New',
      internal_notes TEXT DEFAULT '',
      email_notification_status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Solar Plans Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS solar_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      capacity TEXT NOT NULL,
      listed_price INTEGER NOT NULL,
      estimated_net_price TEXT DEFAULT 'Subject to scheme eligibility verification',
      subsidy_eligible INTEGER DEFAULT 1,
      subsidy_info TEXT DEFAULT 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
      components TEXT DEFAULT 'To be confirmed',
      inclusions TEXT DEFAULT 'To be confirmed',
      warranty TEXT DEFAULT 'To be confirmed',
      property_type TEXT DEFAULT 'Residential & Commercial',
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Business Settings Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS business_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      description TEXT
    );
  `);

  // 4. Admin Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default admin if none exists
  const adminCheck = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
  if (adminCheck.count === 0) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(process.env.ADMIN_DEFAULT_PASSWORD || 'ShreeJiSolar@2026', salt);
    db.prepare(`
      INSERT INTO admin_users (username, password_hash, email, role)
      VALUES (?, ?, ?, ?)
    `).run('admin', passwordHash, 'admin@shreejisolar.com', 'superadmin');
    console.log('Default admin initialized: username="admin", password="' + (process.env.ADMIN_DEFAULT_PASSWORD || 'ShreeJiSolar@2026') + '"');
  }

  // Seed Default Plans
  const plansCheck = db.prepare('SELECT COUNT(*) as count FROM solar_plans').get();
  if (plansCheck.count === 0) {
    const seedPlans = [
      {
        slug: 'plan-3kw',
        name: '3 kW Solar System',
        capacity: '3 kW',
        listed_price: 180000,
        estimated_net_price: 'To be verified based on scheme & property eligibility',
        subsidy_eligible: 1,
        subsidy_info: 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
        components: 'Tier-1 Mono PERC / TopCon Solar Panels, Grid-Tied Solar Inverter, GI Structure, AC/DC Protection Box, Earthing Kit (Specifications To be confirmed)',
        inclusions: 'Site Survey, Structural Installation, Net-Metering Assistance, Civil Work & Testing (Inclusions To be confirmed)',
        warranty: '25-Year Panel Performance Warranty, 5-Year Inverter Warranty (To be confirmed)',
        property_type: 'Residential Rooftop / Small Commercial',
        display_order: 1
      },
      {
        slug: 'plan-5kw',
        name: '5 kW Solar System',
        capacity: '5 kW',
        listed_price: 270000,
        estimated_net_price: 'To be verified based on scheme & property eligibility',
        subsidy_eligible: 1,
        subsidy_info: 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
        components: 'High-Efficiency Solar Modules, High-Rating Inverter, Heavy-Duty Wind-Resistant Mounting, Surge Protection (Specifications To be confirmed)',
        inclusions: 'End-to-end Installation, Earthing & Lightning Protection, Net-metering Paperwork support (Inclusions To be confirmed)',
        warranty: '25-Year Module Warranty (To be confirmed)',
        property_type: 'Medium to Large Home / Independent Villa / Small Business',
        display_order: 2
      },
      {
        slug: 'plan-6kw',
        name: '6 kW Solar System',
        capacity: '6 kW',
        listed_price: 350000,
        estimated_net_price: 'To be verified based on scheme & property eligibility',
        subsidy_eligible: 1,
        subsidy_info: 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
        components: 'High-Output Bifacial / Mono PERC Panels, Three-Phase/Single-Phase Smart Inverter, Premium Cabling (Specifications To be confirmed)',
        inclusions: 'Custom Rooftop Engineering, Complete Electrical Inclusions, Safety Inspection (Inclusions To be confirmed)',
        warranty: '25-Year Performance Warranty (To be confirmed)',
        property_type: 'Large Residential / Commercial Shops / Small Warehouses',
        display_order: 3
      },
      {
        slug: 'plan-8kw',
        name: '8 kW Solar System',
        capacity: '8 kW',
        listed_price: 400000,
        estimated_net_price: 'To be verified based on scheme & property eligibility',
        subsidy_eligible: 1,
        subsidy_info: 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
        components: 'Commercial Grade Solar Modules, Industrial String Inverter with Remote Monitoring, Heavy Mounting Structure (Specifications To be confirmed)',
        inclusions: 'Full Turnkey Installation, Regulatory Grid Interconnection Support, System Commissioning (Inclusions To be confirmed)',
        warranty: '25-Year Performance Warranty (To be confirmed)',
        property_type: 'Commercial Rooftop / Factory / Multi-Story Residence',
        display_order: 4
      }
    ];

    const insertPlan = db.prepare(`
      INSERT INTO solar_plans (slug, name, capacity, listed_price, estimated_net_price, subsidy_eligible, subsidy_info, components, inclusions, warranty, property_type, display_order)
      VALUES (@slug, @name, @capacity, @listed_price, @estimated_net_price, @subsidy_eligible, @subsidy_info, @components, @inclusions, @warranty, @property_type, @display_order)
    `);

    for (const plan of seedPlans) {
      insertPlan.run(plan);
    }
    console.log('Seeded 4 default solar packages.');
  }

  // Seed Default Business Settings
  const defaultSettings = [
    { key: 'company_name', value: 'SHREE JI SOLAR EXPERTS', description: 'Official company display name' },
    { key: 'tagline', value: 'Powering a Brighter Future with Solar Energy', description: 'Company slogan' },
    { key: 'business_email', value: process.env.BUSINESS_EMAIL || '', description: 'Business email to receive customer enquiries' },
    { key: 'whatsapp_number', value: process.env.WHATSAPP_NUMBER || '', description: 'Official WhatsApp business number (without + symbol, e.g. 9198XXXXXXXX)' },
    { key: 'contact_phone', value: process.env.CONTACT_PHONE || '', description: 'Public contact phone number' },
    { key: 'business_address', value: 'Contact business administrator for service headquarters address', description: 'Official office address' },
    { key: 'service_areas', value: 'Residential Rooftops, Commercial Buildings, Industrial Units & Solar Cleaning Services', description: 'Geographic and service coverage' },
    { key: 'subsidy_notice', value: 'Display proposed subsidy amount (e.g. ₹78,000 under PM Surya Ghar Muft Bijli Yojana) as requiring verification. Subsidy eligibility, amount and disbursement depend on scheme rules, consumer category and discom verification.', description: 'Subsidy regulatory disclosure' },
    { key: 'subsidy_proposed_amount', value: '78000', description: 'Proposed subsidy reference figure in INR' },
    { key: 'subsidy_status', value: 'Subject to verification under PM Surya Ghar / applicable DISCOM scheme', description: 'Current status note for subsidy' },
    { key: 'subsidy_last_verified_date', value: new Date().toISOString().split('T')[0], description: 'Date when subsidy regulations were last reviewed' },
    { key: 'subsidy_official_url', value: 'https://pmsuryaghar.gov.in', description: 'Official portal link for national solar rooftop scheme' },
    { key: 'cleaning_service_headline', value: 'Maximize Generation with Professional Solar Panel Cleaning', description: 'Cleaning page headline' },
    { key: 'cleaning_service_pricing_note', value: 'Custom rates based on panel quantity, roof accessibility, and frequency. Request a personalized quotation.', description: 'Transparent cleaning rates statement' }
  ];

  const getSetting = db.prepare('SELECT id FROM business_settings WHERE key = ?');
  const insertSetting = db.prepare('INSERT INTO business_settings (key, value, description) VALUES (?, ?, ?)');

  for (const item of defaultSettings) {
    const existing = getSetting.get(item.key);
    if (!existing) {
      insertSetting.run(item.key, item.value, item.description);
    }
  }
}

initDb();

module.exports = db;
