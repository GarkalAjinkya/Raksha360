import winston from 'winston';
import env from './env';

const { combine, timestamp, printf, colorize, json } = winston.format;

const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    env.NODE_ENV === 'development' ? colorize() : json(),
    winston.format.errors({ stack: true }),
    env.NODE_ENV === 'development' ? devFormat : json()
  ),
  transports: [new winston.transports.Console()],
});

export default logger;