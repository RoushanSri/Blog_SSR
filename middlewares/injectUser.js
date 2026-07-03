import jwt from "jsonwebtoken";
import { getMeService } from "../services/user.service.js";

const injectUser = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            res.locals.user = null;
            return next();
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userData = await getMeService(decodedToken.id);

        if (userData.success) {
            res.locals.user = userData.data;
            res.locals.roles = userData.data.roles.map(role => role.roleName);
        } else {
            res.locals.user = null;
            res.locals.roles = [];
        }

        next();
    } catch (error) {
        res.locals.user = null;
        next();
    }
};

export default injectUser;
