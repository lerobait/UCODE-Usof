import { Router } from 'express';
import restrictTo from '../middlewares/restrict.middelware';
import protect from '../middlewares/protect.middelware';
import {
  getCommentById,
  updateComment,
  deleteComment,
  deleteCommentByAdmin,
  addLikeToComment,
  deleteLikeFromComment,
  getLikesForComment,
} from '../controllers/comment.controller';

const router = Router();

router.get('/:comment_id/like', getLikesForComment);

router.use(protect);
router.patch('/:comment_id', updateComment);
router.delete('/:comment_id', deleteComment);
router.post('/:comment_id/like', addLikeToComment);
router.delete('/:comment_id/like', deleteLikeFromComment);

router.use(restrictTo('admin'));
router.get('/:comment_id', getCommentById);
router.delete('/admin/:comment_id', deleteCommentByAdmin);

export default router;
