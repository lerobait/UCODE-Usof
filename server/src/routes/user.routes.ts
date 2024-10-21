import { Router } from 'express';
import restrictTo from '../middlewares/restrict.middelware';
import protect from '../middlewares/protect.middelware';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  updateMyPassword,
  updateMe,
  deleteMe,
  uploadUserAvatar,
} from '../controllers/user.controller';

const router = Router();

router.use(protect);

router.get('/', getAllUsers);
router.get('/:user_id', getUserById);
router.get('/me', getMe);
router.patch('/updateMyPassword', updateMyPassword);
router.patch('/avatar', uploadUserAvatar);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin'));

router.post('/', createUser);
router.route('/:user_id').patch(updateUser).delete(deleteUser);

// SHOULD MODIFY DELETED USER TO DELETE ALL POSTS AND COMMENTS WITH THAT USER ID

export default router;
