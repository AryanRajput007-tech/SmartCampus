import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcampus',
  jwtSecret: process.env.JWT_SECRET || 'smartcampus_super_secure_jwt_secret_dev_key_2026',
  jwtExpiresIn: '7d',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  nodeEnv: process.env.NODE_ENV || 'development'
};
