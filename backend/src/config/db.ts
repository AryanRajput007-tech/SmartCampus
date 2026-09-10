import mongoose from 'mongoose';
import { config } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    if (config.nodeEnv === 'production') {
      process.exit(1);
    } else {
      console.warn('[MongoDB] Running in offline / memory fallback mode. Will retry when required.');
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected.');
  } catch (error) {
    console.error('[MongoDB] Error disconnecting:', error);
  }
};
