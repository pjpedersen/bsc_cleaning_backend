import { PricingModule, PricingParameters, PricingResult } from '../interfaces/pricing-module.interface';

export class LawnCareModule implements PricingModule {
  async calculatePrice(parameters: PricingParameters): Promise<PricingResult> {
    const { lawnSize, frequency } = parameters;

    const baseCharge = 25; // base service fee
    const sizeRate = 0.4;  // per square meter rate
    const frequencyDiscounts: Record<string, number> = {
      weekly: 0.9,       // 10% discount
      biweekly: 0.95,    // 5% discount
      monthly: 1.0       // no discount
    };

    const sizeCost = lawnSize * sizeRate;
    const frequencyMultiplier = frequencyDiscounts[frequency] || 1.0;
    const subtotal = baseCharge + sizeCost;
    const total = subtotal * frequencyMultiplier;

    return {
      total,
      breakdown: {
        baseCharge,
        sizeCost,
        frequencyDiscount: subtotal * (1 - frequencyMultiplier),
      },
    };
  }
}
