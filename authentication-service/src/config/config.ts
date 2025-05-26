import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/auth-db',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
  JWT_EXPIRES_IN: parseInt(process.env.JWT_EXPIRES_IN || '3600', 10)
};
