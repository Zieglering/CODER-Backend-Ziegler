import { connect } from 'mongoose';
import { objectConfig } from './config.js';
import { logger } from '../utils/logger.js';

const {mongo_url} = objectConfig

export const connectMongoDb = async () => {
    logger.info('Base de datos conectada');
    connect(mongo_url);
  };