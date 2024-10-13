import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import * as authService from '../services/auth.service';

export const register: RequestHandler = catchAsync(async (req, res, next) => {
  const { login, email, password, password_confirm, full_name } = req.body;

  const newUser = await authService.registerUser(
    login,
    email,
    password,
    password_confirm,
    full_name,
  );

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
});

export const confirmEmail: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { token } = req.params;

    await authService.confirmUserEmail(token);

    res.status(200).json({
      status: 'success',
      message: 'Email successfully verified. You can now log in.',
    });
  },
);

export const login: RequestHandler = catchAsync(async (req, res, next) => {
  const { login, email, password } = req.body;

  const { token, user } = await authService.loginUser(login, email, password);

  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});

export const logout: RequestHandler = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

export const sendPasswordReset: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { email } = req.body;

    await authService.sendPasswordResetEmail(email);

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

    await authService.resetUserPassword(
      confirm_token,
      new_password,
      confirm_password,
    );

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully.',
    });
  },
);
