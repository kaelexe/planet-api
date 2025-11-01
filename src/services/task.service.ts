import {
  Task,
  CreateTaskData,
  UpdateTaskData,
} from "../constants/types/tasks.interface.js";
import TaskModel from "../../models/task.model.js";
import { logActivity } from "./activity-log.service.js";
import { ActivityLogStatus } from "../constants/enums/activity-logs.status.enum.js";

// Fetch all tasks
export const getAllTasks = async (): Promise<Task[]> => {
  return await TaskModel.findAll();
};

// Fetch a single task by ID
export const getTask = async (id: number | string): Promise<Task | null> => {
  return await TaskModel.findByPk(id);
};

// Create a new task
export const createTask = async (data: CreateTaskData): Promise<Task> => {
  return await TaskModel.create(data);
};

// Update an existing task
export const updateTask = async (
  id: number | string,
  data: Partial<UpdateTaskData>
): Promise<Task | null> => {
  const task = await TaskModel.findByPk(id);

  if (task) {
    await task.update(data);
    return task;
  }
  return null;
};

// Mark a task as complete
export const markComplete = async (
  id: number | string
): Promise<Task | null> => {
  const task = await TaskModel.findByPk(id);
  if (!task) return null;

  if (!task.isComplete) {
    await logActivity({
      entityType: "task",
      entityId: task.id,
      action: "marked_complete",
      oldValues: { isComplete: task.isComplete },
      newValues: { isComplete: true },
      status: ActivityLogStatus.Success,
    });
  }

  task.isComplete = true;
  await task.save();
  return task;
};

// Mark a task as not complete
export const markNotComplete = async (
  id: number | string
): Promise<Task | null> => {
  const task = await TaskModel.findByPk(id);
  if (!task) return null;

  if (task.isComplete) {
    await logActivity({
      entityType: "task",
      entityId: task.id,
      action: "marked_not_complete",
      oldValues: { isComplete: task.isComplete },
      newValues: { isComplete: false },
      status: ActivityLogStatus.Success,
    });
  }

  task.isComplete = false;
  await task.save();
  return task;
};

export const archiveTask = async (
  id: number | string
): Promise<Task | null> => {
  const task = await TaskModel.findByPk(id);

  if (task) {
    task.archived = true;
    await task.save();
    return task;
  }
  return null;
};

export const unarchiveTask = async (
  id: number | string
): Promise<Task | null> => {
  const task = await TaskModel.findByPk(id);

  if (task) {
    task.archived = false;
    await task.save();
    return task;
  }
  return null;
};

export const markAsDone = async (id: number | string): Promise<Task | null> => {
  const task = await TaskModel.findByPk(id);

  if (task) {
    task.isComplete = true;
    task.archived = true;
    await task.save();
    return task;
  }
  return null;
};

// Delete a task
export const deleteTask = async (id: number | string): Promise<boolean> => {
  const deletedCount = await TaskModel.destroy({ where: { id } });
  return deletedCount > 0;
};
