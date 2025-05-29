import { Invoice, IInvoice, CustomerDetails } from '../models/invoice.model';
import { pricingClient } from '../integrations/pricing.client';
import { EmailService } from './email.service';
import config from '../config/config';

export class InvoiceService {
  private emailService = new EmailService();

  async createInvoice(quoteId: string, customerDetails: CustomerDetails): Promise<IInvoice> {
    const quote = await pricingClient.getQuote(quoteId);
    console.log('Quote from pricing service:', quote);
    
    const invoice = new Invoice({
      quoteId: quote.id, // Using id instead of _id to match frontend
      customerDetails,
      amount: quote.estimatedPrice,
      currency: 'USD',
      status: 'pending',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

    console.log('Created invoice before save:', invoice);
    await invoice.save();
    console.log('Saved invoice:', invoice);

    // Transform the response to match frontend expectations
    const transformedInvoice = this.transformInvoice(invoice);
    console.log('Transformed invoice:', transformedInvoice);

    // Send invoice email if not in development mode or if explicitly configured
    if (!config.IS_DEVELOPMENT || process.env.SEND_EMAILS === 'true') {
      try {
        await this.emailService.sendInvoiceEmail(transformedInvoice);
      } catch (error) {
        console.error('Failed to send invoice email:', error);
        // Don't throw the error - we don't want to fail the invoice creation if email fails
      }
    }

    return transformedInvoice;
  }

  async getInvoiceById(id: string): Promise<IInvoice | null> {
    const invoice = await Invoice.findById(id).lean();
    if (!invoice) return null;
    return this.transformInvoice(invoice);
  }

  async listInvoices(): Promise<IInvoice[]> {
    const invoices = await Invoice.find().lean();
    return invoices.map(invoice => this.transformInvoice(invoice));
  }

  // Resend invoice email
  async resendInvoiceEmail(id: string): Promise<void> {
    const invoice = await Invoice.findById(id).lean();
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    await this.emailService.sendInvoiceEmail(this.transformInvoice(invoice));
  }

  private transformInvoice(invoice: any): IInvoice {
    return {
      ...invoice,
      id: invoice._id.toString(),
      amount: invoice.amount,
      customerDetails: invoice.customerDetails,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
      dueDate: invoice.dueDate.toISOString()
    };
  }
}
