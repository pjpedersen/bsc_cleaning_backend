import express from 'express';
import mongoose from 'mongoose';
import config from './config/config';
import invoicingRoutes from './api/routes/invoicing.routes';

const app = express();
app.use(express.json());

app.use('/api/invoices', invoicingRoutes);

mongoose.connect(config.DB_URI);

export default app;
