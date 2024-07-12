import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import wishlistRoutes from './routes/wishlist';
import userRoutes from './routes/user';
import adminRoutes from './routes/admin';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware, optionalAuthMiddleware } from './middleware/auth';

dotenv.config();

const PORT = Number(process.env['PORT']) || 3001;
const FRONTEND_URL = process.env['FRONTEND_URL'] || 'http://localhost:5173';
const NODE_ENV = process.env['NODE_ENV'] || 'development';

// Fail fast on an insecure JWT configuration in production.
if (NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  console.error('FATAL: JWT_SECRET must be set to a strong value (32+ chars) in production.');
  process.exit(1);
}

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Rate limiting: protect auth endpoints from brute force, general API from abuse.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later.' },
});
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/categories', apiLimiter, categoryRoutes);
app.use('/api/cart', apiLimiter, optionalAuthMiddleware, cartRoutes);
app.use('/api/orders', apiLimiter, authMiddleware, orderRoutes);
app.use('/api/wishlist', apiLimiter, authMiddleware, wishlistRoutes);
app.use('/api/user', apiLimiter, authMiddleware, userRoutes);
app.use('/api/admin', apiLimiter, authMiddleware, adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${NODE_ENV}`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default app;