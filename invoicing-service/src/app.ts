import express from 'express';
import cors from 'cors';
import invoicingRoutes from './api/routes/invoicing.routes';

const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5002'], // Frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use('/api/invoices', invoicingRoutes);

export default app;
