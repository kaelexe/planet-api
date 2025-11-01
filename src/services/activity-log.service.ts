import ActivityLogModel from "../../models/activity-log.model.js";
import { ActivityLogStatus } from "../constants/enums/activity-logs.status.enum.js";
import type {
  ActivityLog,
  CreateActivityLogData,
} from "../constants/types/activity-logs-interface.js";

// Fetch all activity logs
export const getAllActivityLogs = async (): Promise<ActivityLog[]> => {
  return await ActivityLogModel.findAll();
};

/**
 * Create a reusable activity log entry.
 */
export async function logActivity({
  entityType,
  entityId,
  action,
  actorType = "Kael",
  actorId = undefined,
  oldValues = undefined,
  newValues = undefined,
  status = ActivityLogStatus.Success,
}: CreateActivityLogData) {
  try {
    await ActivityLogModel.create({
      entityType,
      entityId,
      action,
      actorType,
      actorId,
      oldValues,
      newValues,
      status,
    });
  } catch (err) {
    console.error("Error creating activity log:", err);
    // Don't throw — logs should not block main actions
  }
}
