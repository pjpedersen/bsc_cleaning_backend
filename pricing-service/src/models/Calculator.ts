import mongoose, { Document, Schema } from 'mongoose';

// Types for calculator settings
export interface WindowCleaningSettings {
  basePrice?: number;
  pricePerWindow?: number;
  pricePerStory?: number;
  minimumPrice?: number;
  complexityFactors?: {
    dirt: number;
    access: number;
    height: number;
  };
}

export interface TimeBasedSettings {
  minimumTime?: number;
  overtimeRate?: number;
}

export interface AreaBasedSettings {
  pricePerSquareMeter?: number;
  minimumArea?: number;
}

export interface NumberOfWindowsSettings {
  pricePerWindow?: number;
  volumeDiscounts?: {
    threshold: number;
    discount: number;
  }[];
}

// Union type for all possible settings
export type CalculatorSettings = 
  | WindowCleaningSettings 
  | TimeBasedSettings 
  | AreaBasedSettings 
  | NumberOfWindowsSettings;

// Calculator types
export type CalculatorType = 'window-cleaning' | 'time-based' | 'area-based' | 'number-of-windows';

// Interface for the Calculator document
export interface ICalculator extends Document {
  userId: mongoose.Types.ObjectId;
  type: CalculatorType;
  name: string;
  hourlyWage: number;
  settings: CalculatorSettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for the Calculator
const CalculatorSchema = new Schema<ICalculator>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    type: {
      type: String,
      required: true,
      enum: ['window-cleaning', 'time-based', 'area-based', 'number-of-windows']
    },
    name: {
      type: String,
      required: true
    },
    hourlyWage: {
      type: Number,
      required: true,
      min: 0
    },
    settings: {
      type: Schema.Types.Mixed,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Create indexes for better query performance
CalculatorSchema.index({ userId: 1, type: 1 });
CalculatorSchema.index({ createdAt: -1 });

// Create the model
const Calculator = mongoose.model<ICalculator>('Calculator', CalculatorSchema);

export default Calculator; 