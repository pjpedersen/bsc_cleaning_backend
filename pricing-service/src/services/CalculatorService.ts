import { Types } from 'mongoose';
import Calculator, { 
  ICalculator, 
  CalculatorType, 
  CalculatorSettings 
} from '../models/Calculator';

class CalculatorService {
  async createCalculator(
    userId: string,
    type: CalculatorType,
    hourlyWage: number,
    settings: CalculatorSettings,
    name?: string
  ): Promise<ICalculator> {
    try {
      const calculator = new Calculator({
        userId: new Types.ObjectId(userId),
        type,
        name: name || `${type} Calculator`,
        hourlyWage,
        settings
      });

      await calculator.save();
      return calculator;
    } catch (error: any) {
      throw new Error(`Failed to create calculator: ${error.message}`);
    }
  }

  async getCalculatorById(calculatorId: string): Promise<ICalculator | null> {
    try {
      return await Calculator.findById(calculatorId);
    } catch (error: any) {
      throw new Error(`Failed to get calculator: ${error.message}`);
    }
  }

  async getUserCalculators(userId: string): Promise<ICalculator[]> {
    try {
      return await Calculator.find({ 
        userId: new Types.ObjectId(userId),
        isActive: true 
      }).sort({ createdAt: -1 });
    } catch (error: any) {
      throw new Error(`Failed to get user calculators: ${error.message}`);
    }
  }

  async updateCalculator(
    calculatorId: string,
    updates: Partial<Pick<ICalculator, 'name' | 'hourlyWage' | 'settings'>>
  ): Promise<ICalculator | null> {
    try {
      return await Calculator.findByIdAndUpdate(
        calculatorId,
        { $set: updates },
        { new: true }
      );
    } catch (error: any) {
      throw new Error(`Failed to update calculator: ${error.message}`);
    }
  }

  async deleteCalculator(calculatorId: string): Promise<boolean> {
    try {
      const result = await Calculator.findByIdAndUpdate(
        calculatorId,
        { $set: { isActive: false } }
      );
      return !!result;
    } catch (error: any) {
      throw new Error(`Failed to delete calculator: ${error.message}`);
    }
  }
}

export default new CalculatorService(); 