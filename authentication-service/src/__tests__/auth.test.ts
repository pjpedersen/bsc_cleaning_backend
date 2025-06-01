import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import config from '../config/config';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken, verifyToken } from '../utils/jwt';
import { validateEmail, validatePassword } from '../utils/validation';

beforeAll(async () => {
    // connect to a dedicated test database
    await mongoose.connect(config.DB_URI + '_test');
  
    // only drop the collection if `db` exists
    const db = mongoose.connection.db;
    if (db) {
      await db.dropCollection('users').catch(() => {});
    }
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });
  


describe('Authentication API', () => {
  let token: string;

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'bob@example.com', password: 'TestPass123' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('email', 'bob@example.com');
  });

  it('should not register the same user twice', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'bob@example.com', password: 'TestPass123' });
    expect(res.statusCode).toBe(400);
  });

  it('should login and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@example.com', password: 'TestPass123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should reject login with bad credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@example.com', password: 'WrongPass' });
    expect(res.statusCode).toBe(400);
  });

  it('should get profile when authorized', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('email', 'bob@example.com');
  });

  it('should deny profile when unauthorized', async () => {
    const res = await request(app)
      .get('/api/auth/profile');
    expect(res.statusCode).toBe(401);
  });
});

describe('Password Utils', () => {
  it('should hash and compare passwords correctly', async () => {
    const password = 'Test123!';
    const hashedPassword = await hashPassword(password);
    
    expect(hashedPassword).not.toBe(password);
    expect(await comparePassword(password, hashedPassword)).toBe(true);
    expect(await comparePassword('wrongpassword', hashedPassword)).toBe(false);
  });
});

describe('JWT Utils', () => {
  const testPayload = { userId: '123', email: 'test@example.com' };
  
  it('should generate and verify tokens correctly', () => {
    const token = generateToken(testPayload);
    const decoded = verifyToken(token);
    
    expect(token).toBeDefined();
    expect(decoded).toMatchObject(testPayload);
  });

  it('should reject invalid tokens', () => {
    expect(() => verifyToken('invalid-token')).toThrow();
  });
});

describe('Validation Utils', () => {
  it('should validate email addresses correctly', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('should validate passwords correctly', () => {
    expect(validatePassword('Test123!')).toBe(true);
    expect(validatePassword('weak')).toBe(false);
    expect(validatePassword('')).toBe(false);
  });
});
