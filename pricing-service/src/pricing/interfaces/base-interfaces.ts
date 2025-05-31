export interface BaseCalculatorParams {
  clientId?: string;
  location?: string;
  date?: string;
  notes?: string;
}

export interface PriceBreakdown {
  basePrice: number;
  adjustments: {
    name: string;
    amount: number;
    description: string;
  }[];
  total: number;
}

export interface CalculationResult {
  breakdown: PriceBreakdown;
  estimatedDuration?: number;
  requiredWorkers?: number;
  additionalNotes?: string[];
} 