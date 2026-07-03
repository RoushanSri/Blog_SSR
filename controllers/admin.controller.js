import { 
    approveRequestService, 
    rejectRequestService,
    assignAdminService,
    revokeRoleService, 
    deleteUserService
} from "../services/admin.service.js";

const approveRoleRequestController = async(req, res)=>{
    const {requestId} = req.body

    if(!requestId){
        return res.status(400).json({message: "Please provide the requestId"})
    }

    try {
        const data = await approveRequestService(requestId);

        if(!data.success){
            return res.status(400).json({message: data.message})
        }

        return res.status(200).json({message: data.message, data: data.data})
        
    } catch (error) {
        console.log("Error in approveRoleRequestController:", error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

const rejectRoleRequestController = async(req, res)=>{
    const {requestId} = req.body

    if(!requestId){
        return res.status(400).json({message: "Please provide the requestId"})
    }

    try {
        const data = await rejectRequestService(requestId);

        if(!data.success){
            return res.status(400).json({message: data.message})
        }

        return res.status(200).json({message: data.message, data: data.data})
        
    } catch (error) {
        console.log("Error in rejectRoleRequestController:", error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

const assignAdminController = async(req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "Please provide the userId" });
    }

    try {
        const data = await assignAdminService(userId);
        if (!data.success) {
            return res.status(400).json({ message: data.message });
        }
        return res.status(200).json({ message: data.message });
    } catch (error) {
        console.log("Error in assignAdminController:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const revokeRoleController = async(req, res) => {
    const { userId, roleName } = req.body;

    if (!userId || !roleName) {
        return res.status(400).json({ message: "Please provide both userId and roleName" });
    }

    try {
        const data = await revokeRoleService(userId, roleName);
        if (!data.success) {
            return res.status(400).json({ message: data.message });
        }
        return res.status(200).json({ message: data.message });
    } catch (error) {
        console.log("Error in revokeRoleController:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteUserController = async (req, res) =>{
    const {id} = req.query

    if(!id){
        return res.status(400).json({message: "Please provide the userId"})
    }

    if(id === req.userId || req?.roles?.some(role=>role.roleName === "SUPER_ADMIN") || req.roles.some(role=>role.roleName === "ADMIN")) 
        return res.status(400).json({message: "This Deletion cant be performed."})

    try {
        const data = await deleteUserService(id);
        if(!data.success){
            return res.status(400).json({message: data.message})
        }
        return res.status(200).json({message: data.message})
    } catch (error) {
        console.log("Error in deleteUserController:", error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export { 
    approveRoleRequestController,
    rejectRoleRequestController,
    assignAdminController,
    revokeRoleController,
    deleteUserController
};