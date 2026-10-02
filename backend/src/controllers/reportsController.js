const db = require('../config/db');

// Inventory Report
exports.inventory = (req, res) => {
  try {
    const report = db
      .prepare(`
        SELECT
          p.sku,
          p.name,
          p.category,
          p.quantity,
          p.reorder_level,
          w.name AS warehouse_name,
          p.price AS unit_price
        FROM products p
        LEFT JOIN warehouses w
          ON w.id = p.warehouse_id
        ORDER BY p.name
      `)
      .all();

    res.json({ report });
  } catch (error) {
    console.error('Inventory report error:', error);
    res.status(500).json({
      message: 'Failed to load inventory report'
    });
  }
};


// Stock Movement Report
exports.movements = (req, res) => {
  try {
    const report = db
      .prepare(`
        SELECT
          m.id,
          p.name AS product_name,
          p.sku,
          m.type,
          m.quantity,
          w.name AS warehouse_name,
          u.name AS performed_by_name,
          m.reference,
          m.created_at
        FROM stock_movements m
        JOIN products p
          ON p.id = m.product_id
        LEFT JOIN warehouses w
          ON w.id = m.warehouse_id
        LEFT JOIN users u
          ON u.id = m.performed_by
        ORDER BY m.created_at DESC
      `)
      .all();

    res.json({ report });
  } catch (error) {
    console.error('Movement report error:', error);
    res.status(500).json({
      message: 'Failed to load movement report'
    });
  }
};


// Low Stock Report
exports.lowStock = (req, res) => {
  try {
    const report = db
      .prepare(`
        SELECT
          p.sku,
          p.name,
          p.quantity,
          p.reorder_level,
          w.name AS warehouse_name
        FROM products p
        LEFT JOIN warehouses w
          ON w.id = p.warehouse_id
        WHERE p.quantity <= p.reorder_level
        ORDER BY p.quantity
      `)
      .all();

    res.json({ report });
  } catch (error) {
    console.error('Low stock report error:', error);
    res.status(500).json({
      message: 'Failed to load low stock report'
    });
  }
};