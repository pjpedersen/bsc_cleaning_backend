interface PriceParameters {
  windows: string;
  floor: string;
  cleaningType: CleaningType;
  stormWindows: StormWindows;
  servicePlan: ServicePlan;
}

interface PriceBreakdown {
  basePrice: number;
  floorAdjustment: number;
  cleaningTypeMultiplier: number;
  stormWindowsMultiplier: number;
  subscriptionDiscount: number;
}

type CleaningType = 'Indvendig' | 'Udvendig' | 'Ind- og udvendig';
type StormWindows = 'Ja' | 'Nej';
type ServicePlan = 'one-time' | 'monthly' | 'quarterly' | 'yearly';

const BASE_PRICE = 500;
const FLOOR_MULTIPLIER = 1.2;
const CLEANING_TYPE_MULTIPLIERS: Record<CleaningType, number> = {
  'Indvendig': 1.0,
  'Udvendig': 1.2,
  'Ind- og udvendig': 1.5
};
const STORM_WINDOWS_MULTIPLIERS: Record<StormWindows, number> = {
  'Ja': 1.3,
  'Nej': 1.0
};
const SUBSCRIPTION_DISCOUNTS: Record<ServicePlan, number> = {
  'one-time': 0,
  'monthly': 0.1,
  'quarterly': 0.15,
  'yearly': 0.2
};

export const calculateBasePrice = (windows: string): number => {
  const [min, max] = windows.split(':').map(Number);
  return BASE_PRICE * ((min + max) / 2);
};

export const calculateFloorAdjustment = (basePrice: number, floor: string): number => {
  const floorNum = parseInt(floor);
  return floorNum > 1 ? basePrice * (FLOOR_MULTIPLIER * (floorNum - 1)) : 0;
};

export const calculateCleaningTypeMultiplier = (cleaningType: CleaningType): number => {
  return CLEANING_TYPE_MULTIPLIERS[cleaningType];
};

export const calculateStormWindowsMultiplier = (hasStormWindows: StormWindows): number => {
  return STORM_WINDOWS_MULTIPLIERS[hasStormWindows];
};

export const calculateSubscriptionDiscount = (servicePlan: ServicePlan): number => {
  return SUBSCRIPTION_DISCOUNTS[servicePlan];
};

export const calculateTotalPrice = (parameters: PriceParameters): { estimatedPrice: number; breakdown: PriceBreakdown } => {
  const basePrice = calculateBasePrice(parameters.windows);
  const floorAdjustment = calculateFloorAdjustment(basePrice, parameters.floor);
  const cleaningTypeMultiplier = calculateCleaningTypeMultiplier(parameters.cleaningType);
  const stormWindowsMultiplier = calculateStormWindowsMultiplier(parameters.stormWindows);
  const subscriptionDiscount = calculateSubscriptionDiscount(parameters.servicePlan);

  const subtotal = (basePrice + floorAdjustment) * cleaningTypeMultiplier * stormWindowsMultiplier;
  const discount = subtotal * subscriptionDiscount;
  const estimatedPrice = subtotal - discount;

  return {
    estimatedPrice,
    breakdown: {
      basePrice,
      floorAdjustment,
      cleaningTypeMultiplier,
      stormWindowsMultiplier,
      subscriptionDiscount
    }
  };
}; 