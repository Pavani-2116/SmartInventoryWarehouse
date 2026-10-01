const bcrypt = require('bcryptjs');
const db = require('../config/db');

const seed = db.transaction(() => {
  const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (userCount === 0) {
    const insertUser = db.prepare('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)');
    insertUser.run('System Admin','admin@inventory.local',bcrypt.hashSync('Admin@123',10),'admin');
    insertUser.run('Warehouse Manager','manager@inventory.local',bcrypt.hashSync('Manager@123',10),'manager');
    insertUser.run('Warehouse Staff','staff@inventory.local',bcrypt.hashSync('Staff@123',10),'staff');
  }

  const whCount = db.prepare('SELECT COUNT(*) AS c FROM warehouses').get().c;
  if (whCount === 0) {
    const wh = db.prepare('INSERT INTO warehouses(name,location,manager,capacity) VALUES(?,?,?,?)');
    wh.run('Central Warehouse','Hyderabad','Warehouse Manager',10000);
    wh.run('North Warehouse','Secunderabad','Warehouse Manager',6000);
  }

  const supCount = db.prepare('SELECT COUNT(*) AS c FROM suppliers').get().c;
  if (supCount === 0) {
    const s = db.prepare('INSERT INTO suppliers(name,contact_person,email,phone,address) VALUES(?,?,?,?,?)');
    s.run('Vertex Supplies','Ravi Kumar','vertex@example.com','9000000001','Hyderabad');
    s.run('Metro Wholesale','Anita Rao','metro@example.com','9000000002','Secunderabad');
    s.run('Prime Distributors','Kiran Das','prime@example.com','9000000003','Vijayawada');
  }

  const prodCount = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
  if (prodCount === 0) {
    const wh1 = db.prepare('SELECT id FROM warehouses WHERE name=?').get('Central Warehouse').id;
    const wh2 = db.prepare('SELECT id FROM warehouses WHERE name=?').get('North Warehouse').id;
    const s1 = db.prepare('SELECT id FROM suppliers WHERE name=?').get('Vertex Supplies').id;
    const s2 = db.prepare('SELECT id FROM suppliers WHERE name=?').get('Metro Wholesale').id;
    const p = db.prepare('INSERT INTO products(sku,name,description,category,quantity,reorder_level,unit_price,warehouse_id,supplier_id) VALUES(?,?,?,?,?,?,?,?,?)');
    p.run('ELEC-001','Wireless Keyboard','Compact office keyboard','Electronics',84,20,1499,wh1,s1);
    p.run('ELEC-002','USB-C Hub','7-in-1 connectivity hub','Electronics',18,20,2299,wh1,s1);
    p.run('GROC-001','Organic Coffee','Premium roasted coffee beans','Grocery',145,40,650,wh2,s2);
    p.run('CLOT-001','Cotton T-Shirt','Plain cotton crew neck','Clothing',0,15,499,wh2,s2);
    p.run('FURN-001','Office Chair','Ergonomic adjustable chair','Furniture',32,10,7999,wh1,s1);
  }

  const movementCount = db.prepare('SELECT COUNT(*) AS c FROM stock_movements').get().c;
  if (movementCount === 0) {
    const adminId = db.prepare('SELECT id FROM users WHERE email=?').get('admin@inventory.local').id;
    const products = db.prepare('SELECT id,warehouse_id,quantity FROM products').all();
    const insert = db.prepare('INSERT INTO stock_movements(product_id,warehouse_id,type,quantity,previous_quantity,new_quantity,reference,performed_by) VALUES(?,?,?,?,?,?,?,?)');
    const log = db.prepare('INSERT INTO inventory_logs(product_id,action,description,user_id) VALUES(?,?,?,?)');
    for (const p of products) {
      insert.run(p.id,p.warehouse_id,'IN',p.quantity,0,p.quantity,'Initial seed',adminId);
      log.run(p.id,'STOCK_IN',`Initial stock of ${p.quantity} units`,adminId);
    }
  }

  const poCount = db.prepare('SELECT COUNT(*) AS c FROM purchase_orders').get().c;
  if (poCount === 0) {
    const s1 = db.prepare('SELECT id FROM suppliers WHERE name=?').get('Vertex Supplies').id;
    const wh1 = db.prepare('SELECT id FROM warehouses WHERE name=?').get('Central Warehouse').id;
    const po = db.prepare('INSERT INTO purchase_orders(supplier_id,warehouse_id,status,order_date,expected_date,total_amount) VALUES(?,?,?,?,?,?)');
    const r = po.run(s1,wh1,'Approved',new Date().toISOString().slice(0,10),new Date(Date.now()+7*86400000).toISOString().slice(0,10),45980);
    const prod = db.prepare('SELECT id,unit_price FROM products WHERE sku=?').get('USB-C Hub');
    db.prepare('INSERT INTO purchase_order_items(purchase_order_id,product_id,quantity,unit_price) VALUES(?,?,?,?)').run(r.lastInsertRowid,prod.id,20,prod.unit_price);
  }
});
seed();
console.log('Seed data created. Demo passwords are documented in README.');
db.close();
