import app from './app';
import mongoose from 'mongoose';
import config from './config/config';

mongoose.connect(config.DB_URI)
  .then(() => console.log('Pricing connected to DB'))
  .catch(err => console.error('DB connection error:', err));

app.listen(config.PORT, () => {
  console.log(`Pricing service running on port ${config.PORT}`);
});
