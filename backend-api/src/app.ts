import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from './config/env';
import mainRouter from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import ApiError from './utils/ApiError';

const app = express();

// --- Core Middleware ---
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

// --- API Routes ---
app.use('/api/v1', mainRouter);

// Health check route
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));


// --- 404 Handler ---
app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});

// --- Central Error Handler ---
app.use(errorHandler);

export default app;