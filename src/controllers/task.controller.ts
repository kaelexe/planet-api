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

export const updateTask = async (
  req: Request<{ id: string }, {}, Partial<TaskInput>>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const updatedTask = await taskService.updateTask(req.params.id, req.body);

    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    next(err);
  }
};

export const markComplete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Task ID is required" });
    }
    logger.info(`Marking task ${req.params.id} as complete`);

    const updatedTask = await taskService.markTaskAsComplete(req.params.id);

    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    next(err);
  }
};
