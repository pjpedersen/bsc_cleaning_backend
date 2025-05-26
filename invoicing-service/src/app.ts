import express from 'express';
import invoicingRoutes from './api/routes/invoicing.routes';

const app = express();
app.use(express.json());
app.use('/api/invoices', invoicingRoutes);

export default app;
