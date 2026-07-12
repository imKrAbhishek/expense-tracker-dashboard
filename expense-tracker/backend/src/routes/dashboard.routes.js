import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/summary', dashboardController.getSummary);
router.get('/by-category', dashboardController.getByCategory);
router.get('/monthly-trend', dashboardController.getMonthlyTrend);

export default router;
