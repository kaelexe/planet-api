import express from "express";
import taskRoutes from "./task.routes.js";

const router = express.Router();

router.use("/tasks", taskRoutes);

export default router;
