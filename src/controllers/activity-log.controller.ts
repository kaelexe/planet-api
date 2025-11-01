import { Request, Response, NextFunction } from "express";
import { getAllActivityLogs } from "../services/activity-log.service.js";
import type { ActivityLogsQuery } from "../constants/types/activity-logs-interface.js";

export const getActivityLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: add filters, sort
    await getAllActivityLogs().then((logs: ActivityLogsQuery[]) => {
      res.status(200).json(logs);
    });
  } catch (error) {
    next(error);
  }
};
