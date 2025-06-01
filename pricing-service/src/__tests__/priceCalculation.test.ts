import {
  calculateBasePrice,
  calculateFloorAdjustment,
  calculateCleaningTypeMultiplier,
  calculateStormWindowsMultiplier,
  calculateSubscriptionDiscount,
  calculateTotalPrice
} from '../utils/priceCalculation';

describe('Price Calculation Utils', () => {
  describe('calculateBasePrice', () => {
    it('calculates base price for a range of windows', () => {
      expect(calculateBasePrice('1:5')).toBe(1500); // (1+5)/2 * 500
      expect(calculateBasePrice('10:15')).toBe(6250); // (10+15)/2 * 500
    });
  });

  describe('calculateFloorAdjustment', () => {
    it('calculates floor adjustment correctly', () => {
      const basePrice = 1000;
      expect(calculateFloorAdjustment(basePrice, '1')).toBe(0);
      expect(calculateFloorAdjustment(basePrice, '2')).toBe(1200); // 1000 * 1.2
      expect(calculateFloorAdjustment(basePrice, '3')).toBe(2400); // 1000 * 1.2 * 2
    });
  });

  describe('calculateCleaningTypeMultiplier', () => {
    it('returns correct multipliers for each cleaning type', () => {
      expect(calculateCleaningTypeMultiplier('Indvendig')).toBe(1.0);
      expect(calculateCleaningTypeMultiplier('Udvendig')).toBe(1.2);
      expect(calculateCleaningTypeMultiplier('Ind- og udvendig')).toBe(1.5);
    });
  });

  describe('calculateStormWindowsMultiplier', () => {
    it('returns correct multipliers for storm windows', () => {
      expect(calculateStormWindowsMultiplier('Ja')).toBe(1.3);
      expect(calculateStormWindowsMultiplier('Nej')).toBe(1.0);
    });
  });

  describe('calculateSubscriptionDiscount', () => {
    it('returns correct discounts for each service plan', () => {
      expect(calculateSubscriptionDiscount('one-time')).toBe(0);
      expect(calculateSubscriptionDiscount('monthly')).toBe(0.1);
      expect(calculateSubscriptionDiscount('quarterly')).toBe(0.15);
      expect(calculateSubscriptionDiscount('yearly')).toBe(0.2);
    });
  });

  describe('calculateTotalPrice', () => {
    it('calculates total price with all factors', () => {
      const parameters = {
        windows: '1:5',
        floor: '2',
        cleaningType: 'Ind- og udvendig' as const,
        stormWindows: 'Ja' as const,
        servicePlan: 'monthly' as const
      };

      const result = calculateTotalPrice(parameters);
      
      expect(result.estimatedPrice).toBeDefined();
      expect(result.breakdown).toHaveProperty('basePrice');
      expect(result.breakdown).toHaveProperty('floorAdjustment');
      expect(result.breakdown).toHaveProperty('cleaningTypeMultiplier');
      expect(result.breakdown).toHaveProperty('stormWindowsMultiplier');
      expect(result.breakdown).toHaveProperty('subscriptionDiscount');
    });
  });
}); 