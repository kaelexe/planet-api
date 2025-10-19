import Task, { TaskCreationAttributes } from "../../models/task.model.js";

// Fetch all tasks
export const getAllTasks = async (): Promise<Task[]> => {
  return await Task.findAll();
};

// Fetch a single task by ID
export const getTask = async (id: number | string): Promise<Task | null> => {
  return await Task.findByPk(id);
};

// Create a new task
export const createTask = async (
  data: TaskCreationAttributes
): Promise<Task> => {
  return await Task.create(data);
};
