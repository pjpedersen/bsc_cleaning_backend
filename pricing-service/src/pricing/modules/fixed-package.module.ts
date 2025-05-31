import { FixedPackageCalculatorParams } from '../interfaces/calculator-interfaces';
import { CalculationResult } from '../interfaces/base-interfaces';

export class FixedPackageCalculator {
  private readonly packageBaseRates: Record<string, number> = {
    'Basic Package': 500,
    'Standard Package': 1000,
    'Premium Package': 2000,
    'Enterprise Package': 5000
  };

  private readonly durationMultipliers: Record<string, number> = {
    'One-time': 1.0,
    '3 Months': 2.7, // 10% discount for 3 months
    '6 Months': 5.1, // 15% discount for 6 months
    '12 Months': 9.6  // 20% discount for 12 months
  };

  private readonly addonRates: Record<string, number> = {
    'None': 0,
    'Priority Support': 200,
    'Extended Hours': 300,
    'Custom Reports': 250,
    'Training Sessions': 400
  };

  private readonly paymentTermsDiscounts: Record<string, number> = {
    'Monthly': 0,
    'Quarterly': 0.05, // 5% discount
    'Semi-annually': 0.08, // 8% discount
    'Annually': 0.12 // 12% discount
  };

  calculate(params: FixedPackageCalculatorParams): CalculationResult {
    const basePrice = this.packageBaseRates[params.packageType];
    const adjustments = [];
    let total = basePrice;

    // Apply duration multiplier
    const durationMultiplier = this.durationMultipliers[params.duration];
    const durationAdjustment = (basePrice * durationMultiplier) - basePrice;
    if (durationAdjustment !== 0) {
      adjustments.push({
        name: 'Duration Adjustment',
        amount: durationAdjustment,
        description: `${params.duration} duration pricing`
      });
      total += durationAdjustment;
    }

    // Add addon costs
    const addonCost = this.addonRates[params.addons];
    if (addonCost > 0) {
      adjustments.push({
        name: 'Additional Services',
        amount: addonCost,
        description: `${params.addons}`
      });
      total += addonCost;
    }

    // Apply payment terms discount
    const paymentDiscount = total * this.paymentTermsDiscounts[params.paymentTerms];
    if (paymentDiscount > 0) {
      adjustments.push({
        name: 'Payment Terms Discount',
        amount: -paymentDiscount,
        description: `${params.paymentTerms} payment discount`
      });
      total -= paymentDiscount;
    }

    return {
      breakdown: {
        basePrice,
        adjustments,
        total
      },
      additionalNotes: [
        `Package Type: ${params.packageType}`,
        `Contract Duration: ${params.duration}`,
        `Payment Terms: ${params.paymentTerms}`
      ]
    };
  }
} 