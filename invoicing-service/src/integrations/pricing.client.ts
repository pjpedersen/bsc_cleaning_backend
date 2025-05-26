import axios from 'axios';
import config from '../config/config';

export const pricingClient = {
  async getQuote(quoteId: string) {
    var url = config.PRICING_SERVICE_URL + '/api/pricing/quotes/' + quoteId;
    const res = await axios.get(url);
    return res.data;
  }
};
