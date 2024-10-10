import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../database/models/User';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

const signToken = (userId: number) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup: RequestHandler = catchAsync(async (req, res, next) => {
  const { login, email, password, full_name } = req.body;

  const existingUserWithLogin = await User.findOne({ where: { login } });
  if (existingUserWithLogin) {
    return next(new AppError('A user with this login already exists.', 400));
  }

  const existingUserWithEmail = await User.findOne({ where: { email } });
  if (existingUserWithEmail) {
    return next(new AppError('A user with this email already exists.', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    login,
    email,
    password: hashedPassword,
    full_name,
    posts: [],
    comments: [],
    likes: [],
    sessions: [],
    passwordResets: [],
  });

  const token = signToken(newUser.id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

export const login: RequestHandler = catchAsync(async (req, res, next) => {
  const { login, password } = req.body;

  const user = await User.findOne({ where: { login } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect credentials', 401));
  }

  const token = signToken(user.id);

  res.status(200).json({
    status: 'success',
    token,
  });
});
