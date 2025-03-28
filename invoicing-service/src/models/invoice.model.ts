import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  quoteId: String,
  customerDetails: Object,
  quoteDetails: Object,
  status: String,
  createdAt: { type: Date, default: Date.now },
  paidAt: Date,
});

export const Invoice = mongoose.model('Invoice', schema);
