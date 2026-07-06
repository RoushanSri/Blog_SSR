import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to Neon PostgreSQL");
  } catch (error) {
    console.error("Unable to connect:", error);
  }
};

export { sequelize, connectDB };