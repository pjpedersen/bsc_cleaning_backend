import { PricingEngine } from './pricing-engine';
import { PricingParameters, PricingResult } from './interfaces/pricing-module.interface';
import { WindowCleaningModule } from './modules/window-cleaning.module';

export class QuoteManager {
  private engine = new PricingEngine();
  private windowCleaningModule = new WindowCleaningModule();

  async calculateQuote(serviceType: string, parameters: PricingParameters): Promise<PricingResult> {
    if (serviceType === 'WINDOW_CLEANING') {
      return this.windowCleaningModule.calculatePrice(parameters);
    }
    return this.engine.calculate(serviceType, parameters);
  }
}
