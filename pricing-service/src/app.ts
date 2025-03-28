import express from 'express';
import mongoose from 'mongoose';
import config from './config/config';
import pricingRoutes from './api/routes/pricing.routes';

const app = express();
app.use(express.json());
app.use('/api/pricing', pricingRoutes);

mongoose.connect(config.DB_URI);

export default app;
