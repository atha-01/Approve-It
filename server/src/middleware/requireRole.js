export function requireRole(role){
    function checkRole (req,res,next){
        if(req.user.role!==role){
            return res.status(403).json({
                message: "Forbidden: insufficient permissions"
            })
        }
        return next();
    }
    return checkRole;
}