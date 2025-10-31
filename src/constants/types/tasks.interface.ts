import { TaskPriority } from "../enums/tasks.priority.enum.js";
import { Optional } from "sequelize";

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  isComplete: boolean;
  archived: boolean;
  priority: TaskPriority;
  dateDue?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating new tasks, some fields are optional
export interface CreateTaskData
  extends Optional<
    Task,
    "id" | "isComplete" | "archived" | "dateDue" | "createdAt" | "updatedAt"
  > {}

// For updating tasks, all fields are optional except id, createdAt, updatedAt
export type UpdateTaskData = Partial<
  Omit<Task, "id" | "createdAt" | "updatedAt">
>;
