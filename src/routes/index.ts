import express from "express";
import taskRoutes from "./task.routes.js";
import activityLogRoutes from "./activity-log.routes.js";
import { getTasksOverview } from "../controllers/task.overview.controller.js";

const router = express.Router();

// task overview
router.use("/dashboard/task/overview", getTasksOverview);

router.use("/tasks", taskRoutes);
router.use("/activity/logs", activityLogRoutes);

export default router;
