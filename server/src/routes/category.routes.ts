import { Router } from 'express';
import restrictTo from '../middlewares/restrict.middelware';
import protect from '../middlewares/protect.middelware';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getPostsByCategoryId,
} from '../controllers/category.controller';

const router = Router();

router.get('/', getAllCategories);
router.get('/:category_id/posts', getPostsByCategoryId);
router.get('/:category_id', getCategoryById);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createCategory);
router.patch('/:category_id', updateCategory);
router.delete('/:category_id', deleteCategory);

export default router;
