import { Role, User } from "../models/index.js";
import { Op } from "sequelize";

const approveRequestService = async(requestId) => {
    try {
        const request = await Role.findOne({where:{id:requestId }})

        if (!request) {
            return {success: false, message: "Request not found"}
        }

        if(request.isApproved === true){
            return {success: false, message: "Request already approved"}
        }

        request.isApproved = true
        await request.save()

        return {success: true, message: "Request approved successfully"}
    } catch (error) {
        console.log("Error in approveRequestService:", error)
        return {success: false, message: "Internal Server Error"}
    }
}

const rejectRequestService = async(requestId) => {
    try {
        const request = await Role.findOne({where:{id:requestId }});

        if (!request) {
            return {success: false, message: "Request not found"};
        }

        await request.destroy();

        return {success: true, message: "Request rejected successfully"};
    } catch (error) {
        console.log("Error in rejectRequestService:", error);
        return {success: false, message: "Internal Server Error"};
    }
}

const getPendingRequestsService = async () => {
    try {
        const requests = await Role.findAll({
            where: { isApproved: false },
            include: [{ model: User, as: "user", attributes: ["id", "username", "email"] }]
        });
        return { success: true, data: requests };
    } catch (error) {
        console.log("Error in getPendingRequestsService:", error);
        return { success: false, message: "Internal Server Error" };
    }
}

const getAllUsersWithRolesService = async () => {
    try {
        const users = await User.findAll({
            include: [{ model: Role, as: "roles", where: { isApproved: true }, required: false }]
        });
        return { success: true, data: users };
    } catch (error) {
        console.log("Error in getAllUsersWithRolesService:", error);
        return { success: false, message: "Internal Server Error" };
    }
}

const assignAdminService = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) return { success: false, message: "User not found" };

        const rolesToAssign = ["ADMIN", "WRITER", "READER"];
        
        for (const roleName of rolesToAssign) {
            const [role, created] = await Role.findOrCreate({
                where: { userId, roleName },
                defaults: { isApproved: true }
            });
            if (!created && !role.isApproved) {
                role.isApproved = true;
                await role.save();
            }
        }
        
        return { success: true, message: "Admin role and sub-roles assigned successfully" };
    } catch (error) {
        console.log("Error in assignAdminService:", error);
        return { success: false, message: "Internal Server Error" };
    }
}

const revokeRoleService = async (userId, roleName) => {
    try {
        const userRoles = await Role.findAll({ where: { userId, isApproved: true } });
        const hasAdminRole = userRoles.some(r => r.roleName === "ADMIN" || r.roleName === "SUPER_ADMIN");
        
        if (hasAdminRole) {
            return { success: false, message: "Cannot revoke roles from an Admin or Super Admin" };
        }

        const roleToRevoke = await Role.findOne({ where: { userId, roleName } });
        if (!roleToRevoke) {
            return { success: false, message: "Role not found for user" };
        }

        await roleToRevoke.destroy();
        return { success: true, message: `Role ${roleName} revoked successfully` };
    } catch (error) {
        console.log("Error in revokeRoleService:", error);
        return { success: false, message: "Internal Server Error" };
    }
}

const deleteUserService = async (userId) => {
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return {
                success: false,
                message: "User not found"
            };
        }

        await user.destroy();

        return {
            success: true,
            message: "User deleted successfully"
        };

    } catch (error) {
        console.error("Error in deleteUserService:", error);

        return {
            success: false,
            message: "Internal Server Error"
        };
    }
};

export {
    approveRequestService,
    rejectRequestService,
    getPendingRequestsService,
    getAllUsersWithRolesService,
    assignAdminService,
    revokeRoleService,
    deleteUserService
};