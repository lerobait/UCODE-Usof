import { RequestHandler, Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import crypto from 'crypto';
import { User } from '../../database/models/User';
import { PasswordReset } from '../../database/models/PasswordReset';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import sendEmail from '../utils/email';

const signToken = (userId: number) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

interface RegisterRequestBody {
  login: string;
  email: string;
  password: string;
  password_confirm: string;
  full_name: string;
}

export const register: RequestHandler<{}, {}, RegisterRequestBody> = catchAsync(
  async (req, res, next) => {
    const { login, email, password, password_confirm, full_name } = req.body;

    if (!validator.isEmail(email)) {
      return next(new AppError('Please provide a valid email address.', 400));
    }

    if (password !== password_confirm) {
      return next(new AppError('Passwords do not match.', 400));
    }

    const existingUserWithLogin = await User.findOne({ where: { login } });
    if (existingUserWithLogin) {
      return next(new AppError('A user with this login already exists.', 400));
    }

    const existingUserWithEmail = await User.findOne({ where: { email } });
    if (existingUserWithEmail) {
      return next(new AppError('A user with this email already exists.', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const emailToken = crypto.randomBytes(32).toString('hex');

    const newUser = await User.create({
      login,
      email,
      password: hashedPassword,
      full_name,
      email_verified: false,
      email_verification_token: emailToken,
      posts: [],
      comments: [],
      likes: [],
      sessions: [],
      passwordResets: [],
    });

    const confirmURL = `${process.env.FRONTEND_URL}/confirm-email/${emailToken}`;
    await sendEmail({
      to: email,
      subject: 'Email confirmation',
      text: `Please confirm your email: ${confirmURL}`,
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Please confirm your email.',
      user: {
        id: newUser.id,
        login: newUser.login,
        email: newUser.email,
        full_name: newUser.full_name,
        email_verified: newUser.email_verified,
      },
    });
  },
);

export const confirmEmail: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { token } = req.params;

    const user = await User.findOne({
      where: { email_verification_token: token },
    });

    if (!user) {
      return next(
        new AppError('Invalid or expired email confirmation token.', 400),
      );
    }

    user.email_verified = true;
    user.email_verification_token = null;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Email successfully verified. You can now log in.',
    });
  },
);

interface LoginRequestBody {
  login: string;
  email: string;
  password: string;
}

export const login: RequestHandler<{}, {}, LoginRequestBody> = catchAsync(
  async (req, res, next) => {
    const { login, email, password } = req.body;

    const user = await User.findOne({ where: { login, email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Incorrect credentials', 401));
    }

    if (!user.email_verified) {
      return next(
        new AppError('Please verify your email before logging in.', 403),
      );
    }

    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
    });
  },
);

export const logout: RequestHandler = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

interface DecodedToken {
  id: number;
  iat: number;
  exp: number;
}

interface CustomRequest extends Request {
  user?: User;
}

export const protect: RequestHandler = catchAsync(
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

export const sendPasswordReset: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new AppError('User with this email not found.', 404));
    }

    const token = crypto.randomBytes(32).toString('hex');
    await PasswordReset.create({
      email: user.email,
      token,
      user_id: user.id,
    } as PasswordReset);

    const resetURL = `${process.env.FRONTEND_URL}/password-reset/${token}`;
    const message = `To reset your password, please follow the link below: ${resetURL}`;

    await sendEmail({
      to: email,
      subject: 'Reset password',
      text: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'A password reset link has been sent to your email.',
    });
  },
);

export const confirmPasswordReset: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { confirm_token } = req.params;
    const { new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
      return next(new AppError('Passwords do not match.', 400));
    }

    const passwordReset = await PasswordReset.findOne({
      where: { token: confirm_token },
    });
    if (!passwordReset) {
      return next(new AppError('Invalid password reset token.', 400));
    }

    const user = await User.findByPk(passwordReset.user_id);
    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    user.password = await bcrypt.hash(new_password, 12);
    await user.save();

    await passwordReset.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully.',
    });
  },
);
