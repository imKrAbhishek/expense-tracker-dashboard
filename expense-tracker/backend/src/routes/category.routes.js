import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';

const router = Router();

router.get('/', categoryController.listCategories);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
