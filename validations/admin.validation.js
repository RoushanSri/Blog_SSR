import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success: false, message: "Validation failed", data: errors.array()});
  }
  next();
}

export const validateApproveRequest = [
    body("requestId").notEmpty().isNumeric().withMessage("Request ID is required")
]