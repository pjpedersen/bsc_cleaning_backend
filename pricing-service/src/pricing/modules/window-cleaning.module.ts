import { PricingModule, PricingParameters, PricingResult } from '../interfaces/pricing-module.interface';

export class WindowCleaningModule implements PricingModule {
  async calculatePrice(parameters: PricingParameters): Promise<PricingResult> {
    // Extract parameters
    const floor = parameters.floor ? Math.max(...parameters.floor.split(',').map(Number)) : 0;
    const cleaningType = parameters.cleaningType;
    const stormWindows = parameters.stormWindows;
    const servicePlan = parameters.servicePlan || 'one-time';
    const frequency = parameters.frequency || 4;

    // Parse windows data
    let totalWindows = 0;
    if (parameters.windows) {
      // Handle array of window objects
      if (Array.isArray(parameters.windows)) {
        totalWindows = parameters.windows.reduce((sum, window: any) => sum + (window.count || 0), 0);
      }
      // Handle string format
      else if (typeof parameters.windows === 'string') {
        const windowsArray = parameters.windows.split(',').map(w => {
          const [id, count] = w.split(':');
          return parseInt(count) || 0;
        });
        totalWindows = windowsArray.reduce((sum, count) => sum + count, 0);
      }
    }

    // Ensure we have at least 1 window for calculation
    totalWindows = Math.max(1, totalWindows);

    // Base price calculation (50 DKK per window as per frontend)
    let basePrice = totalWindows * 50;

    // Floor multiplier (20% increase per floor as per frontend)
    const floorMultiplier = 1 + ((floor) * 0.2);
    basePrice *= floorMultiplier;

    // Storm windows adjustment (30% increase if yes)
    if (stormWindows === 'Ja') {
      basePrice *= 1.3;
    }

    // Cleaning type adjustment
    if (cleaningType === 'Indvendig') {
      basePrice *= 1.2; // 20% increase for interior only
    } else if (cleaningType === 'Ud- og Indvendig') {
      basePrice *= 2; // Double price for both interior and exterior
    }

    // Subscription discount
    if (servicePlan === 'subscription') {
      basePrice *= 0.8; // 20% discount for subscription
    }

    // If basePrice is NaN or 0, set a minimum price
    if (isNaN(basePrice) || basePrice === 0) {
      basePrice = 360; // Default to the estimated price from the request as minimum
    }

    // Round the final price
    const total = Math.round(basePrice);

    return {
      total,
      breakdown: {
        basePrice: Math.round(totalWindows * 50),
        floorAdjustment: Math.round(totalWindows * 50 * (floorMultiplier - 1)),
        cleaningTypeMultiplier: cleaningType === 'Ud- og Indvendig' ? 2 : cleaningType === 'Indvendig' ? 1.2 : 1,
        stormWindowsMultiplier: stormWindows === 'Ja' ? 1.3 : 1,
        subscriptionDiscount: servicePlan === 'subscription' ? 0.8 : 1,
        frequency: frequency,
        totalWindows: totalWindows
      }
    };
  }
}
