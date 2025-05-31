import { Response } from 'express';
import CalculatorService from '../services/CalculatorService';
import { CalculatorType, CalculatorSettings } from '../models/Calculator';
import { AuthRequest } from '../middleware/auth.middleware';

class CalculatorController {
  async createCalculator(req: AuthRequest, res: Response) {
    try {
      const { type, hourlyWage, settings, name } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const calculator = await CalculatorService.createCalculator(
        userId,
        type as CalculatorType,
        hourlyWage,
        settings as CalculatorSettings,
        name
      );

      return res.status(201).json(calculator);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getCalculator(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const calculator = await CalculatorService.getCalculatorById(id);

      if (!calculator) {
        return res.status(404).json({ error: 'Calculator not found' });
      }

      return res.json(calculator);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getUserCalculators(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const calculators = await CalculatorService.getUserCalculators(userId);
      return res.json(calculators);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async updateCalculator(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const calculator = await CalculatorService.updateCalculator(id, updates);

      if (!calculator) {
        return res.status(404).json({ error: 'Calculator not found' });
      }

      return res.json(calculator);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteCalculator(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const success = await CalculatorService.deleteCalculator(id);

      if (!success) {
        return res.status(404).json({ error: 'Calculator not found' });
      }

      return res.json({ message: 'Calculator deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new CalculatorController(); 