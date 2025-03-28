import { Invoice } from '../models/invoice.model';
import { pricingClient } from '../integrations/pricing.client';

export class InvoiceService {
  async createInvoice(quoteId: string, customerDetails: any): Promise<any> {
    const quoteDetails = await pricingClient.getQuoteById(quoteId);

    const invoice = new Invoice({
      quoteId,
      quoteDetails,
      customerDetails,
      status: 'PENDING_PAYMENT',
      createdAt: new Date(),
    });

    return invoice.save();
  }

  async getInvoiceById(invoiceId: string): Promise<any> {
    return Invoice.findById(invoiceId
