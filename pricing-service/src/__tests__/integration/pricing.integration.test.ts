import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import config from '../../config/config';

jest.setTimeout(10000);

beforeAll(async () => {
  await mongoose.connect(`${config.DB_URI}_test`);
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  // Clear the database before each test
  const db = mongoose.connection.db;
  if (db) {
    await db.collection('quotes').deleteMany({});
  }
});

describe('POST /api/pricing/calculate', () => {
  it('calculates price for window cleaning', async () => {
    const res = await request(app)
      .post('/api/pricing/calculate')
      .send({
        serviceType: 'WINDOW_CLEANING',
        parameters: {
          windows: '1:5',
          floor: '2',
          cleaningType: 'Indvendig',
          stormWindows: 'Nej',
          servicePlan: 'one-time'
        }
      })
      .expect(200);

    expect(res.body).toHaveProperty('estimatedPrice');
    expect(res.body).toHaveProperty('breakdown');
    expect(typeof res.body.estimatedPrice).toBe('number');
    expect(res.body.breakdown).toHaveProperty('basePrice');
    expect(res.body.breakdown).toHaveProperty('floorAdjustment');
    expect(res.body.breakdown).toHaveProperty('cleaningTypeMultiplier');
    expect(res.body.breakdown).toHaveProperty('stormWindowsMultiplier');
    expect(res.body.breakdown).toHaveProperty('subscriptionDiscount');
  });

  it('validates required fields', async () => {
    const res = await request(app)
      .post('/api/pricing/calculate')
      .send({})
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/pricing/quotes/:id', () => {
  it('retrieves a quote by ID', async () => {
    // First create a quote
    const createRes = await request(app)
      .post('/api/pricing/calculate')
      .send({
        serviceType: 'WINDOW_CLEANING',
        parameters: {
          windows: '1:5',
          floor: '2',
          cleaningType: 'Indvendig',
          stormWindows: 'Nej',
          servicePlan: 'one-time'
        },
        // Add required fields for quote creation
        userId: new mongoose.Types.ObjectId(),
        customerType: 'residential',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        address: '123 Test St',
        city: 'Test City',
        zip: '12345'
      })
      .expect(200);

    const quoteId = createRes.body._id;

    // Then retrieve it
    const res = await request(app)
      .get(`/api/pricing/quotes/${quoteId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', quoteId);
    expect(res.body).toHaveProperty('service', 'WINDOW_CLEANING');
    expect(res.body).toHaveProperty('estimatedPrice');
    expect(res.body).toHaveProperty('parameters');
  });

  it('returns 404 for non-existent ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await request(app)
      .get(`/api/pricing/quotes/${nonExistentId}`)
      .expect(404);
  });
}); 