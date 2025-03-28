import { HomeCleaningModule } from './modules/home-cleaning.module';
import { LawnCareModule } from './modules/lawn-care.module';
import { ServiceTypeBModule } from './modules/service-type-b.module';
import { WindowCleaningModule } from './modules/window-cleaning.module';
import { PricingModule, PricingParameters, PricingResult } from './interfaces/pricing-module.interface';


export class PricingEngine {
  private modules: Record<string, PricingModule> = {
    HOME_CLEANING: new HomeCleaningModule(),
    LAWN_CARE: new LawnCareModule(),
    SERVICE_TYPE_B: new ServiceTypeBModule(),
    WINDOW_CLEANING: new WindowCleaningModule(), // <-- add here
  };

  async calculate(serviceType: string, parameters: PricingParameters): Promise<PricingResult> {
    const module = this.modules[serviceType];
    if (!module) throw new Error(`Pricing module ${serviceType} not found.`);
    return module.calculatePrice(parameters);
  }
}
