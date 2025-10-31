import { Model, ModelStatic } from "sequelize";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
const TARGET_TIMEZONE = "Asia/Manila";

export function addDateFormattingToModel<T extends Model>(
  model: ModelStatic<T>
) {
  const originalToJSON = model.prototype.toJSON;
  model.prototype.toJSON = function () {
    const obj = originalToJSON ? originalToJSON.call(this) : this.get();
    Object.entries(obj).forEach(([key, value]) => {
      if (value instanceof Date) {
        // Convert UTC (from DB) → Asia/Manila for display
        obj[key] = dayjs(value).tz(TARGET_TIMEZONE).format(DATE_FORMAT);
      }
    });
    return obj;
  };
}
