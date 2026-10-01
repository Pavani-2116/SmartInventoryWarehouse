const db=require('../config/db');
exports.summary=(req,res)=>{
 const totalProducts=db.prepare('SELECT COUNT(*) c FROM products').get().c;
 const totalStock=db.prepare('SELECT COALESCE(SUM(quantity),0) c FROM products').get().c;
 const lowStock=db.prepare('SELECT COUNT(*) c FROM products WHERE quantity <= reorder_level AND quantity > 0').get().c;
 const outOfStock=db.prepare('SELECT COUNT(*) c FROM products WHERE quantity=0').get().c;
 const warehouses=db.prepare('SELECT COUNT(*) c FROM warehouses').get().c;
 const suppliers=db.prepare('SELECT COUNT(*) c FROM suppliers').get().c;
 const inToday=db.prepare("SELECT COALESCE(SUM(quantity),0) c FROM stock_movements WHERE type='IN' AND date(created_at)=date('now')").get().c;
 const outToday=db.prepare("SELECT COALESCE(SUM(quantity),0) c FROM stock_movements WHERE type='OUT' AND date(created_at)=date('now')").get().c;
 const categories=db.prepare('SELECT category,SUM(quantity) value FROM products GROUP BY category ORDER BY value DESC').all();
 const movementChart=db.prepare(`SELECT date(created_at) date,type,SUM(quantity) quantity FROM stock_movements WHERE created_at >= datetime('now','-6 day') GROUP BY date(created_at),type ORDER BY date(created_at)`).all();
 const recent=db.prepare(`SELECT m.*,p.name product_name,p.sku,w.name warehouse_name,u.name performed_by_name FROM stock_movements m JOIN products p ON p.id=m.product_id JOIN warehouses w ON w.id=m.warehouse_id JOIN users u ON u.id=m.performed_by ORDER BY m.created_at DESC LIMIT 8`).all();
 const alerts=db.prepare('SELECT id,sku,name,quantity,reorder_level,warehouse_id FROM products WHERE quantity <= reorder_level ORDER BY quantity ASC LIMIT 8').all();
 res.json({summary:{totalProducts,totalStock,lowStock,outOfStock,warehouses,suppliers,inToday,outToday},categories,movementChart,recent,alerts});
};
