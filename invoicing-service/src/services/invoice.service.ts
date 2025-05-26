import { Invoice, IInvoice } from '../models/invoice.model';
import { pricingClient } from '../integrations/pricing.client';

export class InvoiceService {
  async createInvoice(quoteId: string, customerDetails: Record<string, any>): Promise<IInvoice> {
    const quote = await pricingClient.getQuote(quoteId);
    const invoice = new Invoice({
      quoteId: quote._id,
      customerDetails: customerDetails,
      serviceType: quote.serviceType,
      parameters: quote.parameters,
      total: quote.total
    });
    await invoice.save();
    return invoice;
  }

  async getInvoiceById(id: string): Promise<IInvoice | null> {
    return Invoice.findById(id).exec();
  }

  async listInvoices(): Promise<IInvoice[]> {
    return Invoice.find().exec();
  }
}
