import mongoose from 'mongoose';
import config from './config/config';
import app from './app';

mongoose.connect(config.DB_URI)
  .then(function() { console.log('Invoicing service connected to DB'); })
  .catch(function(err) { console.error('DB connection error:', err); });

app.listen(config.PORT, function() {
  console.log('Invoicing service running on port ' + config.PORT);
});
