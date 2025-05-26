// src/controllers/invoicing.controller.ts
import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoice.service';

export class InvoicingController {
  private invoiceService = new InvoiceService();

  // use arrow functions, not `async function`
  createInvoice = async (req: Request, res: Response) => {
    try {
      const { quoteId, customerDetails } = req.body;
      const invoice = await this.invoiceService.createInvoice(quoteId, customerDetails);
      res.json(invoice);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  getInvoiceById = async (req: Request, res: Response) => {
    const invoice = await this.invoiceService.getInvoiceById(req.params.id);
    res.json(invoice);
  };

  listInvoices = async (_req: Request, res: Response) => {
    const invoices = await this.invoiceService.listInvoices();
    res.json(invoices);
  };
}
