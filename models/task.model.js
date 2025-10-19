import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  isComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Task;
