const {verifyToken} = require('../utils/auth');

function requireAuth(req,res,next){
  const header = req.headers.authorization || '';
  if(!header.startsWith('Bearer ')) return res.status(401).json({message:'Authentication required'});
  try { req.user = verifyToken(header.slice(7)); next(); }
  catch(e){ return res.status(401).json({message:'Invalid or expired token'}); }
}
function allowRoles(...roles){
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)) return res.status(403).json({message:'You do not have permission for this action'});
    next();
  };
}
module.exports = {requireAuth,allowRoles};
