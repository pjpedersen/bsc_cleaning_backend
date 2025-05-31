import { BaseCalculatorParams } from './base-interfaces';

export interface HourlyCalculatorParams extends BaseCalculatorParams {
  hours: number;
  workerCount: number;
  workType: string;
  urgency: 'Normal' | 'Rush (24h)' | 'Emergency (Same Day)';
  timeOfDay: 'Business Hours' | 'After Hours' | 'Weekend/Holiday';
  additionalDetails?: string;
}

export interface FixedPackageCalculatorParams extends BaseCalculatorParams {
  packageType: 'Basic Package' | 'Standard Package' | 'Premium Package' | 'Enterprise Package';
  duration: 'One-time' | '3 Months' | '6 Months' | '12 Months';
  addons: 'None' | 'Priority Support' | 'Extended Hours' | 'Custom Reports' | 'Training Sessions';
  paymentTerms: 'Monthly' | 'Quarterly' | 'Semi-annually' | 'Annually';
}

export interface AreaBasedCalculatorParams extends BaseCalculatorParams {
  area: number;
  workCategory: string;
  complexity: 'Standard' | 'Complex Layout' | 'Custom Work Required' | 'Heritage/Special Care';
  accessibility: 'Ground Level' | 'Above Ground (1-2 Floors)' | 'High Rise' | 'Restricted Access';
  frequency: 'One-time Project' | 'Weekly Service' | 'Monthly Service' | 'Quarterly Service' | 'Annual Service' | 'Multi-year Contract';
} 