const db=require('../config/db'); const {moveStock}=require('../services/stockService');
exports.move=(type)=>(req,res)=>{ const {product_id,quantity,reference}=req.body; const product=moveStock({productId:+product_id,type,quantity:+quantity,reference,userId:req.user.id}); res.json({message:`Stock ${type} successful`,product}); };
exports.movements=(req,res)=>{
 const {type='',product_id='',warehouse_id=''}=req.query;
 let sql=`SELECT m.*,p.name product_name,p.sku,w.name warehouse_name,u.name performed_by_name FROM stock_movements m JOIN products p ON p.id=m.product_id JOIN warehouses w ON w.id=m.warehouse_id JOIN users u ON u.id=m.performed_by WHERE 1=1`;
 const args=[]; if(type){sql+=' AND m.type=?';args.push(type)} if(product_id){sql+=' AND m.product_id=?';args.push(product_id)} if(warehouse_id){sql+=' AND m.warehouse_id=?';args.push(warehouse_id)}
 sql+=' ORDER BY m.created_at DESC,m.id DESC'; res.json({movements:db.prepare(sql).all(...args)});
};
