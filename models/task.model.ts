import type {
  Task,
  TaskInput,
} from "../src/constants/types/tasks.interface.js";
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.config.js";
import { TaskPriority } from "../src/constants/enums/tasks.priority.enum.js";

// --- Model Definition ---
class TaskModel extends Model<Task, TaskInput> implements Task {
  public id!: number;
  public title!: string;
  public description!: string | null;
  public isComplete!: boolean;
  public archived!: boolean;
  public priority!: TaskPriority;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TaskModel.init(
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
    archived: {
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

export default TaskModel;
