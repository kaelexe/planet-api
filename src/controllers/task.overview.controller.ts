import { Request, Response, NextFunction } from "express";
import { getAllActivityLogs } from "../services/activity-log.service.js";
import { getAllTasks } from "../services/task.service.js";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import { logger } from "../utils/logger.js";

// dayjs plugins
dayjs.extend(isBetween);

export const getTasksOverview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get all tasks with deadlines within the selected month
    // Get month from query (e.g. ?search=1 for January)
    const month = Number(req.query.calendar_month);

    const allTasks = await getAllTasks();
    const tasks = allTasks.filter((task) => {
      if (!task.dateDue) return false;

      return dayjs(task.dateDue).month() + 1 === month;
    });

    // Get all activity logs within the last 3 weeks(2 weeks before + current week)
    const now = dayjs();

    // last 2 weeks
    const startOfRange = now.subtract(2, "week").startOf("week");
    // current week
    const endOfRange = now.endOf("week");

    const activityLogs = (await getAllActivityLogs()).filter((log) =>
      dayjs(log.createdAt).isBetween(startOfRange, endOfRange, null, "[]")
    );

    res.json({ tasks, activityLogs });
  } catch (err) {
    next(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
