import Task from "../models/task.model.js";

export const getAllTasks = async () => {
  return await Task.findAll();
};

export const getTask = async (id) => {
  return await Task.findByPk(id);
};

export const createTask = async (data) => {
  return await Task.create(data);
};
