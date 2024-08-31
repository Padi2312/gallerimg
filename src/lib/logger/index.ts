/* eslint-disable @typescript-eslint/no-explicit-any */
enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

export class Logger {
    private level: LogLevel;

    constructor(level: LogLevel = LogLevel.INFO) {
        this.level = level;
    }

    private formatMessage(level: LogLevel, ...args: any[]): string {
        const timestamp = new Date().toISOString();
        return `${timestamp} [${LogLevel[level]}] ${args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg) : arg
        ).join(' ')}`;
    }

    private logWithColor(color: string, level: LogLevel, ...args: any[]): void {
        console.log(color + this.formatMessage(level, ...args) + '\x1b[0m');
    }

    debug(...args: any[]): void {
        if (this.level <= LogLevel.DEBUG) {
            this.logWithColor('\x1b[36m', LogLevel.DEBUG, ...args); // Cyan
        }
    }

    info(...args: any[]): void {
        if (this.level <= LogLevel.INFO) {
            this.logWithColor('\x1b[32m', LogLevel.INFO, ...args); // Green
        }
    }

    warn(...args: any[]): void {
        if (this.level <= LogLevel.WARN) {
            this.logWithColor('\x1b[33m', LogLevel.WARN, ...args); // Yellow
        }
    }

    error(...args: any[]): void {
        if (this.level <= LogLevel.ERROR) {
            this.logWithColor('\x1b[31m', LogLevel.ERROR, ...args); // Red
        }
    }

    setLevel(level: LogLevel): void {
        this.level = level;
    }
}
