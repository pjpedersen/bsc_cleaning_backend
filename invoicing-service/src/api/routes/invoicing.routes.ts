import { Router } from 'express';
import { InvoicingController } from '../../controllers/invoicing.controller';

const router = Router();
const controller = new InvoicingController();

router.post('/', controller.createInvoice);
router.get('/:id', controller.getInvoiceById);
router.get('/', controller.listInvoices);
router.post('/:id/resend-email', controller.resendInvoiceEmail);

export default router;
