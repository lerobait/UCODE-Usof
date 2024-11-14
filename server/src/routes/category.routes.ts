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

router.use(protect);

router.get('/:category_id', getCategoryById);
router.get('/:category_id/posts', getPostsByCategoryId);

router.use(restrictTo('admin'));

router.post('/', createCategory);
router.patch('/:category_id', updateCategory);
router.delete('/:category_id', deleteCategory);

export default router;
