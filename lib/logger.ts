type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class StructuredLogger {
  private isDev = process.env.NODE_ENV !== 'production';

  private format(level: LogLevel, message: string, context?: unknown): string {
    const timestamp = new Date().toISOString();
    const ctxStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctxStr}`;
  }

  debug(message: string, context?: unknown) {
    if (this.isDev) {
      console.debug(`🐛 ${this.format('debug', message, context)}`);
    }
  }

  info(message: string, context?: unknown) {
    console.info(`⚡ ${this.format('info', message, context)}`);
  }

  warn(message: string, context?: unknown) {
    console.warn(`⚠️ ${this.format('warn', message, context)}`);
  }

  error(message: string, context?: unknown) {
    console.error(`🚨 ${this.format('error', message, context)}`);
  }
}

export const logger = new StructuredLogger();
