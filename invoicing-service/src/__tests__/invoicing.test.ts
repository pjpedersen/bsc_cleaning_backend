import { InvoiceService } from '../services/invoice.service';
import { pricingClient } from '../integrations/pricing.client';
import { EmailService } from '../services/email.service';
import { Invoice } from '../models/invoice.model';

jest.mock('../integrations/pricing.client');
jest.mock('../services/email.service');
jest.mock('../models/invoice.model');

describe('InvoiceService (unit)', () => {
  let service: InvoiceService;
  const mockQuote = {
    id: 'QUOTE123',
    serviceType: 'HOME_CLEANING',
    parameters: { area: 75, rooms: 3 },
    estimatedPrice: 150
  };
  const mockCustomer = {
    name: 'Alice',
    email: 'alice@example.com',
    address: {
      street: '123 Main St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108',
      country: 'USA'
    }
  };
  const mockInvoiceDoc = {
    _id: { toString: () => 'INVOICEID' },
    quoteId: mockQuote.id,
    customerDetails: mockCustomer,
    amount: mockQuote.estimatedPrice,
    currency: 'USD',
    status: 'pending',
    dueDate: new Date('2025-07-01T00:00:00Z'),
    createdAt: new Date('2025-06-01T00:00:00Z'),
    updatedAt: new Date('2025-06-01T00:00:00Z'),
    save: jest.fn().mockResolvedValue(undefined)
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new InvoiceService();
  });

  it('creates an invoice from valid quote and customer details', async () => {
    (pricingClient.getQuote as jest.Mock).mockResolvedValue(mockQuote);
    (Invoice as any).mockImplementation(() => mockInvoiceDoc);
    (mockInvoiceDoc.save as jest.Mock).mockResolvedValue(undefined);
    (EmailService.prototype.sendInvoiceEmail as jest.Mock).mockResolvedValue(undefined);

    const result = await service.createInvoice(mockQuote.id, mockCustomer);
    expect(pricingClient.getQuote).toHaveBeenCalledWith(mockQuote.id);
    expect(mockInvoiceDoc.save).toHaveBeenCalled();
    expect(EmailService.prototype.sendInvoiceEmail).toHaveBeenCalledWith(expect.objectContaining({
      id: 'INVOICEID',
      customerDetails: mockCustomer
    }));
    expect(result).toMatchObject({
      id: 'INVOICEID',
      quoteId: mockQuote.id,
      customerDetails: mockCustomer,
      amount: mockQuote.estimatedPrice,
      currency: 'USD',
      status: 'pending',
      dueDate: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
  });

  it('throws if pricing service fails', async () => {
    (pricingClient.getQuote as jest.Mock).mockRejectedValue(new Error('Pricing service unavailable'));
    await expect(service.createInvoice('BAD', mockCustomer)).rejects.toThrow('Pricing service unavailable');
    expect(EmailService.prototype.sendInvoiceEmail).not.toHaveBeenCalled();
  });

  it('does not throw if email service fails', async () => {
    (pricingClient.getQuote as jest.Mock).mockResolvedValue(mockQuote);
    (Invoice as any).mockImplementation(() => mockInvoiceDoc);
    (mockInvoiceDoc.save as jest.Mock).mockResolvedValue(undefined);
    (EmailService.prototype.sendInvoiceEmail as jest.Mock).mockRejectedValue(new Error('Email service unavailable'));
    await expect(service.createInvoice(mockQuote.id, mockCustomer)).resolves.toBeDefined();
    expect(EmailService.prototype.sendInvoiceEmail).toHaveBeenCalled();
  });

  it('getInvoiceById returns transformed invoice if found', async () => {
    (Invoice.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        ...mockInvoiceDoc,
        _id: { toString: () => 'INVOICEID' }
      })
    });
    const result = await service.getInvoiceById('INVOICEID');
    expect(result).toMatchObject({
      id: 'INVOICEID',
      quoteId: mockQuote.id,
      customerDetails: mockCustomer
    });
  });

  it('getInvoiceById returns null if not found', async () => {
    (Invoice.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(null)
    });
    const result = await service.getInvoiceById('NOTFOUND');
    expect(result).toBeNull();
  });

  it('listInvoices returns transformed invoices', async () => {
    (Invoice.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue([
        { ...mockInvoiceDoc, _id: { toString: () => 'INVOICEID1' } },
        { ...mockInvoiceDoc, _id: { toString: () => 'INVOICEID2' } }
      ])
    });
    const result = await service.listInvoices();
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ id: 'INVOICEID1' });
    expect(result[1]).toMatchObject({ id: 'INVOICEID2' });
  });

  it('resendInvoiceEmail throws if invoice not found', async () => {
    (Invoice.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(null)
    });
    await expect(service.resendInvoiceEmail('NOTFOUND')).rejects.toThrow('Invoice not found');
  });

  it('resendInvoiceEmail sends email if invoice found', async () => {
    (Invoice.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockInvoiceDoc)
    });
    (EmailService.prototype.sendInvoiceEmail as jest.Mock).mockResolvedValue(undefined);
    await service.resendInvoiceEmail('INVOICEID');
    expect(EmailService.prototype.sendInvoiceEmail).toHaveBeenCalledWith(expect.objectContaining({
      id: expect.any(String),
      customerDetails: mockCustomer
    }));
  });
});
