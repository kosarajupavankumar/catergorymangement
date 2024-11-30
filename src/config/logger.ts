import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info: winston.Logform.TransformableInfo) => {
      const { timestamp, level, message } = info;
      return `${timestamp} ${level}: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
