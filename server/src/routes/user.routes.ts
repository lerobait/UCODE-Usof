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
  getUserByIdAdmin,
} from '../controllers/user.controller';

const router = Router();

router.use(protect);

router.get('/', getAllUsers);
router.get('/me', getMe);
router.get('/:user_id', getUserById);
router.patch('/updateMyPassword', updateMyPassword);
router.patch('/avatar', uploadUserAvatar);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin'));

router.post('/', createUser);
router
  .route('/admin/:user_id/')
  .get(getUserByIdAdmin)
  .patch(updateUser)
  .delete(deleteUser);

export default router;
