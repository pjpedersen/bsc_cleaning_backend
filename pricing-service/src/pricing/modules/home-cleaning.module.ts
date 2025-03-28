import { PricingModule, PricingParameters, PricingResult } from '../interfaces/pricing-module.interface';

export class HomeCleaningModule implements PricingModule {
  async calculatePrice(parameters: PricingParameters): Promise<PricingResult> {
    const { area, rooms } = parameters;
    const base = 50;
    const areaCost = area * 0.5;
    const roomCost = rooms * 20;
    return {
      total: base + areaCost + roomCost,
      breakdown: { base, areaCost, roomCost },
    };
  }
}
