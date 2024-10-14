import { Request, Response, NextFunction } from 'express';
import { User } from '../../database/models/User';
import bcrypt from 'bcrypt';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

interface CustomRequest extends Request {
  user?: User;
}

export const getMe = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: [
          'password',
          'email_verification_token',
          'email_verification_expires_at',
        ],
      },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  },
);

export const updateMyPassword = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword, passwordConfirmation } = req.body;

    if (!currentPassword || !newPassword || !passwordConfirmation) {
      return next(
        new AppError('Please provide current and new passwords', 400),
      );
    }

    if (newPassword !== passwordConfirmation) {
      return next(new AppError('Passwords do not match', 400));
    }

    const user = req.user;

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordCorrect) {
      return next(new AppError('Current password is incorrect', 401));
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
    });
  },
);

export const updateMe = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const { login, full_name } = req.body;

    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: [
          'password',
          'email_verification_token',
          'email_verification_expires_at',
        ],
      },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (login) {
      const existingUser = await User.findOne({ where: { login } });
      if (existingUser && existingUser.id !== user.id) {
        return next(new AppError('Login already in use', 400));
      }
      user.login = login;
    }

    if (full_name) {
      user.full_name = full_name;
    }

    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  },
);

export const deleteMe = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    await user.destroy();

    res.status(204).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  },
);

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.findAll({
      attributes: {
        exclude: [
          'password',
          'email_verification_token',
          'email_verification_expires_at',
        ],
      },
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  },
);

export const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id, {
      attributes: {
        exclude: [
          'password',
          'email_verification_token',
          'email_verification_expires_at',
        ],
      },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  },
);

export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { login, password, passwordConfirmation, email, role } = req.body;

    if (password !== passwordConfirmation) {
      return next(new AppError('Passwords do not match', 400));
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new AppError('User with this email already exists', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      login,
      password: hashedPassword,
      email,
      role,
      full_name: '',
      posts: [],
      comments: [],
      likes: [],
      sessions: [],
      passwordResets: [],
      email_verified: true,
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  },
);

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;
    const { role } = req.body;

    if (!role || (role !== 'user' && role !== 'admin')) {
      return next(new AppError('Invalid role provided', 400));
    }

    const user = await User.findByPk(user_id, {
      attributes: {
        exclude: [
          'password',
          'email_verification_token',
          'email_verification_expires_at',
        ],
      },
    });
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  },
);

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    await user.destroy();

    res.status(204).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  },
);
