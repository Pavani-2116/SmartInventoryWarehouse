const db = require('../config/db');

function moveStock({productId,type,quantity,reference,userId}){
  if(!Number.isInteger(quantity) || quantity <= 0) {
    const e=new Error('Quantity must be a positive integer'); e.status=400; throw e;
  }
  const tx = db.transaction(() => {
    const product = db.prepare('SELECT * FROM products WHERE id=?').get(productId);
    if(!product){ const e=new Error('Product not found'); e.status=404; throw e; }
    const previous = product.quantity;
    if(type === 'OUT' && quantity > previous){
      const e=new Error(`Insufficient stock. Available: ${previous}, requested: ${quantity}`); e.status=400; throw e;
    }
    const next = type === 'IN' ? previous + quantity : previous - quantity;
    db.prepare('UPDATE products SET quantity=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(next,productId);
    db.prepare(`INSERT INTO stock_movements(product_id,warehouse_id,type,quantity,previous_quantity,new_quantity,reference,performed_by)
      VALUES(?,?,?,?,?,?,?,?)`).run(productId,product.warehouse_id,type,quantity,previous,next,reference || null,userId);
    db.prepare('INSERT INTO inventory_logs(product_id,action,description,user_id) VALUES(?,?,?,?)')
      .run(productId,`STOCK_${type}`,`${type} ${quantity} units: ${previous} → ${next}`,userId);
    return db.prepare(`SELECT p.*, w.name warehouse_name FROM products p JOIN warehouses w ON w.id=p.warehouse_id WHERE p.id=?`).get(productId);
  });
  return tx();
}
module.exports={moveStock};
