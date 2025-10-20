import * as fs from "fs";
import * as path from "path";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  timestamp?: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  requestId?: string;
  userId?: string;
  ip?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  memoryUsage?: NodeJS.MemoryUsage;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  logDir: string;
  maxFileSize: number; // in bytes
  maxFiles: number;
  enableColors: boolean;
  enableRequestLogging: boolean;
  enablePerformanceMonitoring: boolean;
  environment: "development" | "production" | "test";
}

export class Logger {
  private config: LoggerConfig;
  private logFilePath: string = "";
  private currentLogSize: number = 0;

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: true,
      logDir: path.join(process.cwd(), "logs"),
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      enableColors: true,
      enableRequestLogging: true,
      enablePerformanceMonitoring: true,
      environment: (process.env.NODE_ENV as any) || "development",
      ...config,
    };

    if (this.config.enableFile) {
      this.ensureLogDirectory();
      this.logFilePath = this.getLogFilePath();
      this.currentLogSize = this.getLogFileSize();
    }

    // Set log level from environment if specified
    if (process.env.LOG_LEVEL) {
      const envLevel = process.env.LOG_LEVEL.toUpperCase();
      if (envLevel in LogLevel) {
        this.config.level = LogLevel[envLevel as keyof typeof LogLevel];
      }
    }
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.config.logDir)) {
      fs.mkdirSync(this.config.logDir, { recursive: true });
    }
  }

  private getLogFilePath(): string {
    const date = new Date();
    const dateStr = date.toISOString().split("T")[0];
    return path.join(this.config.logDir, `${dateStr}.log`);
  }

  private getLogFileSize(): number {
    try {
      return fs.existsSync(this.logFilePath)
        ? fs.statSync(this.logFilePath).size
        : 0;
    } catch {
      return 0;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private getColorCode(level: LogLevel): string {
    if (!this.config.enableColors) return "";

    switch (level) {
      case LogLevel.DEBUG:
        return "\x1b[36m"; // Cyan
      case LogLevel.INFO:
        return "\x1b[32m"; // Green
      case LogLevel.WARN:
        return "\x1b[33m"; // Yellow
      case LogLevel.ERROR:
        return "\x1b[31m"; // Red
      case LogLevel.FATAL:
        return "\x1b[35m"; // Magenta
      default:
        return "";
    }
  }

  private getLevelName(level: LogLevel): string {
    return LogLevel[level];
  }

  private formatConsoleMessage(entry: LogEntry): string {
    const colorCode = this.getColorCode(entry.level);
    const resetCode = "\x1b[0m";
    const timestamp = this.formatTimestamp();
    const levelName = this.getLevelName(entry.level);

    let message = `${colorCode}[${timestamp}] ${levelName}${resetCode}: ${entry.message}`;

    if (entry.context) {
      message += `\n  Context: ${JSON.stringify(entry.context, null, 2)}`;
    }

    if (entry.error) {
      message += `\n  Error: ${entry.error.message}`;
      if (entry.error.stack && this.config.environment === "development") {
        message += `\n  Stack: ${entry.error.stack}`;
      }
    }

    if (entry.requestId) {
      message += ` (RequestId: ${entry.requestId})`;
    }

    if (entry.responseTime !== undefined) {
      message += ` (${entry.responseTime}ms)`;
    }

    return message;
  }

  private formatFileMessage(entry: LogEntry): string {
    const logData: LogEntry & {
      pid: number;
      memoryUsage?: NodeJS.MemoryUsage;
    } = {
      ...entry,
      timestamp: this.formatTimestamp(),
      pid: process.pid,
    };

    if (this.config.enablePerformanceMonitoring) {
      logData.memoryUsage = process.memoryUsage();
    }

    return JSON.stringify(logData) + "\n";
  }

  private writeToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole || !this.shouldLog(entry.level)) return;

    const message = this.formatConsoleMessage(entry);

    switch (entry.level) {
      case LogLevel.DEBUG:
      case LogLevel.INFO:
        console.log(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(message);
        break;
    }
  }

  private writeToFile(entry: LogEntry): void {
    if (!this.config.enableFile || !this.shouldLog(entry.level)) return;

    try {
      const message = this.formatFileMessage(entry);

      // Check if we need to rotate the log file
      if (this.currentLogSize + message.length > this.config.maxFileSize) {
        this.rotateLogFile();
      }

      fs.appendFileSync(this.logFilePath, message);
      this.currentLogSize += message.length;
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
  }

  private rotateLogFile(): void {
    try {
      // Get all log files
      const files = fs
        .readdirSync(this.config.logDir)
        .filter((file) => file.endsWith(".log"))
        .map((file) => ({
          name: file,
          path: path.join(this.config.logDir, file),
          date: fs
            .statSync(path.join(this.config.logDir, file))
            .mtime.getTime(),
        }))
        .sort((a, b) => b.date - a.date);

      // Remove old files if we exceed maxFiles
      if (files.length >= this.config.maxFiles) {
        const filesToDelete = files.slice(this.config.maxFiles - 1);
        filesToDelete.forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }

      // Rename current file with timestamp
      const timestamp = Date.now();
      const rotatedPath = path.join(
        this.config.logDir,
        `${path.basename(this.logFilePath, ".log")}.${timestamp}.log`
      );
      if (fs.existsSync(this.logFilePath)) {
        fs.renameSync(this.logFilePath, rotatedPath);
      }

      this.logFilePath = this.getLogFilePath();
      this.currentLogSize = 0;
    } catch (error) {
      console.error("Failed to rotate log file:", error);
    }
  }

  private log(entry: LogEntry): void {
    this.writeToConsole(entry);
    this.writeToFile(entry);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log({ level: LogLevel.DEBUG, message, context });
  }

  info(message: string, context?: Record<string, any>): void {
    this.log({ level: LogLevel.INFO, message, context });
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log({ level: LogLevel.WARN, message, context });
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log({ level: LogLevel.ERROR, message, error, context });
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log({ level: LogLevel.FATAL, message, error, context });
  }

  // Request logging methods
  logRequest(
    requestId: string,
    method: string,
    url: string,
    ip?: string,
    userId?: string
  ): void {
    if (!this.config.enableRequestLogging) return;

    this.info(`HTTP ${method} ${url}`, {
      requestId,
      method,
      url,
      ip,
      userId,
      type: "REQUEST_START",
    });
  }

  logResponse(
    requestId: string,
    method: string,
    url: string,
    statusCode: number,
    responseTime: number
  ): void {
    if (!this.config.enableRequestLogging) return;

    const level = statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    this.log({
      level,
      message: `HTTP ${method} ${url} - ${statusCode}`,
      context: {
        requestId,
        method,
        url,
        statusCode,
        responseTime,
        type: "REQUEST_END",
      },
      requestId,
      method,
      url,
      statusCode,
      responseTime,
    });
  }

  logError(error: Error, context?: Record<string, any>): void {
    this.error(error.message, error, {
      name: error.name,
      stack: error.stack,
      ...context,
    });
  }

  // Performance monitoring
  logPerformance(
    operation: string,
    duration: number,
    context?: Record<string, any>
  ): void {
    if (!this.config.enablePerformanceMonitoring) return;

    this.info(`Performance: ${operation}`, {
      operation,
      duration,
      type: "PERFORMANCE",
      ...context,
    });
  }

  // Database query logging
  logQuery(sql: string, duration: number, context?: Record<string, any>): void {
    this.debug(`Database Query (${duration}ms)`, {
      sql,
      duration,
      type: "DATABASE_QUERY",
      ...context,
    });
  }

  // Memory usage logging
  logMemoryUsage(): void {
    if (!this.config.enablePerformanceMonitoring) return;

    const memUsage = process.memoryUsage();
    this.debug("Memory Usage", {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
      type: "MEMORY_USAGE",
    });
  }

  // Utility method to create child logger with context
  child(context: Record<string, any>): Logger {
    const childLogger = new Logger(this.config);
    // Override the log method to include parent context
    const originalLog = childLogger.log.bind(childLogger);
    childLogger.log = (entry: LogEntry) => {
      originalLog({ ...entry, context: { ...context, ...entry.context } });
    };
    return childLogger;
  }
}
// TODO: does not work
// Create default logger instance
export const logger = new Logger({
  logDir: process.env.LOG_DIR || path.join(process.cwd(), "logs"),
  enableConsole: true, // MUST be true to appear in docker logs
  enableFile: true, // MUST be true to persist logs
});

// Export factory function for custom configurations
export const createLogger = (config?: Partial<LoggerConfig>): Logger => {
  return new Logger(config);
};
