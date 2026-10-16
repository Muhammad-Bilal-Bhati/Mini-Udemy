const jwt = require('jsonwebtoken');


const isAuthenticated = (req,res,next)=>{
  try { const token = req.cookies.token
    if(!token){
        return res.status(401).json({message:'Unauthorized! No token provided.'})
    }
      const decoded =jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded;
        next();
    }
        catch(err){
            return res.status(401).json({message:'Unauthorized! Invalid token.'})
        }
}   

const authorizeRoles = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message:'Forbidden! You do not have permission to access this resource.'})
        }
        next();
    }
}

module.exports = {isAuthenticated,authorizeRoles}