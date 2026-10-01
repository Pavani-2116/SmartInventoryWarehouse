const db = require('./db');

db.pragma('foreign_keys = ON');

const seed = db.transaction(() => {
  // Users
  const users = [
    ['Admin User', 'admin@inventory.local', 'Admin@123', 'admin'],
    ['Warehouse Manager', 'manager@inventory.local', 'Manager@123', 'manager'],
    ['Warehouse Staff', 'staff@inventory.local', 'Staff@123', 'staff']
  ];

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users
    (name, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `);

  for (const user of users) {
    insertUser.run(...user);
  }

  // Warehouses
  const insertWarehouse = db.prepare(`
    INSERT OR IGNORE INTO warehouses
    (name, code, location)
    VALUES (?, ?, ?)
  `);

  insertWarehouse.run(
    'Main Warehouse',
    'WH-MAIN',
    'Hyderabad'
  );

  insertWarehouse.run(
    'Secondary Warehouse',
    'WH-SEC',
    'Bengaluru'
  );

  const mainWarehouse = db
    .prepare(`SELECT id FROM warehouses WHERE code = 'WH-MAIN'`)
    .get();

  const secondaryWarehouse = db
    .prepare(`SELECT id FROM warehouses WHERE code = 'WH-SEC'`)
    .get();

  // Suppliers
  const insertSupplier = db.prepare(`
    INSERT OR IGNORE INTO suppliers
    (name, email, phone, address)
    VALUES (?, ?, ?, ?)
  `);

  insertSupplier.run(
    'TechSource India',
    'sales@techsource.example',
    '9876543210',
    'Hyderabad'
  );

  insertSupplier.run(
    'OfficeHub Supplies',
    'orders@officehub.example',
    '9123456780',
    'Bengaluru'
  );

  const supplier1 = db
    .prepare(`SELECT id FROM suppliers WHERE name = 'TechSource India'`)
    .get();

  const supplier2 = db
    .prepare(`SELECT id FROM suppliers WHERE name = 'OfficeHub Supplies'`)
    .get();

  // Products
  const products = [
    {
      sku: 'SKU-LAP-001',
      name: 'Business Laptop',
      category: 'Electronics',
      unit: 'pcs',
      quantity: 24,
      reorder: 10,
      warehouse: mainWarehouse.id,
      supplier: supplier1.id,
      price: 65000
    },
    {
      sku: 'SKU-MON-001',
      name: '24-inch Monitor',
      category: 'Electronics',
      unit: 'pcs',
      quantity: 42,
      reorder: 12,
      warehouse: mainWarehouse.id,
      supplier: supplier1.id,
      price: 12500
    },
    {
      sku: 'SKU-KBD-001',
      name: 'Mechanical Keyboard',
      category: 'Accessories',
      unit: 'pcs',
      quantity: 68,
      reorder: 20,
      warehouse: mainWarehouse.id,
      supplier: supplier2.id,
      price: 3200
    },
    {
      sku: 'SKU-MSE-001',
      name: 'Wireless Mouse',
      category: 'Accessories',
      unit: 'pcs',
      quantity: 15,
      reorder: 25,
      warehouse: secondaryWarehouse.id,
      supplier: supplier2.id,
      price: 1500
    },
    {
      sku: 'SKU-CHR-001',
      name: 'Ergonomic Chair',
      category: 'Furniture',
      unit: 'pcs',
      quantity: 8,
      reorder: 10,
      warehouse: mainWarehouse.id,
      supplier: supplier2.id,
      price: 9800
    },
    {
      sku: 'SKU-DSK-001',
      name: 'Office Desk',
      category: 'Furniture',
      unit: 'pcs',
      quantity: 31,
      reorder: 8,
      warehouse: secondaryWarehouse.id,
      supplier: supplier2.id,
      price: 14500
    }
  ];

  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products
    (sku, name, category, unit, quantity, reorder_level,
     warehouse_id, supplier_id, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of products) {
    insertProduct.run(
      p.sku,
      p.name,
      p.category,
      p.unit,
      p.quantity,
      p.reorder,
      p.warehouse,
      p.supplier,
      p.price
    );
  }

  const admin = db
    .prepare(`SELECT id FROM users WHERE email = 'admin@inventory.local'`)
    .get();

  // Stock movements
  const insertMovement = db.prepare(`
    INSERT INTO stock_movements
    (product_id, warehouse_id, type, quantity,
     reference, performed_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertLog = db.prepare(`
    INSERT INTO inventory_logs
    (product_id, action, details, performed_by)
    VALUES (?, ?, ?, ?)
  `);

  for (const p of products) {
    const product = db
      .prepare(`SELECT id FROM products WHERE sku = ?`)
      .get(p.sku);

    // IMPORTANT:
    // Never create a stock movement with quantity 0.
    if (p.quantity > 0) {
      insertMovement.run(
        product.id,
        p.warehouse,
        'IN',
        p.quantity,
        'INITIAL-SEED',
        admin.id
      );

      insertLog.run(
        product.id,
        'OPENING_STOCK',
        `Initial stock: ${p.quantity} units`,
        admin.id
      );
    }
  }
});

seed();

console.log('Seed data created successfully.');