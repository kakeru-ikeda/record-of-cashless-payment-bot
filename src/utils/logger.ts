import { createLogger, format, transports, Logger } from 'winston';

const logger: Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
    ],
});

export const logInfo = (message: string, context: string = '') => {
    const logMessage = context ? `[${context}] ${message}` : message;
    logger.info(logMessage);
};

export const logError = (message: string, error?: Error, context: string = '') => {
    const logMessage = context ? `[${context}] ${message}` : message;
    if (error) {
        logger.error(`${logMessage} - ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }
    } else {
        logger.error(logMessage);
    }
};

export const logDebug = (message: string, context: string = '') => {
    const logMessage = context ? `[${context}] ${message}` : message;
    logger.debug(logMessage);
};

export const logWarn = (message: string, context: string = '') => {
    const logMessage = context ? `[${context}] ${message}` : message;
    logger.warn(logMessage);
};

// 他のモジュールからのインポート用にロガーオブジェクトをそのままエクスポート
export { logger };