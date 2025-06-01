import { Router } from 'express';
import { InvoicingController } from '../../controllers/invoicing.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new InvoicingController();

router.post('/', authMiddleware, controller.createInvoice);
router.get('/:id', authMiddleware, controller.getInvoiceById);
router.get('/', authMiddleware, controller.listInvoices);
router.post('/:id/resend-email', authMiddleware, controller.resendInvoiceEmail);

export default router;
