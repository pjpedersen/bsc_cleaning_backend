import mongoose, { Schema, Document } from 'mongoose';

export interface CustomerDetails {
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface IInvoice extends Document {
  quoteId: string;
  customerDetails: CustomerDetails;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>({
  quoteId: { type: String, required: true },
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true }
    }
  },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  dueDate: { 
    type: Date, 
    required: true, 
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
