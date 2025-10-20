import express, { Application } from "express";
import routes from "./routes/index.js";
import sequelize from "../config/db.config.js";
import "../models/task.model.js";
import dotenv from "dotenv";
import corsMiddleware from "./middleware/cors.middleware.js";

// Load environment variables
dotenv.config();

const app: Application = express();

app.use(corsMiddleware);
app.use(express.json());
app.use("/api", routes);

// TODO:implement authentication middleware

export const startDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ Database connected successfully!");
  } catch (err) {
    console.error("❌ Database connection has failed:", err);
  }
};

export default app;
