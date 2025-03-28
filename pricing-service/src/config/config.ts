const config = {
    PORT: process.env.PORT || 3000,
    DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/pricing-db',
    WINDOW_CLEANING_SERVICE_URL: process.env.WINDOW_CLEANING_SERVICE_URL || 'http://localhost:4000/api/window-cleaning',
  };
  
  export default config;
  