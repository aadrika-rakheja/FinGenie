const jwt=require("jsonwebtoken");
const User=require('../model/User');

//authentication
const protect=async(req,res,next)=>{
    let token;
    
    if(req.headers.authorization?.startsWith("Bearer")){
        try{
            token=req.headers.authorization.split(" ")[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decoded.id).select("-password");
            next();
        }catch(e){
            res.status(401).json({msg:e.message});
        }
    }
    if(!token){
        res.status(401).json({msg:"No token passed"});
    }
}


//authorization
const authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({msg:`Role ${req.user.role} is not allowed`})
        }
        next();
    }
}
module.exports={protect,authorize};