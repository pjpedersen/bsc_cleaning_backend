import express from 'express';
import mongoose from 'mongoose';
import config from './config/config';
import authRoutes from './api/routes/auth.routes';


const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

export default app;
