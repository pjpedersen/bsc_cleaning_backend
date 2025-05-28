// app.ts
import express from 'express';
import cors from 'cors';
import config from './config/config';
import authRoutes from './api/routes/auth.routes';

const app = express();

// enable CORS for your React dev server
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],    // ← add this
  exposedHeaders: ['Authorization'],                     // ← if you need to read it client-side
}));

// make sure the OPTIONS “catch-all” is registered before any routes
app.options('*', cors());

app.use(express.json());
app.use('/api/auth', authRoutes);

export default app;
