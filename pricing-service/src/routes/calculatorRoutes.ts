import { Router } from 'express';
import CalculatorController from '../controllers/CalculatorController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all calculator routes
router.use(authenticateUser);

// Calculator routes
router.post('/create', CalculatorController.createCalculator);
router.get('/user', CalculatorController.getUserCalculators);
router.get('/:id', CalculatorController.getCalculator);
router.put('/:id', CalculatorController.updateCalculator);
router.delete('/:id', CalculatorController.deleteCalculator);

export default router; 