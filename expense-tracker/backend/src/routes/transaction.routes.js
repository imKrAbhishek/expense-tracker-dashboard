import { Router } from 'express';
import * as txController from '../controllers/transaction.controller.js';

const router = Router();

router.get('/', txController.listTransactions);
router.post('/', txController.createTransaction);
router.put('/:id', txController.updateTransaction);
router.delete('/:id', txController.deleteTransaction);

export default router;
