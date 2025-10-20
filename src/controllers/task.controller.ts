import { Request, Response, NextFunction } from "express";
import * as taskService from "../services/task.service.js";
import { logger } from "../utils/logger.js";
import { TaskInput } from "../constants/types/tasks.interface.js";

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await taskService.getTask(req.params.id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    next(err);
  }
};

export const addTask = async (
  req: Request<{}, {}, TaskInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    logger.info(`Creating task: ${req.body}`);

    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};
