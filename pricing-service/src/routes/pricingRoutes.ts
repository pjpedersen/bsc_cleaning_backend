import { Router } from 'express';
import { PricingController } from '../controllers/pricing.controller';
import { Quote } from '../models/quote.model';

const router = Router();
const controller = new PricingController();

// Price calculation endpoints
router.post('/calculate', controller.calculateQuote);

// Get quote by ID
router.get('/quotes/:id', async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).lean();
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    // Transform the response to match frontend expectations
    const transformedQuote = {
      id: quote._id.toString(),
      estimatedPrice: quote.estimatedPrice,
      service: quote.service,
      parameters: quote.parameters
    };
    res.json(transformedQuote);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch quote' });
  }
});

export default router; 