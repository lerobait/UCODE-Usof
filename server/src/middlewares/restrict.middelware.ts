import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import { User } from '../../database/models/User';

interface RequestWithUser extends Request {
  user?: User;
}

const restrictTo = (...roles: Array<'user' | 'admin'>) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('You are not logged in', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };
};

export default restrictTo;
