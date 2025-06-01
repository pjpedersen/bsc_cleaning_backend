import jwt from 'jsonwebtoken';
import config from '../config/config';

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.JWT_SECRET);
}; 