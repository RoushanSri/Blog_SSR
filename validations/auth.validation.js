import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success: false, message: "Validation failed", data: errors.array()});
  }
  next();
}

export const validateRegister = [
    body("email").notEmpty().isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required").isLength({min: 8}).withMessage("Password must be at least 8 characters long"),
    body("confirmPassword").notEmpty().withMessage("Confirm Password is required").custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error("Passwords do not match")
        }
        return true
    }),
    body("username").notEmpty().withMessage("Username is required"),
    body("rolesRequested").isArray({min: 1}).withMessage("Roles are required"),
];

export const validateLogin = [
    body("email").notEmpty().isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
]