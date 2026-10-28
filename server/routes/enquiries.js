const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');
const { sendEnquiryNotification } = require('../services/email');

// Helper to generate unique reference number: SJS-YYYYMMDD-XXXX
function generateReferenceNo() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SJS-${dateStr}-${randomChars}`;
}

// 1. PUBLIC: Create Enquiry
router.post('/', async (req, res) => {
  try {
    const {
      customer_name,
      mobile,
      email,
      city,
      property_type,
      service_required,
      desired_capacity,
      selected_package,
      monthly_bill,
      panel_count,
      preferred_date,
      additional_notes
    } = req.body;

    // Field validations
    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required.' });
    }
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, message: 'Valid mobile number is required.' });
    }
    // Clean mobile and test digits (allows +country code)
    const cleanMobile = mobile.trim();
    if (!/^[+]?[\d\s-]{7,15}$/.test(cleanMobile)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid phone number (7-15 digits).' });
    }

    if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (!city || !city.trim()) {
      return res.status(400).json({ success: false, message: 'City and service location are required.' });
    }

    if (!property_type) {
      return res.status(400).json({ success: false, message: 'Property type is required.' });
    }

    if (!service_required) {
      return res.status(400).json({ success: false, message: 'Service required is required.' });
    }

    // Generate reference number
    let reference_no = generateReferenceNo();
    let collisionCheck = db.prepare('SELECT id FROM enquiries WHERE reference_no = ?').get(reference_no);
    while (collisionCheck) {
      reference_no = generateReferenceNo();
      collisionCheck = db.prepare('SELECT id FROM enquiries WHERE reference_no = ?').get(reference_no);
    }

    // Insert into database
    const insertStmt = db.prepare(`
      INSERT INTO enquiries (
        reference_no, customer_name, mobile, email, city, property_type,
        service_required, desired_capacity, selected_package, monthly_bill,
        panel_count, preferred_date, additional_notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
    `);

    insertStmt.run(
      reference_no,
      customer_name.trim(),
      cleanMobile,
      email ? email.trim() : null,
      city.trim(),
      property_type,
      service_required,
      desired_capacity || null,
      selected_package || null,
      monthly_bill || null,
      panel_count ? parseInt(panel_count, 10) || 0 : 0,
      preferred_date || null,
      additional_notes ? additional_notes.trim() : null
    );

    // Retrieve inserted record
    const createdEnquiry = db.prepare('SELECT * FROM enquiries WHERE reference_no = ?').get(reference_no);

    // Fetch configured business email
    const businessEmailSetting = db.prepare('SELECT value FROM business_settings WHERE key = ?').get('business_email');
    const businessEmail = businessEmailSetting ? businessEmailSetting.value : null;

    // Send email notification (non-blocking for customer response)
    sendEnquiryNotification({ enquiry: createdEnquiry, businessEmail })
      .then(emailResult => {
        db.prepare('UPDATE enquiries SET email_notification_status = ? WHERE id = ?').run(
          emailResult.status || 'dispatched',
          createdEnquiry.id
        );
      })
      .catch(err => {
        console.error('Email dispatch error:', err.message);
        db.prepare('UPDATE enquiries SET email_notification_status = "failed" WHERE id = ?').run(createdEnquiry.id);
      });

    return res.status(201).json({
      success: true,
      reference_no,
      message: 'Your solar enquiry has been recorded successfully. Our team will contact you shortly.',
      enquiry: {
        reference_no,
        customer_name: createdEnquiry.customer_name,
        service_required: createdEnquiry.service_required,
        city: createdEnquiry.city
      }
    });

  } catch (err) {
    console.error('Create enquiry error:', err);
    return res.status(500).json({ success: false, message: 'Server error while processing enquiry. Please try again.' });
  }
});

// 2. ADMIN: List enquiries with search, filter, pagination
router.get('/', requireAdmin, (req, res) => {
  try {
    const { search, status, service, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    let conditions = [];
    let params = [];

    if (search && search.trim()) {
      conditions.push('(customer_name LIKE ? OR reference_no LIKE ? OR mobile LIKE ? OR city LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (service && service !== 'all') {
      conditions.push('service_required = ?');
      params.push(service);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM enquiries ${whereClause}`;
    const total = db.prepare(countQuery).get(...params).total;

    const listQuery = `
      SELECT * FROM enquiries
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const enquiries = db.prepare(listQuery).all(...params, parseInt(limit, 10), offset);

    return res.json({
      success: true,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
      enquiries
    });
  } catch (err) {
    console.error('List enquiries error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch enquiries.' });
  }
});

// 3. ADMIN: Dashboard stats
router.get('/stats/summary', requireAdmin, (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM enquiries').get().count;
    const newCount = db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'New'").get().count;
    const contacted = db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'Contacted'").get().count;
    const quotationSent = db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'Quotation Sent'").get().count;
    const converted = db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'Converted'").get().count;
    const closed = db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'Closed'").get().count;

    const recentEnquiries = db.prepare(`
      SELECT id, reference_no, customer_name, mobile, city, service_required, status, created_at
      FROM enquiries
      ORDER BY created_at DESC
      LIMIT 5
    `).all();

    return res.json({
      success: true,
      stats: {
        total,
        new: newCount,
        contacted,
        quotationSent,
        converted,
        closed
      },
      recentEnquiries
    });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load stats.' });
  }
});

// 4. ADMIN: Export CSV
router.get('/export/csv', requireAdmin, (req, res) => {
  try {
    const enquiries = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all();

    const headers = [
      'Reference No',
      'Date',
      'Customer Name',
      'Mobile',
      'Email',
      'City',
      'Property Type',
      'Service Required',
      'Capacity',
      'Selected Package',
      'Monthly Bill',
      'Panel Count',
      'Preferred Date',
      'Status',
      'Internal Notes',
      'Additional Notes'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = enquiries.map(e => [
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
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="shree-ji-solar-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`);
    return res.send(csvContent);
  } catch (err) {
    console.error('CSV export error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate CSV export.' });
  }
});

// 5. ADMIN: Single Enquiry Details
router.get('/:id', requireAdmin, (req, res) => {
  try {
    const enquiry = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }
    return res.json({ success: true, enquiry });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch enquiry.' });
  }
});

// 6. ADMIN: Update enquiry status or notes
router.patch('/:id', requireAdmin, (req, res) => {
  try {
    const { status, internal_notes } = req.body;
    const enquiry = db.prepare('SELECT id FROM enquiries WHERE id = ?').get(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    const updates = [];
    const params = [];

    if (status !== undefined) {
      const validStatuses = ['New', 'Contacted', 'Quotation Sent', 'Converted', 'Closed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status.' });
      }
      updates.push('status = ?');
      params.push(status);
    }

    if (internal_notes !== undefined) {
      updates.push('internal_notes = ?');
      params.push(internal_notes);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);

    db.prepare(`UPDATE enquiries SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const updated = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(req.params.id);
    return res.json({ success: true, message: 'Enquiry updated successfully.', enquiry: updated });
  } catch (err) {
    console.error('Update enquiry error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update enquiry.' });
  }
});

module.exports = router;
