import { connect } from 'mongoose';
import { objectConfig } from './config.js';
import { logger } from '../utils/logger.js';

const { mongo_url } = objectConfig;

export const connectMongoDb = async () => {
  try {
    connect(mongo_url)
    logger.info('Base de datos conectada');
  } catch (error) {
    logger.error(`Error de conección con MongoDB: ${error.message}`);
  }

};