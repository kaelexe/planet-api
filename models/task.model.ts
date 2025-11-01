import type {
  Task,
  CreateTaskData,
} from "../src/constants/types/tasks.interface.js";
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.config.js";
import { TaskPriority } from "../src/constants/enums/tasks.priority.enum.js";
import { addDateFormattingToModel } from "../src/utils/addDateFormattingToModel.js";

// TODO: Add userID field when auth is implemented

// --- Model Definition ---
class TaskModel extends Model<Task, CreateTaskData> implements Task {
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
    dateDue: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "tasks",
    sequelize,
    indexes: [
      {
        fields: ["isComplete"],
      },
      {
        fields: ["archived"],
      },
      {
        fields: ["priority"],
      },
      {
        fields: ["dateDue"],
      },
    ],
  }
);

addDateFormattingToModel(TaskModel);

export default TaskModel;
