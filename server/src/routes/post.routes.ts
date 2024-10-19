import { Router } from 'express';
import restrictTo from '../middlewares/restrict.middelware';
import protect from '../middlewares/protect.middelware';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
  createComment,
  getCommentsForPost,
  getCategoriesForPost,
  addlikeToPost,
  deleteLikeFromPost,
  getLikesForPost,
} from '../controllers/post.controller';

const router = Router();

router.get('/', getAllPosts);
router.get('/myPosts', protect, getMyPosts);
router.get('/:post_id', getPostById);
router.get('/:post_id/comments', getCommentsForPost);

router.use(protect);
router.post('/', createPost);
router.patch('/:post_id', updatePost);
router.delete('/:post_id', deletePost);
router.post('/:post_id/like', addlikeToPost);
router.delete('/:post_id/like', deleteLikeFromPost);
router.post('/:post_id/comments', createComment);

router.use(restrictTo('admin'));

router.get('/:post_id/categories', getCategoriesForPost);
router.get('/:post_id/like', getLikesForPost);

export default router;
