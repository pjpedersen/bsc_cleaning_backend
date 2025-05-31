import mongoose, { Schema, Document } from 'mongoose';

export interface IQuote extends Document {
  userId: mongoose.Types.ObjectId;
  customerType: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  note?: string;
  service: string;
  estimatedPrice: number;
  parameters: Record<string, any>;
  status: 'Pending' | 'Accepted' | 'Dismissed' | 'Waiting';
  createdAt: Date;
  updatedAt: Date;
}

const quoteSchema = new Schema<IQuote>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerType: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  note: { type: String },
  service: { type: String, required: true },
  estimatedPrice: { type: Number, required: true },
  parameters: { type: Schema.Types.Mixed, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['Pending', 'Accepted', 'Dismissed', 'Waiting'],
    default: 'Pending'
  },
}, {
  timestamps: true // This will add createdAt and updatedAt fields automatically
});

// Create indexes for better query performance
quoteSchema.index({ userId: 1 });
quoteSchema.index({ createdAt: -1 });

export const Quote = mongoose.model<IQuote>('Quote', quoteSchema);
