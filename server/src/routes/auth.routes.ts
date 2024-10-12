import { Router } from 'express';
import {
  register,
  login,
  logout,
  protect,
  sendPasswordReset,
  confirmPasswordReset,
  confirmEmail,
} from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.get('/confirm-email/:token', confirmEmail);
router.post('/login', login);
router.get('/logout', logout);

router.post('/password-reset', sendPasswordReset);
router.post('/password-reset/:confirm_token', confirmPasswordReset);

router.use(protect);

export default router;
