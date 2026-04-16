type LogLevel = "info" | "warn" | "error";

interface LogContext {
  action: string;
  userId?: string;
  [key: string]: unknown;
}

function formatMessage(level: LogLevel, context: LogContext, message: string): string {
  const timestamp = new Date().toISOString();
  const { action, ...rest } = context;
  const extra = Object.keys(rest).length > 0 ? ` ${JSON.stringify(rest)}` : "";
  return `[${timestamp}] ${level.toUpperCase()} [${action}] ${message}${extra}`;
}

export const logger = {
  info(context: LogContext, message: string) {
    console.log(formatMessage("info", context, message));
  },
  warn(context: LogContext, message: string) {
    console.warn(formatMessage("warn", context, message));
  },
  error(context: LogContext, message: string) {
    console.error(formatMessage("error", context, message));
  },
};
