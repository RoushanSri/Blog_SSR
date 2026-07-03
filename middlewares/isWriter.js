import jwt from "jsonwebtoken";
import Role from "../models/role.model.js";
import { Op } from "sequelize";

const isWriter = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthenticated",
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const role = await Role.findOne({
            where: {
                userId: decodedToken.id,
                roleName: {
                    [Op.in]: ["WRITER"],
                },
                isApproved: true,
            },
        });

        if (!role) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        req.userId = decodedToken.id;

        const roles = await Role.findAll({
            where:{
                userId: decodedToken.id,
                isApproved: true,
            },
            attributes: ["roleName"]
        })
        req.roles = roles.map((role) => role.roleName);
        
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export { isWriter };