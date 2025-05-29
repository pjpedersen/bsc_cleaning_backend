import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: process.env.PORT || 5002,
  DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/invoice-db',
  PRICING_SERVICE_URL: process.env.PRICING_SERVICE_URL || 'http://localhost:3000',
  // Email configuration
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@bsccleaning.com',
  // Set this to false in production
  IS_DEVELOPMENT: process.env.NODE_ENV !== 'production'
};
