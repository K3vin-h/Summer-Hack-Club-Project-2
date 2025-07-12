const { createLogger, format, transports } = require('winston');
const path = require('path');



const logformat = format.printf((info) => {
    const { timestamp, level, label, message, ...args } = info;
    let log = `${timestamp} ${level}: ${message}`;
    if (!(Object.keys(args).length === 0 && args.constructor === Object)) {
        log += `${log}\n${JSON.stringify(args, null, 2)}`.replace(/\\n/g, '\n');
    }
    return log;
});
const logger = createLogger({
    level: "debug",
    format: format.combine(
        format.errors({ stack: true }),
        format.label({ label: path.basename(require.main.filename) }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.splat(),

    ),
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), logformat),
        }),
        new transports.File({
            filename: path.join(__dirname, "logger/logs", "full.log"),
            level: "debug",
            format: logformat,
            options: { flags: 'a' },
        }),
        new transports.File({
            filename: path.join(__dirname, "logger/logs", "error.log"),
            level: "error",
            format: logformat,
            options: { flags: 'a' },
        }),
        new transports.File({
            filename: path.join(__dirname, "logger/logs", "warn.log"),
            level: "warn",
            format: logformat,
            options: { flags: 'a' },
        }),
        new transports.File({
            filename: path.join(__dirname, "logger/logs", "info.log"),
            level: "info",
            format: logformat,
            options: { flags: 'a' },
        }),
    ],
});
module.exports = logger;
