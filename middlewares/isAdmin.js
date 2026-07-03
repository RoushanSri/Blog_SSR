import jwt from "jsonwebtoken";
import Role from "../models/role.model.js";
import { Op } from "sequelize";

const isAdmin = async (req, res, next) => {
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
                    [Op.in]: ["ADMIN", "SUPER_ADMIN"],
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
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export { isAdmin };