import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.js";
import { 
    approveRoleRequestController,
    rejectRoleRequestController,
    assignAdminController,
    revokeRoleController, 
    deleteUserController
} from "../controllers/admin.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = Router();

router.post("/approve-role", isAdmin, approveRoleRequestController);
router.post("/reject-role", isAdmin, rejectRoleRequestController);
router.post("/assign-admin", isAdmin, assignAdminController);
router.post("/revoke-role", isAdmin, revokeRoleController);
router.delete("/delete-user", isAdmin, isAuthenticated, deleteUserController)

export default router;
