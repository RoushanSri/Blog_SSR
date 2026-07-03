import { Router } from "express";
import { createBlogController, deleteBlogController, getBlogs, getCategoriesController, updateBlogController, getBlogById, likeBlogController, unlikeBlogController } from "../controllers/blog.controller.js";
import { isWriter } from "../middlewares/isWriter.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = Router()

router.post("/create", isWriter , createBlogController)

router.get("/get-blogs", isAuthenticated , getBlogs)

router.get("/get-blog/:id", isAuthenticated, getBlogById)

router.get("/categories", isAuthenticated, getCategoriesController)

router.delete("/delete-blog", isAuthenticated, deleteBlogController)

router.put("/update-blog", isWriter, updateBlogController)

router.post("/like-blog", isAuthenticated, likeBlogController)

router.delete("/unlike-blog", isAuthenticated, unlikeBlogController)

export default router