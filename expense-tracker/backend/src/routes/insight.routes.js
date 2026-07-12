import { Router } from 'express';
import * as insightController from '../controllers/insight.controller.js';

const router = Router();

router.post('/categorize', insightController.categorize);
router.get('/recurring', insightController.recurring);
router.get('/next-month-forecast', insightController.forecast);
router.get('/budget-alerts', insightController.budgetAlerts);

export default router;
