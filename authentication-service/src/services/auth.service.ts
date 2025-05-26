import { User, IUser } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import config from '../config/config';

export class AuthService {
  async register(email: string, password: string): Promise<{ user: IUser }> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ email, password: hash });
    await user.save();
    return { user };
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const signOptions: SignOptions = { expiresIn: config.JWT_EXPIRES_IN };
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.JWT_SECRET as Secret,
      signOptions
    );

    return { token };
  }

  async verifyToken(token: string): Promise<any> {
    return jwt.verify(token, config.JWT_SECRET as Secret);
  }
}
