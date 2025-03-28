export interface PricingParameters {
    [key: string]: any;
  }
  
  export interface PricingResult {
    total: number;
    breakdown: Record<string, number>;
  }
  
  export interface PricingModule {
    calculatePrice(parameters: PricingParameters): Promise<PricingResult>;
  }
  