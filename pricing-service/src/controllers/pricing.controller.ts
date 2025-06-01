import { Request, Response } from 'express';
import { PricingEngine } from '../pricing/pricing-engine';
import { Quote } from '../models/quote.model';

export class PricingController {
  private pricingEngine = new PricingEngine();

  calculateQuote = async (req: Request, res: Response) => {
    try {
      // Extract serviceType from the root level of the request
      const { serviceType, parameters, userId, customerType, name, email, phone, address, city, zip } = req.body;
      
      if (!serviceType) {
        return res.status(400).json({ error: 'Service type is required' });
      }

      // If parameters has its own serviceType, rename it to workCategory
      if (parameters && parameters.serviceType) {
        parameters.workCategory = parameters.serviceType;
        delete parameters.serviceType;
      }

      const priceDetails = await this.pricingEngine.calculate(serviceType, parameters);
      
      // Create a quote if all required fields are present
      let quoteId;
      if (userId && customerType && name && email && phone && address && city && zip) {
        const quote = new Quote({
          userId,
          customerType,
          name,
          email,
          phone,
          address,
          city,
          zip,
          service: serviceType,
          estimatedPrice: priceDetails.total,
          parameters
        });
        await quote.save();
        quoteId = quote._id;
      }

      res.json({
        _id: quoteId,
        estimatedPrice: priceDetails.total,
        breakdown: priceDetails.breakdown
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || err.toString() });
    }
  };
}
