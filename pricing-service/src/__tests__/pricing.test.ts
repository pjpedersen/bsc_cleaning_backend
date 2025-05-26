import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import config from '../config/config';

jest.setTimeout(10000);

beforeAll(async () => {
  // connect to the test DB
  await mongoose.connect(`${config.DB_URI}_test`);
  // drop any existing quotes
  const db = mongoose.connection.db;
  if (db) {
    await db.dropCollection('quotes').catch(() => {});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Pricing API', () => {
  let quoteId: string;

  it('calculates a HOME_CLEANING quote', async () => {
    const res = await request(app)
      .post('/api/pricing/calculate')
      .send({
        serviceType: 'HOME_CLEANING',
        parameters: { area: 120, rooms: 4 }
      })
      .expect(200);

    expect(res.body).toHaveProperty('priceDetails');
    expect(res.body.priceDetails).toHaveProperty('total');
    expect(typeof res.body.priceDetails.total).toBe('number');
    expect(res.body.priceDetails).toHaveProperty('breakdown');

    expect(res.body).toHaveProperty('quoteId');
    quoteId = res.body.quoteId;
  });

  it('calculates a LAWN_CARE quote', async () => {
    const res = await request(app)
      .post('/api/pricing/calculate')
      .send({
        serviceType: 'LAWN_CARE',
        parameters: { lawnSize: 500, frequency: 'WEEKLY' }
      })
      .expect(200);

    expect(res.body.priceDetails.total).toBeGreaterThan(0);
    expect(res.body.priceDetails.breakdown).toBeDefined();
  });

  it('calculates a WINDOW_CLEANING quote', async () => {
    const res = await request(app)
      .post('/api/pricing/calculate')
      .send({
        serviceType: 'WINDOW_CLEANING',
        parameters: {
          numberOfWindows: 5,
          numberOfFloors: 2,
          windowSize: 'small'
        }
      })
      .expect(200);

    const breakdown = res.body.priceDetails.breakdown;
    // allow for tiny floating-point variance
    expect(breakdown.windowsCost).toBeCloseTo(55, 5);
    expect(breakdown.fixedServiceCharge).toBe(30);

    expect(res.body.priceDetails.total).toBe(85);
  });

  it('stores and retrieves a quote by ID', async () => {
    const res = await request(app)
      .get(`/api/pricing/quotes/${quoteId}`)
      .expect(200);

    expect(res.body).toHaveProperty('_id', quoteId);
    expect(res.body).toHaveProperty('serviceType', 'HOME_CLEANING');
    expect(res.body).toHaveProperty('parameters');
    expect(res.body).toHaveProperty('priceDetails');
    expect(res.body.priceDetails).toHaveProperty('total');
  });
});
