import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config/config';
import pricingRoutes from './routes/pricingRoutes';
import calculatorRoutes from './routes/calculatorRoutes';
import quoteRequestRoutes from './routes/quote-request.routes';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes with proper prefixes
app.use('/api/pricing', pricingRoutes);
app.use('/api/calculators', calculatorRoutes);
app.use('/api', quoteRequestRoutes); // Keep this as /api since it matches frontend expectations

// Only connect to MongoDB if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(config.DB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error: Error) => console.error('MongoDB connection error:', error));
}

export default app;
