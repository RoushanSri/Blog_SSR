import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const CATEGORIES = [
  "Design",
  "Technology",
  "Art & Culture",
  "Education",
  "Entertainment",
  "Lifestyle",
  "Health & Wellness",
  "Travel",
];

const Blog = sequelize.define(
  "Blog",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Technology",
      validate: {
        isIn: [CATEGORIES],
      },
    },
  },
  {
    timestamps: true,
  },
);

export { CATEGORIES };
export default Blog;
