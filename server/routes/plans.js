const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

// 1. PUBLIC: Get all active solar plans
router.get('/', (req, res) => {
  try {
    const plans = db.prepare(`
      SELECT * FROM solar_plans 
      WHERE is_active = 1 
      ORDER BY display_order ASC, listed_price ASC
    `).all();
    return res.json({ success: true, plans });
  } catch (err) {
    console.error('Get plans error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve solar plans.' });
  }
});

// 2. ADMIN: Get all plans (including inactive)
router.get('/admin/all', requireAdmin, (req, res) => {
  try {
    const plans = db.prepare('SELECT * FROM solar_plans ORDER BY display_order ASC, listed_price ASC').all();
    return res.json({ success: true, plans });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve plans for admin.' });
  }
});

// 3. PUBLIC: Get single plan by slug or ID
router.get('/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;
    const plan = db.prepare('SELECT * FROM solar_plans WHERE slug = ? OR id = ?').get(identifier, identifier);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Solar package not found.' });
    }
    return res.json({ success: true, plan });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve package.' });
  }
});

// 4. ADMIN: Create new solar plan
router.post('/', requireAdmin, (req, res) => {
  try {
    const {
      name,
      capacity,
      listed_price,
      estimated_net_price,
      subsidy_eligible,
      subsidy_info,
      components,
      inclusions,
      warranty,
      property_type,
      is_active,
      display_order
    } = req.body;

    if (!name || !capacity || !listed_price) {
      return res.status(400).json({ success: false, message: 'Name, capacity and listed price are required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const stmt = db.prepare(`
      INSERT INTO solar_plans (
        slug, name, capacity, listed_price, estimated_net_price,
        subsidy_eligible, subsidy_info, components, inclusions, warranty,
        property_type, is_active, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      slug,
      name.trim(),
      capacity.trim(),
      parseInt(listed_price, 10),
      estimated_net_price || 'Subject to scheme eligibility verification',
      subsidy_eligible !== undefined ? (subsidy_eligible ? 1 : 0) : 1,
      subsidy_info || 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
      components || 'To be confirmed',
      inclusions || 'To be confirmed',
      warranty || 'To be confirmed',
      property_type || 'Residential & Commercial',
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      display_order ? parseInt(display_order, 10) : 0
    );

    const created = db.prepare('SELECT * FROM solar_plans WHERE slug = ?').get(slug);
    return res.status(201).json({ success: true, message: 'Solar package created successfully.', plan: created });
  } catch (err) {
    console.error('Create plan error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create solar package.' });
  }
});

// 5. ADMIN: Update solar plan
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT id FROM solar_plans WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Solar package not found.' });
    }

    const {
      name,
      capacity,
      listed_price,
      estimated_net_price,
      subsidy_eligible,
      subsidy_info,
      components,
      inclusions,
      warranty,
      property_type,
      is_active,
      display_order
    } = req.body;

    const stmt = db.prepare(`
      UPDATE solar_plans SET
        name = COALESCE(?, name),
        capacity = COALESCE(?, capacity),
        listed_price = COALESCE(?, listed_price),
        estimated_net_price = COALESCE(?, estimated_net_price),
        subsidy_eligible = COALESCE(?, subsidy_eligible),
        subsidy_info = COALESCE(?, subsidy_info),
        components = COALESCE(?, components),
        inclusions = COALESCE(?, inclusions),
        warranty = COALESCE(?, warranty),
        property_type = COALESCE(?, property_type),
        is_active = COALESCE(?, is_active),
        display_order = COALESCE(?, display_order),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      name !== undefined ? name.trim() : null,
      capacity !== undefined ? capacity.trim() : null,
      listed_price !== undefined ? parseInt(listed_price, 10) : null,
      estimated_net_price !== undefined ? estimated_net_price : null,
      subsidy_eligible !== undefined ? (subsidy_eligible ? 1 : 0) : null,
      subsidy_info !== undefined ? subsidy_info : null,
      components !== undefined ? components : null,
      inclusions !== undefined ? inclusions : null,
      warranty !== undefined ? warranty : null,
      property_type !== undefined ? property_type : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      display_order !== undefined ? parseInt(display_order, 10) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM solar_plans WHERE id = ?').get(id);
    return res.json({ success: true, message: 'Solar package updated successfully.', plan: updated });
  } catch (err) {
    console.error('Update plan error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update solar package.' });
  }
});

// 6. ADMIN: Delete solar plan
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT id FROM solar_plans WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Solar package not found.' });
    }

    db.prepare('DELETE FROM solar_plans WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Solar package deleted successfully.' });
  } catch (err) {
    console.error('Delete plan error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete solar package.' });
  }
});

module.exports = router;
