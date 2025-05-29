import sgMail from '@sendgrid/mail';
import { IInvoice } from '../models/invoice.model';
import config from '../config/config';

// Initialize SendGrid with API key
sgMail.setApiKey(config.SENDGRID_API_KEY);

export class EmailService {
  async sendInvoiceEmail(invoice: IInvoice): Promise<void> {
    const emailHtml = this.generateInvoiceHtml(invoice);
    
    const msg = {
      to: invoice.customerDetails.email,
      from: config.FROM_EMAIL, // This should be your verified sender
      subject: `Invoice #${invoice.id} from BSC Cleaning`,
      html: emailHtml,
    };

    try {
      await sgMail.send(msg);
      console.log(`Invoice email sent to ${invoice.customerDetails.email}`);
    } catch (error: any) {
      console.error('Error sending invoice email:', error);
      if (error.response) {
        console.error('SendGrid error:', error.response.body);
      }
      throw new Error('Failed to send invoice email');
    }
  }

  private generateInvoiceHtml(invoice: IInvoice): string {
    const dueDate = new Date(invoice.dueDate).toLocaleDateString();
    const amount = invoice.amount.toFixed(2);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; text-align: center; }
          .invoice-details { margin: 20px 0; }
          .customer-details { margin: 20px 0; }
          .amount { font-size: 24px; color: #007bff; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Invoice from BSC Cleaning</h1>
            <p>Invoice #${invoice.id}</p>
          </div>

          <div class="customer-details">
            <h2>Bill To:</h2>
            <p>${invoice.customerDetails.name}<br>
            ${invoice.customerDetails.address.street}<br>
            ${invoice.customerDetails.address.city}, ${invoice.customerDetails.address.state} ${invoice.customerDetails.address.zipCode}<br>
            ${invoice.customerDetails.address.country}</p>
          </div>

          <div class="invoice-details">
            <h2>Invoice Details</h2>
            <p><strong>Due Date:</strong> ${dueDate}</p>
            <p><strong>Status:</strong> ${invoice.status}</p>
            <p class="amount"><strong>Amount Due:</strong> ${invoice.currency} ${amount}</p>
          </div>

          <div class="payment-details">
            <h2>Payment Information</h2>
            <p>Please include your invoice number when making payment.</p>
            <p><strong>Bank Transfer Details:</strong><br>
            Bank: [Your Bank Name]<br>
            Account Name: BSC Cleaning<br>
            Account Number: [Your Account Number]<br>
            Sort Code: [Your Sort Code]</p>
          </div>

          <div class="footer">
            <p>Thank you for choosing BSC Cleaning</p>
            <p>If you have any questions, please contact us at [your contact email]</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
} 