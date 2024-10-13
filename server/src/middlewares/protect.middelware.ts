import { RequestHandler, Request } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../database/models/User';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

interface DecodedToken {
  id: number;
  iat: number;
  exp: number;
}

interface CustomRequest extends Request {
  user?: User;
}

const protect: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError(
          'You are not logged in! Please log in to get access.',
          401,
        ),
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as unknown as DecodedToken;

    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401),
      );
    }

    req.user = currentUser;
    next();
  },
);

export default protect;
