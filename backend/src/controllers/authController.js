const db=require('../config/db');
const {comparePassword,signToken}=require('../utils/auth');
exports.login=(req,res)=>{
  const {email,password}=req.body||{};
  if(!email||!password) return res.status(400).json({message:'Email and password are required'});
  const user=db.prepare('SELECT * FROM users WHERE email=?').get(email.toLowerCase().trim());
  if(!user || !comparePassword(password,user.password_hash)) return res.status(401).json({message:'Invalid email or password'});
  res.json({token:signToken(user),user:{id:user.id,name:user.name,email:user.email,role:user.role}});
};
exports.me=(req,res)=>res.json({user:req.user});
