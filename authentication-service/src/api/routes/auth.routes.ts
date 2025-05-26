import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new AuthController();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/profile', authMiddleware, controller.profile);

export default router;
