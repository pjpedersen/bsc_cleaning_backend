import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.register(email, password);
      res.status(201).json({ userId: result.user.id, email: result.user.email });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json({ token: result.token });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  profile = async (req: Request, res: Response) => {
    res.json({ user: (req as any).user });
  };
}
