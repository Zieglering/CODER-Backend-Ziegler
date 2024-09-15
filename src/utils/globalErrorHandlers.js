import { logger } from './logger.js';

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Error sin manejar: ${promise} reason: ${reason}`);
});

process.on('uncaughtException', (error) => {
    logger.error(`Excepción: ${error.message}`);
});

export default {};