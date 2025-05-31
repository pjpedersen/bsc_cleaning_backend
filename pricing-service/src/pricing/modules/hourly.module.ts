import { HourlyCalculatorParams } from '../interfaces/calculator-interfaces';
import { CalculationResult } from '../interfaces/base-interfaces';

export class HourlyCalculator {
  private readonly baseRates: Record<string, number> = {
    'Window Cleaner': 35,
    'Carpenter': 45,
    'Painter': 40,
    'Tiler': 45,
    'Roofer': 50,
    'Landscaper': 40,
    'Concrete Worker': 45,
    'Insulation Specialist': 45,
    'General Handyman': 35,
    'Electrician': 60,
    'Plumber': 60,
    'Mason': 50
  };

  private readonly urgencyMultipliers: Record<string, number> = {
    'Normal': 1.0,
    'Rush (24h)': 1.5,
    'Emergency (Same Day)': 2.0
  };

  private readonly timeOfDayMultipliers: Record<string, number> = {
    'Business Hours': 1.0,
    'After Hours': 1.5,
    'Weekend/Holiday': 2.0
  };

  calculate(params: HourlyCalculatorParams): CalculationResult {
    const baseRate = this.baseRates[params.workType] || 40; // Default rate if workType not found
    const basePrice = baseRate * params.hours * params.workerCount;
    
    const adjustments = [];
    let total = basePrice;

    // Apply urgency multiplier
    const urgencyAdjustment = basePrice * (this.urgencyMultipliers[params.urgency] - 1);
    if (urgencyAdjustment > 0) {
      adjustments.push({
        name: 'Urgency Adjustment',
        amount: urgencyAdjustment,
        description: `${params.urgency} service fee`
      });
      total += urgencyAdjustment;
    }

    // Apply time of day multiplier
    const timeAdjustment = basePrice * (this.timeOfDayMultipliers[params.timeOfDay] - 1);
    if (timeAdjustment > 0) {
      adjustments.push({
        name: 'Time of Day Adjustment',
        amount: timeAdjustment,
        description: `${params.timeOfDay} rate adjustment`
      });
      total += timeAdjustment;
    }

    const additionalNotes = [];
    if (params.additionalDetails) {
      additionalNotes.push(`Client Notes: ${params.additionalDetails}`);
    }

    return {
      breakdown: {
        basePrice,
        adjustments,
        total
      },
      estimatedDuration: params.hours,
      requiredWorkers: params.workerCount,
      additionalNotes
    };
  }
} 