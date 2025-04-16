type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  userId?: string
}

class Logger {
  private static instance: Logger
  private logs: LogEntry[] = []

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatMessage(level: LogLevel, message: string, data?: any, userId?: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userId,
    }
  }

  private log(level: LogLevel, message: string, data?: any, userId?: string) {
    const entry = this.formatMessage(level, message, data, userId)
    this.logs.push(entry)

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      const consoleMethod = level === "error" ? "error" : level === "warn" ? "warn" : "log"
      console[consoleMethod](`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, data || "")
    }

    // TODO: Implement log persistence (e.g., to a file or database)
  }

  info(message: string, data?: any, userId?: string) {
    this.log("info", message, data, userId)
  }

  warn(message: string, data?: any, userId?: string) {
    this.log("warn", message, data, userId)
  }

  error(message: string, data?: any, userId?: string) {
    this.log("error", message, data, userId)
  }

  debug(message: string, data?: any, userId?: string) {
    if (process.env.NODE_ENV === "development") {
      this.log("debug", message, data, userId)
    }
  }

  getLogs(): LogEntry[] {
    return this.logs
  }

  clearLogs() {
    this.logs = []
  }
}

export const logger = Logger.getInstance() 