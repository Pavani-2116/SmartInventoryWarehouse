const db=require('../config/db');
exports.list=(req,res)=>res.json({orders:db.prepare(`SELECT po.*,s.name supplier_name,w.name warehouse_name FROM purchase_orders po JOIN suppliers s ON s.id=po.supplier_id JOIN warehouses w ON w.id=po.warehouse_id ORDER BY po.created_at DESC`).all()});
exports.create=(req,res)=>{
 const {supplier_id,warehouse_id,expected_date,items=[]}=req.body;
 if(!supplier_id||!warehouse_id||!Array.isArray(items)||!items.length)return res.status(400).json({message:'Supplier, warehouse and at least one item are required'});
 const tx=db.transaction(()=>{
  let total=0; for(const i of items){if(!Number.isInteger(+i.quantity)||+i.quantity<=0||+i.unit_price<0)throw Object.assign(new Error('Invalid purchase item'),{status:400}); total+=+i.quantity*+i.unit_price}
  const po=db.prepare('INSERT INTO purchase_orders(supplier_id,warehouse_id,status,expected_date,total_amount) VALUES(?,?,?,?,?)').run(+supplier_id,+warehouse_id,'Pending',expected_date||null,total);
  const ins=db.prepare('INSERT INTO purchase_order_items(purchase_order_id,product_id,quantity,unit_price) VALUES(?,?,?,?)');
  items.forEach(i=>ins.run(po.lastInsertRowid,+i.product_id,+i.quantity,+i.unit_price));
  return po.lastInsertRowid;
 });
 const id=tx();res.status(201).json({order:db.prepare(`SELECT po.*,s.name supplier_name,w.name warehouse_name FROM purchase_orders po JOIN suppliers s ON s.id=po.supplier_id JOIN warehouses w ON w.id=po.warehouse_id WHERE po.id=?`).get(id)});
};
exports.update=(req,res)=>{
 const current=db.prepare('SELECT * FROM purchase_orders WHERE id=?').get(req.params.id); if(!current)return res.status(404).json({message:'Purchase order not found'});
 const {status}=req.body; if(!['Pending','Approved','Received','Cancelled'].includes(status))return res.status(400).json({message:'Invalid status'});
 if(current.status==='Received' && status!=='Received')return res.status(400).json({message:'Received orders cannot be reverted'});
 if(status==='Received' && current.status!=='Received'){
   const tx=db.transaction(()=>{
    const items=db.prepare('SELECT * FROM purchase_order_items WHERE purchase_order_id=?').all(current.id);
    for(const i of items){
      const p=db.prepare('SELECT * FROM products WHERE id=?').get(i.product_id);
      if(!p)throw Object.assign(new Error('Purchase order contains missing product'),{status:409});
      const previous=p.quantity,next=previous+i.quantity;
      db.prepare('UPDATE products SET quantity=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(next,p.id);
      db.prepare(`INSERT INTO stock_movements(product_id,warehouse_id,type,quantity,previous_quantity,new_quantity,reference,performed_by) VALUES(?,?,?,?,?,?,?,?)`).run(p.id,current.warehouse_id,'IN',i.quantity,previous,next,`PO-${current.id}`,req.user.id);
      db.prepare(`INSERT INTO inventory_logs(product_id,action,description,user_id) VALUES(?,?,?,?)`).run(p.id,'PURCHASE_RECEIVED',`Received ${i.quantity} units from PO-${current.id}`,req.user.id);
    }
    db.prepare("UPDATE purchase_orders SET status='Received',received_at=CURRENT_TIMESTAMP WHERE id=?").run(current.id);
   }); tx();
 } else db.prepare('UPDATE purchase_orders SET status=? WHERE id=?').run(status,current.id);
 res.json({order:db.prepare(`SELECT po.*,s.name supplier_name,w.name warehouse_name FROM purchase_orders po JOIN suppliers s ON s.id=po.supplier_id JOIN warehouses w ON w.id=po.warehouse_id WHERE po.id=?`).get(current.id)});
};
