import app from './app';
import { connectDB } from './config/db';
import { config } from './config/env';

const startServer = async (): Promise<void> => {
  // Connect to Database
  await connectDB();

  // Start HTTP Server
  const server = app.listen(config.port, () => {
    console.log(`=========================================`);
    console.log(`🚀 SmartCampus Backend running on port ${config.port}`);
    console.log(`📍 Health Check: http://localhost:${config.port}/health`);
    console.log(`📍 API Base:     http://localhost:${config.port}/api`);
    console.log(`🌍 Environment:  ${config.nodeEnv}`);
    console.log(`=========================================`);
  });

  // Handle graceful shutdowns
  const shutdown = () => {
    console.log('\nShutting down SmartCampus Backend gracefully...');
    server.close(() => {
      console.log('HTTP Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
