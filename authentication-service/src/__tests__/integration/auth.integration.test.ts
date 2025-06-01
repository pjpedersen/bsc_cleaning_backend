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
    await db.collection('users').deleteMany({});
  }
});

describe('Authentication Service Integration Tests', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!'
  };

  describe('User Registration', () => {
    it('should successfully register a new user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty('userId');
      expect(res.body).toHaveProperty('email', testUser.email);
    });

    it('should return 400 error when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should prevent registration with an email that is already in use', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      // Second registration with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      // Register a user before each login test
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);
    });

    it('should successfully login with valid credentials and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(testUser)
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });

    it('should return 400 error when password is incorrect', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 error when user does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123!'
        })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('User Profile', () => {
    let authToken: string;

    beforeEach(async () => {
      // Register and login to get token
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send(testUser)
        .expect(200);

      authToken = loginRes.body.token;
    });

    it('should return user profile data when valid JWT token is provided', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('should return 401 error when no authentication token is provided', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 error when invalid authentication token is provided', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });
  });
}); 