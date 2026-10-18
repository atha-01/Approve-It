import jwt from "jsonwebtoken"
export function auth( req, res , next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
         
        return res.status(401).json({
            message:"Access Denied. No token Provided."
        });
    }
    if(!authHeader.startsWith("Bearer ")){
        
        return res.status(401).json({
            message:"Access Denied. No token Provided."
        });
    }
    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);  
        req.user = decoded;
        return next();
    }
    catch (error) {
    return res.status(401).json({
        message: "Invalid or expired token"
    });
}
} 