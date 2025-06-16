const jwt = require('jsonwebtoken');


const authMiddleware = function(req,res,next){

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({
            success : false,
            message : "No token provided"
        })
    }

    // decode this token 
    try{
        const decodedTokenInfo = jwt.verify(token,process.env.JWT_SECRET_KEY)
        console.log(decodedTokenInfo);
        
        req.userInfo = decodedTokenInfo;
        next();

    }catch(e){
        return res.status(500).json({
             success : false,
            message : "No token provided"
        })
    }

    
    
}

module.exports = authMiddleware; 