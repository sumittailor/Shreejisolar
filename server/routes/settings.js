const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

// 1. PUBLIC: Get public business info
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM business_settings').all();
    const settings = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    return res.json({ success: true, settings });
  } catch (err) {
    console.error('Get settings error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve business settings.' });
  }
});

// 2. ADMIN: Get detailed settings
router.get('/admin', requireAdmin, (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM business_settings ORDER BY id ASC').all();
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve admin settings.' });
  }
});

// 3. ADMIN: Update settings
router.post('/', requireAdmin, (req, res) => {
  try {
    const updates = req.body; // e.g. { business_email: "...", whatsapp_number: "...", ... }
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid payload.' });
    }

    const updateStmt = db.prepare(`
      INSERT INTO business_settings (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);

    for (const [key, val] of Object.entries(updates)) {
      if (typeof key === 'string' && val !== undefined) {
        updateStmt.run(key, String(val));
      }
    }

    const rows = db.prepare('SELECT key, value FROM business_settings').all();
    const settings = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }

    return res.json({ success: true, message: 'Business settings updated successfully.', settings });
  } catch (err) {
    console.error('Update settings error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
});

module.exports = router;
