import { Router } from 'express';
import restrictTo from '../middlewares/restrict.middelware';
import protect from '../middlewares/protect.middelware';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/post.controller';

const router = Router();

router.get('/', getAllPosts);
router.get('/:post_id', getPostById);

router.use(protect);

router.post('/', createPost);
router.patch('/:post_id', updatePost);
router.delete('/:post_id', deletePost);

router.use(restrictTo('admin'));

export default router;
