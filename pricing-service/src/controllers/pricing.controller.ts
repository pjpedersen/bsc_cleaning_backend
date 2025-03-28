import { Request, Response } from 'express';
import { QuoteManager } from '../pricing/quote-manager';
import { Quote } from '../models/quote.model';

export class PricingController {
  private quoteManager = new QuoteManager();

  calculateQuote = async (req: Request, res: Response) => {
    try {
      const { serviceType, parameters } = req.body;
      const priceDetails = await this.quoteManager.calculateQuote(serviceType, parameters);
      const quote = new Quote({ serviceType, parameters, priceDetails });
      await quote.save();
      res.json({ quoteId: quote._id, priceDetails });
    } catch (err: any) {
        console.error(err); // <-- Add this to see the detailed error on your terminal
        res.status(500).json({ error: err.message || err.toString() });
      }
      
  };

  getQuoteById = async (req: Request, res: Response) => {
    const quote = await Quote.findById(req.params.id);
    res.json(quote);
  };
}
