import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.config.js";

// --- Priority Enum ---
export enum TaskPriority {
  Normal = "Normal",
  Minor = "Minor",
  High = "High",
  Important = "Important",
}

// --- Attributes Interface ---
export interface TaskAttributes {
  id: number;
  title: string;
  description?: string | null;
  isComplete: boolean;
  priority: TaskPriority;
  createdAt?: Date;
  updatedAt?: Date;
}

// --- Creation Attributes ---
export interface TaskCreationAttributes
  extends Optional<
    TaskAttributes,
    "id" | "priority" | "isComplete" | "createdAt" | "updatedAt"
  > {}

// --- Model Definition ---
class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  public id!: number;
  public title!: string;
  public description!: string | null;
  public isComplete!: boolean;
  public priority!: TaskPriority;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(TaskPriority)),
      allowNull: false,
      defaultValue: TaskPriority.Normal,
    },
  },
  {
    tableName: "tasks",
    sequelize,
  }
);

export default Task;
