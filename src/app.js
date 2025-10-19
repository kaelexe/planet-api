import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import sequelize from "./config/db.config.js";
import "./models/task.model.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

export const startDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Database connection has failed:", err);
  }
};

export default app;
