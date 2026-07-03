import jwt from "jsonwebtoken"
import Role from "../models/role.model.js"
const isAuthenticated = async (req, res, next)=>{
    try {
        const token = req.cookies.accessToken
        if(!token){
            return res.status(401).json({success: false, message: "Unauthenticated"})
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decodedToken.id

        const roles = await Role.findAll({
            where:{
                userId: decodedToken.id,
                isApproved: true,
            },
            attributes: ["roleName"]
        })
        req.roles = roles.map((role) => role.roleName);
        
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: "Internal server error"})
    }
}

export default isAuthenticated