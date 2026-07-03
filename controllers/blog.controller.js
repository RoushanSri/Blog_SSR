import { CATEGORIES } from "../models/blog.model.js";
import { createBlogService, deleteBlogService, updateBlogService, getBlogByIdService, getBlogsService, getCategoriesService, likeBlogService, unlikeBlogService } from "../services/blog.service.js";

const createBlogController = async(req, res)=>{
    try {
        const {title, content, category} = req.body;

        if(!title || !content){
            return res.status(400).json({success:false, message:"Title and content are required"})
        }

        if(!category || !CATEGORIES.includes(category)){
            return res.status(400).json({success:false, message:"A valid category is required"})
        }

        const data = await createBlogService(title, content, category, req.userId);

        if(!data.success){
            return res.status(400).json({success:false, message:data.message})
        }

        return res.status(200).json({success:true, message:data.message})
    } catch (error) {
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

const getBlogs = async(req, res)=>{
    try {
        if(!req.roles.includes("READER")){
            return res.status(403).json({success:false, message:"You are not authorized to get blogs"})
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const category = req.query.category || null;
        const authorId = req.query.authorId || null;

        const data = await getBlogsService(page, limit, category, authorId);
        
        if (!data.success) {
            return res.status(500).json({success: false, message: data.message});
        }

        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            ...data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

const getCategoriesController = async(req, res)=>{
    try {
        if(!req.roles.includes("READER")){
            return res.status(403).json({success:false, message:"You are not authorized"})
        }

        const data = await getCategoriesService();
        if (!data.success) {
            return res.status(500).json({success: false, message: data.message});
        }

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

const deleteBlogController = async(req, res)=>{
    const {id} = req.body;

    try{

        if(!id) 
            return res.status(400).json({success:false, message:"Blog ID is required"})
        
        const data = await deleteBlogService(id, req);

        if(!data.success){
            return res.status(400).json({success:false, message:data.message})
        }

        return res.status(200).json({success:true, message:data.message})
    }catch(e){
        console.log(e);
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

const updateBlogController = async(req, res)=>{
    const {id, title, content, category} = req.body;

    try{

        if(!id) 
            return res.status(400).json({success:false, message:"Blog ID is required"})
        
        const data = await updateBlogService(id, title, content, category, req);

        if(!data.success){
            return res.status(400).json({success:false, message:data.message})
        }

        return res.status(200).json({success:true, message:data.message})
    }catch(e){
        console.log(e);
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

const getBlogById = async (req, res) => {
    try {
        if (!req.roles.includes("READER")) {
            return res.status(403).json({ success: false, message: "You are not authorized to view blogs" });
        }        
        
        const data = await getBlogByIdService(req.params.id, req);
        if (!data.success) {
            return res.status(404).json({ success: false, message: data.message });
        }

        console.log(data);
        
        
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const likeBlogController = async (req, res)=>{
    const {id} = req.query;

    try {
        if(!req.roles.includes("READER")){
            return res.status(403).json({success:false, message:"You are not authorized to like blogs"})
        }

        const data = await likeBlogService(id, req);

        if(!data.success){
            return res.status(400).json({success:false, message:data.message})
        }

        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

const unlikeBlogController = async (req, res) => {
    const {id} = req.query

    try{
        const data = await unlikeBlogService(id, req)

        if(!data.success){
            return res.status(400).json({success:false, message:data.message})
        }

        return res.status(200).json(data)
    }catch(e){
        console.log(e);
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

export {createBlogController, getBlogs, getCategoriesController, deleteBlogController, updateBlogController, getBlogById, likeBlogController, unlikeBlogController}