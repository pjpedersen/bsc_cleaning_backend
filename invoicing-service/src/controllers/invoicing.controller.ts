// src/controllers/invoicing.controller.ts
import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoice.service';
import { CustomerDetails } from '../models/invoice.model';

export class InvoicingController {
  private invoiceService = new InvoiceService();

  createInvoice = async (req: Request, res: Response) => {
    try {
      // Check for authentication header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { quoteId, customerDetails } = req.body;

      // Validate required fields
      if (!quoteId || !customerDetails) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          message: 'Both quoteId and customerDetails are required'
        });
      }

      // Validate customer details structure
      if (!this.isValidCustomerDetails(customerDetails)) {
        return res.status(400).json({ 
          error: 'Invalid customer details format',
          message: 'Customer details must include name, email, and complete address'
        });
      }

      const invoice = await this.invoiceService.createInvoice(quoteId, customerDetails);
      res.status(201).json(invoice);
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to create invoice'
      });
    }
  };

  getInvoiceById = async (req: Request, res: Response) => {
    try {
      // Check for authentication header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const invoice = await this.invoiceService.getInvoiceById(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error: any) {
      console.error('Error fetching invoice:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch invoice' });
    }
  };

  listInvoices = async (req: Request, res: Response) => {
    try {
      // Check for authentication header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const invoices = await this.invoiceService.listInvoices();
      res.json(invoices);
    } catch (error: any) {
      console.error('Error listing invoices:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch invoices' });
    }
  };

  resendInvoiceEmail = async (req: Request, res: Response) => {
    try {
      // Check for authentication header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { id } = req.params;
      await this.invoiceService.resendInvoiceEmail(id);
      res.json({ message: 'Invoice email resent successfully' });
    } catch (error: any) {
      console.error('Error resending invoice email:', error);
      res.status(500).json({ error: error.message || 'Failed to resend invoice email' });
    }
  };

  private isValidCustomerDetails(details: any): details is CustomerDetails {
    return (
      details &&
      typeof details.name === 'string' &&
      typeof details.email === 'string' &&
      details.address &&
      typeof details.address.street === 'string' &&
      typeof details.address.city === 'string' &&
      typeof details.address.state === 'string' &&
      typeof details.address.zipCode === 'string' &&
      typeof details.address.country === 'string'
    );
  }
}
