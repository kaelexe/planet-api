import { TaskPriority } from "../enums/tasks.priority.enum.js";
import { Optional } from "sequelize";

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  isComplete: boolean;
  archived: boolean;
  priority: TaskPriority;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating new tasks, some fields are optional
export interface TaskInput
  extends Optional<
    Task,
    "id" | "priority" | "isComplete" | "createdAt" | "updatedAt"
  > {}
