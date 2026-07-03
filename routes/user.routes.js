import { Router } from "express";
import { getMeController, changePasswordController, changeUsernameController, requestRoleController, getUserProfileController, updateAboutMeController } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = Router();

router.get("/me", isAuthenticated, getMeController);
router.get("/:id", isAuthenticated, getUserProfileController);
router.put("/change-password", isAuthenticated, changePasswordController);
router.put("/change-username", isAuthenticated, changeUsernameController);
router.post("/request-role", isAuthenticated, requestRoleController);
router.patch("/about-me", isAuthenticated, updateAboutMeController)

export default router;
