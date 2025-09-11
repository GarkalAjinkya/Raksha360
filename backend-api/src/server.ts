import app from './app';
import { connectDB, disconnectDB } from './config/database';
import env from './config/env';
import logger from './config/logger';

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode.`);
    });
    
    const gracefulShutdown = (signal: string) => {
      process.on(signal, async () => {
        logger.info(`${signal} received, shutting down gracefully...`);
        server.close(async () => {
          await disconnectDB();
          logger.info('Server and database connections closed.');
          process.exit(0);
        });
      });
    };
    
    gracefulShutdown('SIGTERM');
    gracefulShutdown('SIGINT');

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();