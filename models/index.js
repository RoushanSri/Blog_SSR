import User from "./user.model.js";
import Blog from "./blog.model.js";
import Role from "./role.model.js";
import Like from "./likes.model.js"

User.hasMany(Blog, {
  foreignKey: "authorId",
  as: "blogs",
});

Blog.belongsTo(User, {
  foreignKey: "authorId",
  as: "author",
  onDelete: "CASCADE",
});


User.hasMany(Role, {
  foreignKey: "userId",
  as: "roles",
  onDelete: "CASCADE",
});

Role.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});

Like.belongsTo(Blog, {
  foreignKey: "blogId",
  as:"blog",
  onDelete:"CASCADE"
})

Like.belongsTo(User,{
  foreignKey:"userId",
  as:"user",
  onDelete:"CASCADE"
})

User.hasMany(Like, {
    foreignKey: "userId",
    as: "likes"
});

Blog.hasMany(Like, {
    foreignKey: "blogId",
    as: "likes"
});

export { User, Blog, Role, Like };