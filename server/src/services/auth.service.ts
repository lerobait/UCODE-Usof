import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import crypto from 'crypto';
import { User } from '../../database/models/User';
import { PasswordReset } from '../../database/models/PasswordReset';
import AppError from '../utils/appError';
import sendEmail from '../utils/email';

const signToken = (userId: number) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const registerUser = async (
  login: string,
  email: string,
  password: string,
  passwordConfirm: string,
  fullName: string,
) => {
  if (!validator.isEmail(email)) {
    throw new AppError('Please provide a valid email address.', 400);
  }

  if (password !== passwordConfirm) {
    throw new AppError('Passwords do not match.', 400);
  }

  const existingUserWithLogin = await User.findOne({ where: { login } });
  if (existingUserWithLogin) {
    throw new AppError('A user with this login already exists.', 400);
  }

  const existingUserWithEmail = await User.findOne({ where: { email } });
  if (existingUserWithEmail) {
    const now = new Date();
    if (
      !existingUserWithEmail.email_verified &&
      now > existingUserWithEmail.email_verification_expires_at
    ) {
      await User.destroy({ where: { id: existingUserWithEmail.id } });
    } else {
      throw new AppError('A user with this email already exists.', 400);
    }
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const emailToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000);

  const newUser = await User.create({
    login,
    email,
    password: hashedPassword,
    full_name: fullName,
    email_verified: false,
    email_verification_token: emailToken,
    email_verification_expires_at: expiresAt,
    posts: [],
    comments: [],
    likes: [],
    passwordResets: [],
  });

  const confirmURL = `${process.env.FRONTEND_URL}/confirm-email/${emailToken}`;
  await sendEmail({
    to: email,
    subject: 'Email confirmation',
    text: `Please confirm your email: ${confirmURL}`,
  });

  return newUser;
};

export const confirmUserEmail = async (token: string) => {
  const user = await User.findOne({
    where: { email_verification_token: token },
  });

  if (!user) {
    throw new AppError('Invalid or expired email confirmation token.', 400);
  }

  const now = new Date();
  if (now > user.email_verification_expires_at) {
    await User.destroy({ where: { id: user.id } });
    throw new AppError(
      'User has been deleted due to expired email confirmation token.',
      400,
    );
  }

  user.email_verified = true;
  user.email_verification_token = null;
  await user.save();
};

export const loginUser = async (
  login: string,
  email: string,
  password: string,
) => {
  const user = await User.findOne({ where: { login, email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Incorrect credentials', 401);
  }

  if (!user.email_verified) {
    throw new AppError('Please verify your email before logging in.', 403);
  }

  const token = signToken(user.id);

  const {
    password: _,
    email_verification_token,
    email_verification_expires_at,
    ...userWithoutSensitiveInfo
  } = user.get({ plain: true });

  return { token, user: userWithoutSensitiveInfo };
};

export const sendPasswordResetEmail = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('User with this email not found.', 404);
  }

  if (!user.email_verified) {
    throw new AppError(
      'Please verify your email before requesting a password reset.',
      403,
    );
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000);
  await PasswordReset.create({
    email: user.email,
    token,
    user_id: user.id,
    expires_at: expiresAt,
  } as PasswordReset);

  const resetURL = `${process.env.FRONTEND_URL}/password-reset/${token}`;
  const message = `To reset your password, please follow the link below: ${resetURL}`;

  await sendEmail({
    to: email,
    subject: 'Reset password',
    text: message,
  });
};

export const resetUserPassword = async (
  confirmToken: string,
  newPassword: string,
  confirmPassword: string,
) => {
  if (newPassword !== confirmPassword) {
    throw new AppError('Passwords do not match.', 400);
  }

  const passwordReset = await PasswordReset.findOne({
    where: { token: confirmToken },
  });
  if (!passwordReset) {
    throw new AppError('Invalid password reset token.', 400);
  }

  const now = new Date();
  if (!passwordReset.expires_at || now > passwordReset.expires_at) {
    throw new AppError('Password reset token has expired.', 400);
  }

  const user = await User.findByPk(passwordReset.user_id);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  await passwordReset.destroy();
};
