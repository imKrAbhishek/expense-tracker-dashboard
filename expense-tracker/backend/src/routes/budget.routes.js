import { Router } from 'express';
import * as budgetController from '../controllers/budget.controller.js';

const router = Router();

router.get('/', budgetController.listBudgets);
router.post('/', budgetController.createBudget);
router.put('/:id', budgetController.updateBudget);

export default router;
