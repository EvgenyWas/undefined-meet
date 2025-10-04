import morgan from 'morgan';
import path from 'node:path';
import { createLogger, format, transports } from 'winston';

const LOG_DIR_PATH = path.resolve(
  process.cwd(),
  process.env.SERVER_LOG_DIR_PATH,
);

export const logger = createLogger({
  level: process.env.SERVER_LOG_LEVEL || 'info',
  transports: [
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    new transports.File({
      dirname: LOG_DIR_PATH,
      filename: 'error.log',
      level: 'error',
      lazy: true,
    }),
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    new transports.File({ dirname: LOG_DIR_PATH, filename: 'combined.log' }),
  ],
  exitOnError: false,
});

const httpLogger = createLogger({
  level: 'http',
  format: format.combine(
    format.printf(({ message }) => message as string),
    format.errors({ stack: true }),
  ),
  transports: [
    new transports.File({ dirname: LOG_DIR_PATH, filename: 'http.log' }),
  ],
  exitOnError: false,
});

export const loggerMiddleware = morgan(
  (tokens, req, res) => {
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const status = tokens.status(req, res);
    const contentLength = tokens.res(req, res, 'content-length');
    const responseTime = tokens['response-time'](req, res);
    const remoteAddr = tokens['remote-addr'](req, res);
    const userAgent = tokens['user-agent'](req, res);
    const date = tokens.date(req, res, 'iso');

    const formatted = [
      `📥 [${date}]`,
      `${method} ${url}`,
      `→ ${status} (${responseTime} ms)`,
      contentLength ? `size: ${contentLength}B` : '',
      `ip: ${remoteAddr}`,
      userAgent ? `agent: ${userAgent}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    return formatted;
  },
  {
    stream: {
      write: (message) => {
        httpLogger.http(message.trim());
      },
    },
  },
);

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.simple(), format.colorize()),
    }),
  );
  httpLogger.add(
    new transports.Console({
      format: format.combine(format.simple(), format.colorize()),
    }),
  );
}
