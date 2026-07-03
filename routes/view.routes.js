import { Router } from "express";
import { getBlogByIdService, getBlogsService, getCategoriesService } from "../services/blog.service.js";
import { getUserProfileService } from "../services/user.service.js";
import { getPendingRequestsService, getAllUsersWithRolesService } from "../services/admin.service.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = Router();

router.get("/", async (req, res) => {
    const categoryFilter = req.query.category || null;
    const page = 1;
    const limit = 6;
    const data = await getBlogsService(page, limit, categoryFilter);
    
    let superAdminId = 1;
    let superBlogId = 1;
    try {
        const superAdmin = await User.findOne({ where: { email: "superadmin@example.com" } });
        if (superAdmin) {
            superAdminId = superAdmin.id;
            const superBlog = await Blog.findOne({ where: { authorId: superAdmin.id } });
            if (superBlog) superBlogId = superBlog.id;
        }
    } catch(err) {
        console.error(err);
    }

    res.render("index", { 
        title: "Home - Blog Feed", 
        blogs: data.success ? data.blogs : [], 
        categoryFilter,
        superAdminId,
        superBlogId
    });
});

router.get("/login", (req, res) => {
    if (res.locals.user) return res.redirect("/");
    res.render("login", { title: "Login" });
});

router.get("/register", (req, res) => {
    if (res.locals.user) return res.redirect("/");
    res.render("register", { title: "Register" });
});

router.get("/create-blog", (req, res) => {
    res.render("create-blog", { title: "Create Blog" });
});

router.get("/profile", (req, res) => {
    if (!res.locals.user) return res.redirect("/login");
    res.render("profile", { title: "My Profile" });
});

router.get("/settings", (req, res) => {
    if (!res.locals.user) return res.redirect("/login");
    res.render("settings", { title: "Settings" });
});

router.get("/my-blogs", async (req, res) => {
    if (!res.locals.user) return res.redirect("/login");
    const categoryFilter = req.query.category || null;
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const data = await getBlogsService(page, limit, categoryFilter, res.locals.user.id);
    res.render("my-blogs", { 
        title: "My Blogs", 
        blogs: data.success ? data.blogs : [], 
        categoryFilter, 
        currentPage: data.currentPage || 1, 
        totalPages: data.totalPages || 1 
    });
});

router.get("/blogs", async (req, res) => {
    const categoryFilter = req.query.category || null;
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const data = await getBlogsService(page, limit, categoryFilter);
    res.render("blogs", { 
        title: categoryFilter ? `Posts in ${categoryFilter}` : "Blogs", 
        blogs: data.success ? data.blogs : [], 
        categoryFilter, 
        currentPage: data.currentPage || 1, 
        totalPages: data.totalPages || 1 
    });
});

router.get("/categories", async (req, res) => {
    const data = await getCategoriesService();
    res.render("categories", { title: "Categories", categories: data.success ? data.categories : [] });
});

router.get("/author/:id", async (req, res) => {
    
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    
    const [authorData, blogsData] = await Promise.all([
        getUserProfileService(req.params.id),
        getBlogsService(page, limit, null, req.params.id)
    ]);
    
    if (authorData.success) {
        res.render("author", { 
            title: "Author Profile", 
            author: authorData.data,
            blogs: blogsData.success ? blogsData.blogs : [],
            currentPage: blogsData.currentPage || 1,
            totalPages: blogsData.totalPages || 1
        });
    } else {
        res.render("author", { title: "Author Not Found", author: null, blogs: [] });
    }
});

router.get("/blog/:id", isAuthenticated, async (req, res) => {
    const data = await getBlogByIdService(req.params.id, req);
    if (data.success) {
        res.render("blog-details", { title: data.response?.title, blog: data.response });
    } else {
        res.render("blog-details", { title: "Blog Not Found", blog: null });
    }
});

router.get("/admin-dashboard", isAdmin, async (req, res) => {
    const requestsData = await getPendingRequestsService();
    const usersData = await getAllUsersWithRolesService();
    
    res.render("admin-dashboard", { 
        title: "Admin Dashboard", 
        pendingRequests: requestsData.success ? requestsData.data : [],
        users: usersData.success ? usersData.data : []
    });
});

router.get("/edit-blog/:id", async (req, res) => {

    const data = await getBlogByIdService(req.params.id, req);
    if (data.success) {
        if(res.locals.user.id !== data.blog.authorId) {
            return res.render("404");
        }
        res.render("edit-blog", { title: "Edit Blog", blog: data.blog });
    } else {
        res.render("404");
    }
})

export default router;
