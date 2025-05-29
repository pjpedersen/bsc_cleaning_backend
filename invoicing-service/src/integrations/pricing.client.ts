import axios from 'axios';
import config from '../config/config';

interface QuoteResponse {
  id: string;
  estimatedPrice: number;
  service: string;
  parameters: Record<string, any>;
}

export const pricingClient = {
  async getQuote(quoteId: string): Promise<QuoteResponse> {
    const url = `${config.PRICING_SERVICE_URL}/api/pricing/quotes/${quoteId}`;
    try {
      const res = await axios.get<QuoteResponse>(url);
      return res.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Failed to fetch quote');
      }
      throw new Error('Failed to connect to pricing service');
    }
  }
};
