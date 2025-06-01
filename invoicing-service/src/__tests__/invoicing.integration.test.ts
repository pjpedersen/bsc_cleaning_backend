import request from 'supertest';
import mongoose from 'mongoose';
import { pricingClient } from '../integrations/pricing.client';
import { EmailService } from '../services/email.service';
import app from '../app';
import config from '../config/config';

jest.mock('../integrations/pricing.client');
jest.mock('../services/email.service');

jest.setTimeout(10000);

// Mock auth token for testing
const MOCK_AUTH_TOKEN = 'Bearer test-token';

describe('Invoicing Service Integration', () => {
  beforeAll(async () => {
    await mongoose.connect(config.DB_URI + '_integration_test');
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    // Clean up the database before each test
    const db = mongoose.connection.db;
    if (db) {
      await db.dropCollection('invoices').catch(() => {});
    }
  });

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

  describe('POST /api/invoices', () => {
    it('201 - creates an invoice with valid quote and customer, sends email', async () => {
      (pricingClient.getQuote as jest.Mock).mockResolvedValue(mockQuote);
      (EmailService.prototype.sendInvoiceEmail as jest.Mock).mockResolvedValue(undefined);

      const createResponse = await request(app)
        .post('/api/invoices')
        .set('Authorization', MOCK_AUTH_TOKEN)
        .send({ quoteId: mockQuote.id, customerDetails: mockCustomer })
        .expect(201);

      const invoiceId = createResponse.body.id;
      expect(pricingClient.getQuote).toHaveBeenCalledWith(mockQuote.id);
      expect(pricingClient.getQuote).toHaveBeenCalledTimes(1);
      expect(EmailService.prototype.sendInvoiceEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          customerDetails: expect.objectContaining({
            email: mockCustomer.email
          }),
          id: invoiceId
        })
      );
      expect(EmailService.prototype.sendInvoiceEmail).toHaveBeenCalledTimes(1);
      const invoiceData = createResponse.body._doc || createResponse.body;
      expect(invoiceData).toMatchObject({
        quoteId: mockQuote.id,
        customerDetails: mockCustomer,
        amount: mockQuote.estimatedPrice,
        currency: 'USD',
        status: 'pending'
      });
    });

    it('500 - returns error when pricing service fails', async () => {
      (pricingClient.getQuote as jest.Mock).mockRejectedValue(new Error('Pricing service unavailable'));
      const response = await request(app)
        .post('/api/invoices')
        .set('Authorization', MOCK_AUTH_TOKEN)
        .send({ quoteId: 'INVALID', customerDetails: mockCustomer })
        .expect(500);
      expect(response.body).toEqual({
        error: 'Pricing service unavailable'
      });
      expect(EmailService.prototype.sendInvoiceEmail).not.toHaveBeenCalled();
    });

    it('201 - creates invoice even if email service fails', async () => {
      (pricingClient.getQuote as jest.Mock).mockResolvedValue(mockQuote);
      (EmailService.prototype.sendInvoiceEmail as jest.Mock).mockRejectedValue(new Error('Email service unavailable'));
      const response = await request(app)
        .post('/api/invoices')
        .set('Authorization', MOCK_AUTH_TOKEN)
        .send({ quoteId: mockQuote.id, customerDetails: mockCustomer })
        .expect(201);
      const invoiceData = response.body._doc || response.body;
      expect(invoiceData).toMatchObject({
        quoteId: mockQuote.id,
        customerDetails: mockCustomer,
        amount: mockQuote.estimatedPrice
      });
      expect(EmailService.prototype.sendInvoiceEmail).toHaveBeenCalled();
    });
  });

  describe('GET /api/invoices/:id', () => {
    it('200 - retrieves an invoice by ID', async () => {
      (pricingClient.getQuote as jest.Mock).mockResolvedValue(mockQuote);
      (EmailService.prototype.sendInvoiceEmail as jest.Mock).mockResolvedValue(undefined);
      const createResponse = await request(app)
        .post('/api/invoices')
        .set('Authorization', MOCK_AUTH_TOKEN)
        .send({ quoteId: mockQuote.id, customerDetails: mockCustomer })
        .expect(201);
      const invoiceId = createResponse.body.id;
      const getResponse = await request(app)
        .get(`/api/invoices/${invoiceId}`)
        .set('Authorization', MOCK_AUTH_TOKEN)
        .expect(200);
      const retrievedInvoice = getResponse.body._doc || getResponse.body;
      expect(retrievedInvoice).toMatchObject({
        id: invoiceId,
        quoteId: mockQuote.id,
        customerDetails: mockCustomer,
        amount: mockQuote.estimatedPrice
      });
    });
  });

  describe('GET /api/invoices', () => {
    it('200 - lists all invoices (data consistency)', async () => {
      (pricingClient.getQuote as jest.Mock).mockResolvedValue(mockQuote);
      (EmailService.prototype.sendInvoiceEmail as jest.Mock).mockResolvedValue(undefined);
      const firstResponse = await request(app)
        .post('/api/invoices')
        .set('Authorization', MOCK_AUTH_TOKEN)
        .send({ quoteId: mockQuote.id, customerDetails: mockCustomer })
        .expect(201);
      const firstInvoiceId = firstResponse.body.id;
      const secondQuote = { ...mockQuote, id: 'QUOTE456', estimatedPrice: 200 };
      (pricingClient.getQuote as jest.Mock).mockResolvedValue(secondQuote);
      const secondResponse = await request(app)
        .post('/api/invoices')
        .set('Authorization', MOCK_AUTH_TOKEN)
        .send({ quoteId: secondQuote.id, customerDetails: mockCustomer })
        .expect(201);
      const secondInvoiceId = secondResponse.body.id;
      expect(firstInvoiceId).not.toBe(secondInvoiceId);
      const listResponse = await request(app)
        .get('/api/invoices')
        .set('Authorization', MOCK_AUTH_TOKEN)
        .expect(200);
      expect(listResponse.body).toHaveLength(2);
      expect(listResponse.body.map((i: any) => i.id)).toContain(firstInvoiceId);
      expect(listResponse.body.map((i: any) => i.id)).toContain(secondInvoiceId);
      const firstInvoice = listResponse.body.find((i: any) => i.id === firstInvoiceId);
      const secondInvoice = listResponse.body.find((i: any) => i.id === secondInvoiceId);
      expect(firstInvoice).toMatchObject({
        quoteId: mockQuote.id,
        amount: mockQuote.estimatedPrice
      });
      expect(secondInvoice).toMatchObject({
        quoteId: secondQuote.id,
        amount: secondQuote.estimatedPrice
      });
    });
  });
}); 