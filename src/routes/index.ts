import express from "express";
import taskRoutes from "./task.routes.js";
import activityLogRoutes from "./activity-log.routes.js";

const router = express.Router();

router.use("/tasks", taskRoutes);
router.use("/activity/logs", activityLogRoutes);

export default router;
