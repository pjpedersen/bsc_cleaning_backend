import mongoose, { Schema } from 'mongoose';

const quoteSchema = new Schema({
  serviceType: String,
  parameters: Object,
  priceDetails: Object,
  createdAt: { type: Date, default: Date.now },
});

export const Quote = mongoose.model('Quote', quoteSchema);
