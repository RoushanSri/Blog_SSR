import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success: false, message: "Validation failed", data: errors.array()});
  }
  next();
}

export const validateCreateBlog = [
    body("title").notEmpty().isLength({min: 3}).withMessage("Title is too short"),
    body("content").notEmpty().isLength({min: 3}).withMessage("Content is too short"),
];

export const validateUpdateBlog = [
    body("id").notEmpty().isNumeric().withMessage("Blog ID is required"),
    body("title").notEmpty().isLength({min: 3}).withMessage("Title is too short"),
    body("content").notEmpty().isLength({min: 3}).withMessage("Content is too short")
];