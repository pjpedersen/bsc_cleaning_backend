import { PricingModule, PricingParameters, PricingResult } from '../interfaces/pricing-module.interface';

export class ServiceTypeBModule implements PricingModule {
  async calculatePrice(parameters: PricingParameters): Promise<PricingResult> {
    return { 
      total: 100, 
      breakdown: { fixedRate: 100 } 
    };
  }
}
