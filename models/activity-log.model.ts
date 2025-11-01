import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.config.js";
import type {
  ActivityLog,
  CreateActivityLogData,
} from "../src/constants/types/activity-logs-interface.js";
import { ActivityLogStatus } from "../src/constants/enums/activity-logs.status.enum.js";
import { addDateFormattingToModel } from "../src/utils/addDateFormattingToModel.js";

class ActivityLogModel
  extends Model<ActivityLog, CreateActivityLogData>
  implements ActivityLog
{
  public id!: number;
  public entityType!: string;
  public entityId!: number;
  public action!: string;
  public actorType?: string;
  public actorId?: number;
  public oldValues?: Record<string, any>;
  public newValues?: Record<string, any>;
  public status!: ActivityLogStatus;
  public readonly createdAt!: Date;
}

ActivityLogModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    actorType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    oldValues: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    newValues: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ActivityLogStatus)),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "activity-logs",
    sequelize,
    timestamps: false, // manage createdAt manually
    indexes: [
      {
        fields: ["entityType", "entityId"],
      },
      {
        fields: ["actorType", "actorId"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  }
);

addDateFormattingToModel(ActivityLogModel);

export default ActivityLogModel;
