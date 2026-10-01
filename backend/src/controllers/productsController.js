const db=require('../config/db');
exports.list=(req,res)=>{
  const {search='',category='',stock=''}=req.query;
  let sql=`SELECT p.*,w.name warehouse_name,s.name supplier_name FROM products p JOIN warehouses w ON w.id=p.warehouse_id LEFT JOIN suppliers s ON s.id=p.supplier_id WHERE 1=1`;
  const args=[];
  if(search){sql+=' AND (p.name LIKE ? OR p.sku LIKE ?)';args.push(`%${search}%`,`%${search}%`);}
  if(category){sql+=' AND p.category=?';args.push(category);}
  if(stock==='low') sql+=' AND p.quantity <= p.reorder_level AND p.quantity > 0';
  if(stock==='out') sql+=' AND p.quantity = 0';
  if(stock==='in') sql+=' AND p.quantity > p.reorder_level';
  sql+=' ORDER BY p.updated_at DESC';
  res.json({products:db.prepare(sql).all(...args)});
};
exports.get=(req,res)=>{const p=db.prepare(`SELECT p.*,w.name warehouse_name,s.name supplier_name FROM products p JOIN warehouses w ON w.id=p.warehouse_id LEFT JOIN suppliers s ON s.id=p.supplier_id WHERE p.id=?`).get(req.params.id); if(!p)return res.status(404).json({message:'Product not found'}); res.json({product:p});};
exports.create=(req,res)=>{
  const {sku,name,description='',category,quantity=0,reorder_level=0,unit_price=0,warehouse_id,supplier_id=null}=req.body;
  if(!sku||!name||!category||!warehouse_id)return res.status(400).json({message:'SKU, name, category and warehouse are required'});
  if(!Number.isInteger(+quantity)||+quantity<0||!Number.isInteger(+reorder_level)||+reorder_level<0||+unit_price<0)return res.status(400).json({message:'Invalid numeric product values'});
  try{
    const r=db.prepare(`INSERT INTO products(sku,name,description,category,quantity,reorder_level,unit_price,warehouse_id,supplier_id) VALUES(?,?,?,?,?,?,?,?,?)`).run(sku.trim(),name.trim(),description,category,+quantity,+reorder_level,+unit_price,+warehouse_id,supplier_id?+supplier_id:null);
    const p=db.prepare('SELECT * FROM products WHERE id=?').get(r.lastInsertRowid);
    if(+quantity>0) db.prepare(`INSERT INTO inventory_logs(product_id,action,description,user_id) VALUES(?,?,?,?)`).run(p.id,'PRODUCT_CREATED',`Created with ${quantity} units`,req.user.id);
    res.status(201).json({product:p});
  }catch(e){throw e}
};
exports.update=(req,res)=>{
  const {sku,name,description='',category,quantity,reorder_level,unit_price,warehouse_id,supplier_id=null}=req.body;
  if(!sku||!name||!category||!warehouse_id)return res.status(400).json({message:'SKU, name, category and warehouse are required'});
  const existing=db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id); if(!existing)return res.status(404).json({message:'Product not found'});
  const q=quantity===undefined?existing.quantity:+quantity;
  if(!Number.isInteger(q)||q<0)return res.status(400).json({message:'Quantity must be a non-negative integer'});
  db.prepare(`UPDATE products SET sku=?,name=?,description=?,category=?,quantity=?,reorder_level=?,unit_price=?,warehouse_id=?,supplier_id=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`)
    .run(sku.trim(),name.trim(),description,category,q,+reorder_level,+unit_price,+warehouse_id,supplier_id?+supplier_id:null,req.params.id);
  db.prepare(`INSERT INTO inventory_logs(product_id,action,description,user_id) VALUES(?,?,?,?)`).run(req.params.id,'PRODUCT_UPDATED','Product details updated',req.user.id);
  res.json({product:db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id)});
};
exports.remove=(req,res)=>{
  const p=db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id); if(!p)return res.status(404).json({message:'Product not found'});
  const count=db.prepare('SELECT COUNT(*) c FROM stock_movements WHERE product_id=?').get(p.id).c;
  if(count)return res.status(409).json({message:'Product has stock history and cannot be deleted. Edit it or keep it for audit integrity.'});
  db.prepare('DELETE FROM products WHERE id=?').run(p.id); res.json({message:'Product deleted'});
};
