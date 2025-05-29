import { Request, Response } from 'express';
import { QuoteManager } from '../pricing/quote-manager';

export class PricingController {
  private quoteManager = new QuoteManager();

  calculateQuote = async (req: Request, res: Response) => {
    try {
      const { service, parameters } = req.body;
      const priceDetails = await this.quoteManager.calculateQuote(service, parameters);
      
      res.json({
        estimatedPrice: priceDetails.total,
        breakdown: priceDetails.breakdown
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || err.toString() });
    }
  };
}
