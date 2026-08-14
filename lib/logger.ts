type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class StructuredLogger {
  private isDev = process.env.NODE_ENV !== 'production';

  private log(level: LogLevel, emoji: string, message: string, context?: unknown) {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `${emoji} [${timestamp}] [PORTFOLIO_${level.toUpperCase()}] ${message}`;

    if (typeof window !== 'undefined') {
      // Browser console: log objects directly for interactive expansion
      if (context !== undefined) {
        console[level](prefix, context);
      } else {
        console[level](prefix);
      }
    } else {
      // Server-side environment
      const ctxStr = context !== undefined ? ` | ${JSON.stringify(context)}` : '';
      console[level](`${prefix}${ctxStr}`);
    }
  }

  debug(message: string, context?: unknown) {
    if (this.isDev) {
      this.log('debug', '🐛', message, context);
    }
  }

  info(message: string, context?: unknown) {
    if (this.isDev) {
      this.log('info', '⚡', message, context);
    }
  }

  warn(message: string, context?: unknown) {
    this.log('warn', '⚠️', message, context);
  }

  error(message: string, context?: unknown) {
    this.log('error', '🚨', message, context);
  }
}

export const logger = new StructuredLogger();
