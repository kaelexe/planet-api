import { Request, Response, NextFunction } from "express";
import * as taskService from "../services/task.service.js";
import { logger } from "../utils/logger.js";
import {
  CreateTaskData,
  UpdateTaskData,
} from "../constants/types/tasks.interface.js";
import { SortOrder, sortByKey } from "../utils/sort.js";

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // filters
    const searchParam = req.query.search as string | undefined;
    const priorityParam = req.query.priority as string | undefined;
    const isCompleteParam = req.query.isComplete as string | undefined;
    const archivedParam = req.query.archived as string | undefined;
    const search = searchParam?.trim().toLowerCase();
    // sort
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as SortOrder;

    const tasks = (await taskService.getAllTasks()).filter((task) => {
      // SEARCH: include if title OR description contains the search string
      if (search) {
        const inTitle = task.title?.toLowerCase().includes(search);
        const inDescription = task.description?.toLowerCase().includes(search);
        if (!(inTitle || inDescription)) return false;
      }

      // PRIORITY: normalize both sides to string for reliable comparison
      if (priorityParam) {
        if (String(task.priority) !== String(priorityParam)) return false;
      }

      // isComplete: only filter if param provided
      if (typeof isCompleteParam !== "undefined") {
        const wantComplete = isCompleteParam === "true";
        if (task.isComplete !== wantComplete) return false;
      }

      // archived: only filter if param provided
      if (typeof archivedParam !== "undefined") {
        const wantArchived = archivedParam === "true";
        if (task.archived !== wantArchived) return false;
      }

      return true;
    });

    // FIXME: sort order not working
    // SORTING
    const sorted = sortByKey(
      tasks,
      sortBy as keyof (typeof tasks)[0],
      sortOrder
    );

    res.json(sorted);
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
  req: Request<{}, {}, CreateTaskData>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    if (typeof req.body.isComplete === "undefined") {
      req.body.isComplete = false;
    }

    logger.info(`Creating task: ${req.body}`);

    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (
  req: Request<{ id: string }, {}, Partial<UpdateTaskData>>,
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

export const markNotComplete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const updatedTask = await taskService.markNotComplete(req.params.id);

    if (updatedTask) {
      res.json(updatedTask);
      logger.info(`Marking task ${req.params.id} as not complete`);
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

export const unarchiveTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const updatedTask = await taskService.unarchiveTask(req.params.id);

    if (updatedTask) {
      res.json(updatedTask);
      logger.info(`Unarchiving task ${req.params.id}`);
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
