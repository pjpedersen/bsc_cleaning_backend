import request from 'supertest';
import mongoose from 'mongoose';

jest.mock('../integrations/pricing.client');
import { pricingClient } from '../integrations/pricing.client';

import app from '../app';
import config from '../config/config';

jest.setTimeout(10000);

beforeAll(async () => {
  await mongoose.connect(config.DB_URI + '_test');
  const db = mongoose.connection.db;
  if (db) {
    await db.dropCollection('invoices').catch(() => {});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Invoicing API', () => {
  let invoiceId: string;

  it('creates an invoice from a valid quote and customer details', async () => {
    const fakeQuote = {
      _id: 'QUOTE123',
      serviceType: 'HOME_CLEANING',
      parameters: { area: 75, rooms: 3 },
      total: 150
    };
    (pricingClient.getQuote as jest.Mock).mockResolvedValue(fakeQuote);

    const customer = { name: 'Alice', email: 'alice@example.com' };
    const res = await request(app)
      .post('/api/invoices')
      .send({ quoteId: fakeQuote._id, customerDetails: customer })
      .expect(200);

    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('quoteId', fakeQuote._id);
    expect(res.body).toHaveProperty('customerDetails');
    expect(res.body.customerDetails).toMatchObject(customer);
    expect(res.body).toHaveProperty('serviceType', fakeQuote.serviceType);
    invoiceId = res.body._id;
  });

  it('retrieves an invoice by ID', async () => {
    const res = await request(app)
      .get('/api/invoices/' + invoiceId)
      .expect(200);

    expect(res.body).toHaveProperty('_id', invoiceId);
  });

  it('lists all invoices', async () => {
    const res = await request(app)
      .get('/api/invoices')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('returns 500 on invalid create', async () => {
    (pricingClient.getQuote as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app)
      .post('/api/invoices')
      .send({ quoteId: 'BAD', customerDetails: {} })
      .expect(500);

    expect(res.body).toHaveProperty('error');
  });
});
