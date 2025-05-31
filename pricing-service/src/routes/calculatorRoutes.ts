import express from 'express';
import CalculatorController from '../controllers/CalculatorController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Protected routes - require authentication
router.post('/create', authMiddleware, CalculatorController.createCalculator);
router.get('/user', authMiddleware, CalculatorController.getUserCalculators);
router.get('/:id', authMiddleware, CalculatorController.getCalculator);
router.put('/:id', authMiddleware, CalculatorController.updateCalculator);
router.delete('/:id', authMiddleware, CalculatorController.deleteCalculator);

export default router; 