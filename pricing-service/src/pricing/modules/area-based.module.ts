import { AreaBasedCalculatorParams } from '../interfaces/calculator-interfaces';
import { CalculationResult } from '../interfaces/base-interfaces';

export class AreaBasedCalculator {
  private readonly baseRatesPerSqM: Record<string, number> = {
    'Window Cleaning': 2,
    'Lawn Mowing': 1.5,
    'Floor Sanding': 25,
    'Painting': 15,
    'Tiling': 45,
    'Carpet Installation': 30,
    'Roofing': 60,
    'Insulation': 35,
    'Concrete Work': 40,
    'Wallpapering': 20
  };

  private readonly complexityMultipliers: Record<string, number> = {
    'Standard': 1.0,
    'Complex Layout': 1.3,
    'Custom Work Required': 1.5,
    'Heritage/Special Care': 2.0
  };

  private readonly accessibilityMultipliers: Record<string, number> = {
    'Ground Level': 1.0,
    'Above Ground (1-2 Floors)': 1.3,
    'High Rise': 1.8,
    'Restricted Access': 1.5
  };

  private readonly frequencyDiscounts: Record<string, number> = {
    'One-time Project': 1.0,
    'Weekly Service': 0.7,  // 30% discount
    'Monthly Service': 0.8, // 20% discount
    'Quarterly Service': 0.85, // 15% discount
    'Annual Service': 0.9,  // 10% discount
    'Multi-year Contract': 0.75 // 25% discount
  };

  calculate(params: AreaBasedCalculatorParams): CalculationResult {
    const baseRate = this.baseRatesPerSqM[params.workCategory] || 20; // Default rate if service type not found
    const basePrice = baseRate * params.area;
    
    const adjustments = [];
    let total = basePrice;

    // Apply complexity multiplier
    const complexityMultiplier = this.complexityMultipliers[params.complexity];
    const complexityAdjustment = basePrice * (complexityMultiplier - 1);
    if (complexityAdjustment > 0) {
      adjustments.push({
        name: 'Complexity Adjustment',
        amount: complexityAdjustment,
        description: `${params.complexity} complexity factor`
      });
      total += complexityAdjustment;
    }

    // Apply accessibility multiplier
    const accessibilityMultiplier = this.accessibilityMultipliers[params.accessibility];
    const accessibilityAdjustment = basePrice * (accessibilityMultiplier - 1);
    if (accessibilityAdjustment > 0) {
      adjustments.push({
        name: 'Accessibility Adjustment',
        amount: accessibilityAdjustment,
        description: `${params.accessibility} access factor`
      });
      total += accessibilityAdjustment;
    }

    // Apply frequency discount
    const frequencyMultiplier = this.frequencyDiscounts[params.frequency];
    const frequencyDiscount = total * (1 - frequencyMultiplier);
    if (frequencyDiscount > 0) {
      adjustments.push({
        name: 'Frequency Discount',
        amount: -frequencyDiscount,
        description: `${params.frequency} discount`
      });
      total -= frequencyDiscount;
    }

    // Estimate duration based on area and complexity
    const estimatedDuration = this.calculateEstimatedDuration(params);

    return {
      breakdown: {
        basePrice,
        adjustments,
        total
      },
      estimatedDuration,
      additionalNotes: [
        `Service Type: ${params.workCategory}`,
        `Area: ${params.area} m²`,
        `Complexity Level: ${params.complexity}`,
        `Access Type: ${params.accessibility}`,
        `Service Frequency: ${params.frequency}`
      ]
    };
  }

  private calculateEstimatedDuration(params: AreaBasedCalculatorParams): number {
    // Base hours per square meter for different services
    const baseHoursPerSqM: Record<string, number> = {
      'Window Cleaning': 0.05,
      'Lawn Mowing': 0.02,
      'Floor Sanding': 0.1,
      'Painting': 0.08,
      'Tiling': 0.2,
      'Carpet Installation': 0.15,
      'Roofing': 0.25,
      'Insulation': 0.15,
      'Concrete Work': 0.2,
      'Wallpapering': 0.1
    };

    const baseHours = (baseHoursPerSqM[params.workCategory] || 0.1) * params.area;
    const complexityFactor = this.complexityMultipliers[params.complexity];
    const accessibilityFactor = this.accessibilityMultipliers[params.accessibility];

    return Math.ceil(baseHours * complexityFactor * accessibilityFactor);
  }
} 