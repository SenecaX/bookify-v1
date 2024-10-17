import { createLogger, format, transports, addColors } from 'winston';

// Define custom colors for log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  },
};

// Apply custom colors to winston
addColors(customLevels.colors);

const logger = createLogger({
  levels: customLevels.levels,
  format: format.combine(
    format.colorize(), // Add color to the output
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`; // Custom format for log messages
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ],
});

export default logger;