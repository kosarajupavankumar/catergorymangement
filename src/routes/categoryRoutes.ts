import { Router } from 'express';
import categoryController from '../controllers/categoryController';

const router = Router();

router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
router.get('/tree', categoryController.getCategoriesTree);

export default router;
