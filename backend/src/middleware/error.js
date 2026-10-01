function notFound(req,res){ res.status(404).json({message:'Route not found'}); }
function errorHandler(err,req,res,next){
  console.error(err);
  if(err.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({message:'A record with this unique value already exists'});
  if(err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') return res.status(409).json({message:'This record is referenced by other data'});
  res.status(err.status || 500).json({message:err.message || 'Internal server error'});
}
module.exports={notFound,errorHandler};
