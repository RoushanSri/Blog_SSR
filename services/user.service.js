import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import Role from "../models/role.model.js";
import Like from "../models/likes.model.js";

const getMeService = async (userId) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "username", "email", "aboutMe", "createdAt"],
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const roles = await Role.findAll({
      where: { userId },
      attributes: ["id", "roleName", "isApproved"],
    });

    const blogCount = await Blog.count({ where: { authorId: userId } });

    const likeCount = await Like.count({
      include: [
        {
          model: Blog,
          as: "blog",
          where: {
            authorId: userId,
          },
          attributes: [],
        },
      ],
    });

    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        aboutMe: user.aboutMe,
        createdAt: user.createdAt,
        roles: roles.map((r) => ({
          id: r.id,
          roleName: r.roleName,
          isApproved: r.isApproved,
        })),
        likeCount,
        blogCount,
      },
    };
  } catch (error) {
    console.log("Error in getMeService:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

const changePasswordService = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return { success: false, message: "Current password is incorrect" };
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    user.password = encryptedPassword;
    await user.save();

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.log("Error in changePasswordService:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

const changeUsernameService = async (userId, newUsername) => {
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    user.username = newUsername;
    await user.save();

    return {
      success: true,
      message: "Username changed successfully",
      username: newUsername,
    };
  } catch (error) {
    console.log("Error in changeUsernameService:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

const requestRoleService = async (userId, roleName) => {
  try {
    const existing = await Role.findOne({
      where: { userId, roleName },
    });

    if (existing) {
      if (existing.isApproved) {
        return {
          success: false,
          message: `You already have the ${roleName} role`,
        };
      }
      return {
        success: false,
        message: `You have already requested the ${roleName} role. It is pending approval.`,
      };
    }

    await Role.create({ userId, roleName, isApproved: false });

    return {
      success: true,
      message: `${roleName} role requested successfully. Awaiting admin approval.`,
    };
  } catch (error) {
    console.log("Error in requestRoleService:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

const getUserProfileService = async (userId) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "username", "createdAt", "aboutMe"],
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const blogCount = await Blog.count({ where: { authorId: userId } });

    const likeCount = await Like.count({
      include: [
        {
          model: Blog,
          as: "blog",
          where: {
            authorId: userId,
          },
          attributes: [],
        },
      ],
    });

    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        aboutMe: user.aboutMe,
        blogCount,
        likeCount,
      },
    };
  } catch (error) {
    console.log("Error in getUserProfileService:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

const updateAboutMeService = async (aboutMe, userId) => {

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    user.aboutMe = aboutMe;
    await user.save();
    return {
      success: true,
      message: "About me updated successfully",
      aboutMe: aboutMe,
    };
  } catch (error) {
    console.log("Error in updateAboutMeService:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

export {
  getMeService,
  changePasswordService,
  changeUsernameService,
  requestRoleService,
  getUserProfileService,
  updateAboutMeService,
};
