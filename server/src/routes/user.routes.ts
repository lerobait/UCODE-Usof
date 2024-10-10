import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller';

const router = Router();

// Регистрация и вход
router.post('/signup', signup);
router.post('/login', login);

export default router;
