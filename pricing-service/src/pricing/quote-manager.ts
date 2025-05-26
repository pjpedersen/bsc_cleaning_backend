import { PricingEngine } from './pricing-engine';
import { windowCleaningClient } from '../integrations/window-cleaning.client';
import { PricingParameters, PricingResult } from './interfaces/pricing-module.interface';

export class QuoteManager {
  private engine = new PricingEngine();

  async calculateQuote(serviceType: string, parameters: PricingParameters): Promise<PricingResult> {
    if (serviceType === 'WINDOW_CLEANING') {
      return windowCleaningClient.calculate(parameters);
    }
    return this.engine.calculate(serviceType, parameters);
  }
}
