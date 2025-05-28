import { PricingModule, PricingParameters, PricingResult } from '../interfaces/pricing-module.interface';

export class WindowCleaningModule implements PricingModule {
  async calculatePrice(parameters: PricingParameters): Promise<PricingResult> {
    const { numberOfWindows, numberOfFloors, windowSize, userToken} = parameters;

    const basePricePerWindow = 10; // base price per window
    const floorDifficultyMultiplier = 1 + (numberOfFloors - 1) * 0.1; // 10% extra per additional floor
    const sizeMultiplier = windowSize === 'large' ? 1.5 : windowSize === 'medium' ? 1.2 : 1;

    const windowsCost = numberOfWindows * basePricePerWindow * sizeMultiplier * floorDifficultyMultiplier;
    const fixedServiceCharge = 30;

    const total = windowsCost + fixedServiceCharge;

    return {
      total,
      breakdown: {
        windowsCost,
        fixedServiceCharge,
      },
    };
  }
}
