import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: process.env.PORT || 5002,
  DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/invoice-db',
  PRICING_SERVICE_URL: process.env.PRICING_SERVICE_URL || 'http://localhost:4000'
};
