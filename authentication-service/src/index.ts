import mongoose from 'mongoose';
import config from './config/config';
import app from './app';

mongoose.connect(config.DB_URI)
  .then(() => console.log('Auth service connected to DB'))
  .catch((err: Error) => console.error('DB connection error:', err));

app.listen(config.PORT, () => {
  console.log(`Authentication service running on port ${config.PORT}`);
});
