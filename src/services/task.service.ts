import { Task, TaskInput } from "../constants/types/tasks.interface.js";
import TaskModel from "../../models/task.model.js";

// Fetch all tasks
export const getAllTasks = async (): Promise<Task[]> => {
  return await TaskModel.findAll();
};

// Fetch a single task by ID
export const getTask = async (id: number | string): Promise<Task | null> => {
  return await TaskModel.findByPk(id);
};

// Create a new task
export const createTask = async (data: TaskInput): Promise<Task> => {
  return await TaskModel.create(data);
};
