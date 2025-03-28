import app from './app';
import config from './config/config';

app.listen(config.PORT, () => {
  console.log(`Pricing service running on ${config.PORT}`);
});
