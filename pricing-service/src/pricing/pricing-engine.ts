import { HomeCleaningModule } from './modules/home-cleaning.module';
import { LawnCareModule } from './modules/lawn-care.module';
import { ServiceTypeBModule } from './modules/service-type-b.module';
import { WindowCleaningModule } from './modules/window-cleaning.module';
import { PricingModule, PricingParameters, PricingResult } from './interfaces/pricing-module.interface';
import { HourlyCalculator } from './modules/hourly.module';
import { FixedPackageCalculator } from './modules/fixed-package.module';
import { AreaBasedCalculator } from './modules/area-based.module';

export class PricingEngine {
  private modules: Record<string, PricingModule> = {
    HOME_CLEANING: new HomeCleaningModule(),
    LAWN_CARE: new LawnCareModule(),
    SERVICE_TYPE_B: new ServiceTypeBModule(),
    WINDOW_CLEANING: new WindowCleaningModule(),
  };

  private readonly calculators: Record<string, any> = {
    'hourly': new HourlyCalculator(),
    'fixed-package': new FixedPackageCalculator(),
    'area-based': new AreaBasedCalculator()
  };

  async calculate(serviceType: string, parameters: PricingParameters): Promise<PricingResult> {
    // First try the legacy modules
    const module = this.modules[serviceType];
    if (module) {
      return module.calculatePrice(parameters);
    }

    // Then try the new calculators
    const calculator = this.calculators[serviceType];
    if (!calculator) {
      throw new Error(`Pricing module ${serviceType} not found.`);
    }
    
    return calculator.calculate(parameters);
  }
}
