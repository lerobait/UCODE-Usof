import { Request, Response, NextFunction } from 'express';
import { User } from '../../database/models/User';
import UserService from '../services/user.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import uploadImage from '../utils/upload';

interface CustomRequest extends Request {
  user?: User;
  file?: Express.Multer.File | Express.MulterS3.File;
}

export const getMe = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const user = await UserService.getMe(req.user.id);
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

    await UserService.updateMyPassword(user, currentPassword, newPassword);

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
    });
  },
);

export const uploadUserAvatar = [
  uploadImage.single('avatar'),
  catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }

    const avatarUrl = (req.file as Express.MulterS3.File).location;

    const updatedUser = await UserService.updateAvatar(req.user.id, avatarUrl);

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  }),
];

export const updateMe = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const { login, full_name } = req.body;

    const user = await UserService.updateMe(req.user.id, login, full_name);

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

    await UserService.deleteMe(req.user.id);

    res.status(204).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  },
);

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.getAllUsers();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  },
);

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.params;

  const user = await UserService.getUserById(Number(user_id));

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        login: user.login,
        full_name: user.full_name,
        profile_picture: user.profile_picture,
        rating: user.rating,
      },
    },
  });
});

export const getUserByLogin = catchAsync(
  async (req: Request, res: Response) => {
    const { login } = req.params;

    const user = await UserService.getUserByLogin(login);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          login: user.login,
          full_name: user.full_name,
          profile_picture: user.profile_picture,
          rating: user.rating,
        },
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

    const newUser = await UserService.createUser(login, password, email, role);

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

    const user = await UserService.updateUser(Number(user_id), role);

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

    await UserService.deleteUser(Number(user_id));

    res.status(204).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  },
);

export const getUserByIdAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;

    const user = await UserService.getUserByIdAdmin(Number(user_id));

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  },
);
