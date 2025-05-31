import { Request, Response } from 'express';
import { QuoteManager } from '../pricing/quote-manager';

export class PricingController {
  private quoteManager = new QuoteManager();

  calculateQuote = async (req: Request, res: Response) => {
    try {
      console.log('Received request:', req.body); // Debug log
      
      // Extract serviceType from the root level of the request
      const { serviceType, parameters } = req.body;
      
      if (!serviceType) {
        return res.status(400).json({ error: 'Service type is required' });
      }

      // If parameters has its own serviceType, rename it to workCategory
      if (parameters && parameters.serviceType) {
        parameters.workCategory = parameters.serviceType;
        delete parameters.serviceType;
      }

      const priceDetails = await this.quoteManager.calculateQuote(serviceType, parameters);
      
      res.json({
        estimatedPrice: priceDetails.total,
        breakdown: priceDetails.breakdown
      });
    } catch (err: any) {
      console.error('Error in calculateQuote:', err);
      res.status(500).json({ error: err.message || err.toString() });
    }
  };
}
