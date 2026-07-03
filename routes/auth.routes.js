import { Router } from "express"
import {registerController, loginController, logoutController} from "../controllers/auth.controller.js"
import { handleValidationErrors, validateLogin, validateRegister } from "../validations/auth.validation.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
const router = Router()


router.post("/register", validateRegister, handleValidationErrors, registerController)
router.post("/login", validateLogin, handleValidationErrors, loginController)
router.post("/logout", isAuthenticated, logoutController)

export default router