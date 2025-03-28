import { Router } from 'express';
import { PricingController } from '../../controllers/pricing.controller';

const router = Router();
const controller = new PricingController();

router.post('/calculate', controller.calculateQuote);
router.get('/quotes/:id', controller.getQuoteById);

export default router;
