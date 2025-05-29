import { Router } from 'express';
import { PricingController } from '../controllers/pricing.controller';

const router = Router();
const controller = new PricingController();

// Price calculation endpoints
router.post('/calculate', controller.calculateQuote);

export default router; 