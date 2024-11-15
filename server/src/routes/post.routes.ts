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
  addPostToFavorites,
  getMyFavoritePosts,
  removePostFromFavorites,
  getUserPosts,
} from '../controllers/post.controller';

const router = Router();

router.get('/', getAllPosts);
router.get('/user/:user_id/posts', getUserPosts);
router.get('/myPosts', protect, getMyPosts);
router.get('/myFavoritePosts', protect, getMyFavoritePosts);
router.get('/:post_id', getPostById);
router.get('/:post_id/comments', getCommentsForPost);
router.get('/:post_id/categories', getCategoriesForPost);

router.use(protect);
router.post('/', createPost);
router.patch('/:post_id', updatePost);
router.delete('/:post_id', deletePost);
router.post('/:post_id/favorite', addPostToFavorites);
router.delete('/:post_id/favorite', removePostFromFavorites);
router.post('/:post_id/like', addlikeToPost);
router.delete('/:post_id/like', deleteLikeFromPost);
router.post('/:post_id/comments', createComment);
router.get('/:post_id/like', getLikesForPost);

router.use(restrictTo('admin'));

export default router;
