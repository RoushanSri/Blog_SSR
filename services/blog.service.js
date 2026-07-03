import Blog from "../models/blog.model.js";
import { CATEGORIES } from "../models/blog.model.js";
import { Sequelize } from "sequelize";
import Like from "../models/likes.model.js";
import User from "../models/user.model.js";

const createBlogService = async (title, content, category, userId) => {
  try {
    const blog = await Blog.create({
      title,
      content,
      category,
      authorId: userId,
    });
    if (!blog) {
      return { success: false, message: "Blog not created" };
    }
    return { success: true, message: "Blog created successfully", blog };
  } catch (error) {
    console.log("Error in createBlogService:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

const deleteBlogService = async (id, req) => {
  try {
    const blog = await Blog.findOne({
      where: {
        id,
      },
    });

    if (!blog) return { success: false, message: "Blog not found" };

    if (
      blog.authorId !== req.userId &&
      !req.roles.includes("ADMIN") &&
      !req.roles.includes("SUPER_ADMIN")
    )
      return {
        success: false,
        message: "You are not authorized to delete this blog",
      };

    await blog.destroy();

    return { success: true, message: "Blog deleted successfully" };
  } catch (error) {
    console.log("Error in deleteBlogService:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

const updateBlogService = async (id, title, content, category, req) => {
  try {
    const blog = await Blog.findOne({
      where: {
        id,
      },
    });

    if (!blog) return { success: false, message: "Blog not found" };

    if (blog.authorId !== req.userId)
      return {
        success: false,
        message: "You are not authorized to update this blog",
      };

    blog.title = title;
    blog.content = content;
    if (category) blog.category = category;
    await blog.save();

    return { success: true, message: "Blog updated successfully", blog };
  } catch (error) {
    console.log("Error in updateBlogService:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

const getBlogByIdService = async (id, req) => {
  try {
    const blog = await Blog.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username"],
        },
        {
          model: Like,
          as: "likes",
          attributes: ["id", "userId"],
        },
      ],
    });

    if (!blog) return { success: false, message: "Blog not found" };
    

    const response = {
      ...blog.toJSON(),
      likeCount: blog.likes.length,
      liked: blog.likes.some((like) => like.userId === req?.userId),
    };

    return { success: true, response };
  } catch (error) {
    console.log("Error in getBlogByIdService:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

const getBlogsService = async (
  page = 1,
  limit = 9,
  category = null,
  authorId = null,
) => {
  try {
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (category && CATEGORIES.includes(category)) {
      whereClause.category = category;
    }

    if (authorId) {
      whereClause.authorId = authorId;
    }

    const { count, rows: blogs } = await Blog.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: (await import("../models/user.model.js")).default,
          as: "author",
          attributes: ["id", "username"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      success: true,
      blogs,
      currentPage: page,
      totalPages,
      totalCount: count,
    };
  } catch (error) {
    console.log("Error in getBlogsService:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

const getCategoriesService = async () => {
  try {
    const categoryCounts = await Blog.findAll({
      attributes: [
        "category",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: ["category"],
      raw: true,
    });

    const countMap = {};
    categoryCounts.forEach((row) => {
      countMap[row.category] = parseInt(row.count);
    });

    const categories = CATEGORIES.map((cat) => ({
      name: cat,
      count: countMap[cat] || 0,
    }));

    return { success: true, categories };
  } catch (error) {
    console.log("Error in getCategoriesService:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

const likeBlogService = async (id, req) => {
  try {
    const blog = await Blog.findOne({
      where: {
        id,
      },
    });

    if (!blog) return { success: false, message: "Blog not found" };

    const like = await Like.create({
      userId: req.userId,
      blogId: blog.id,
    });

    return { success: true, message: "Blog liked successfully", blog, like };
  } catch (error) {
    console.log("Error in likeBlogService:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

const unlikeBlogService = async (id, req) => {
  try {
    const blog = await Blog.findOne({
      where: {
        id,
      },
    });

    if (!blog) return { success: false, message: "Blog not found" };

    const like = await Like.findOne({
      where: {
        blogId: blog.id,
        userId: req.userId,
      },
    });

    if (!like) return { success: false, message: "Like not found" };

    await like.destroy();

    return { success: true, message: "Blog unliked successfully", blog, like };
  } catch (error) {
    console.log("Error in unlikeBlogService:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

export {
  createBlogService,
  deleteBlogService,
  updateBlogService,
  getBlogByIdService,
  getBlogsService,
  getCategoriesService,
  likeBlogService,
  unlikeBlogService,
};
