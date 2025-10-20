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

    const updatedTask = await taskService.markComplete(req.params.id);

    if (updatedTask) {
      res.json(updatedTask);
      logger.info(`Marking task ${req.params.id} as complete`);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    next(err);
  }
};

export const archiveTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const updatedTask = await taskService.archiveTask(req.params.id);

    if (updatedTask) {
      res.json(updatedTask);
      logger.info(`Archiving task ${req.params.id}`);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    next(err);
  }
};

export const markAsDone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const updatedTask = await taskService.markAsDone(req.params.id);

    if (updatedTask) {
      res.json(updatedTask);
      logger.info(`Marking task ${req.params.id} as done`);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const deleted = await taskService.deleteTask(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    next(err);
  }
};
