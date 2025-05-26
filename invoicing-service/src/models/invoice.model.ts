import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  quoteId: string;
  customerDetails: Record<string, any>;
  serviceType: string;
  parameters: any;
  total: number;
  createdAt: Date;
}

const invoiceSchema = new Schema<IInvoice>({
  quoteId: { type: String, required: true },
  customerDetails: { type: Schema.Types.Mixed, required: true },
  serviceType: { type: String, required: true },
  parameters: { type: Schema.Types.Mixed, required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
