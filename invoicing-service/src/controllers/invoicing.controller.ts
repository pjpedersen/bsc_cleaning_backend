import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoice.service';

export class InvoicingController {
  private invoiceService = new InvoiceService();

  createInvoice = async (req: Request, res: Response) => {
    try {
      const { quoteId, customerDetails } = req.body;
      const invoice = await this.invoiceService.createInvoice(quoteId, customerDetails);
      res.json(invoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  getInvoiceById = async (req: Request, res: Response) => {
    const invoice = await this.invoiceService.getInvoiceById(req.params.id);
    res.json(invoice);
  };

  listInvoices = async (req: Request, res: Response) => {
    const invoices = await this.invoiceService.listInvoices();
    res.json(invoices);
  };
}
