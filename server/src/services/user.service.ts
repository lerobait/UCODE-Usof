import { User } from '../../database/models/User';
import bcrypt from 'bcrypt';
import AppError from '../utils/appError';

export class UserService {
  async getMe(userId: number) {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: [
          'password',
          'email_verification_token',
          'email_verification_expires_at',
        ],
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateMyPassword(
    user: User,
    currentPassword: string,
    newPassword: string,
  ) {
    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordCorrect) {
      throw new AppError('Current password is incorrect', 401);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    return user;
  }

  async updateAvatar(userId: number, avatarUrl: string) {
    console.log(`Updating avatar for user ${userId}: ${avatarUrl}`);
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: [
          'password',
          'email_verification_token',
          'email_verification_expires_at',
        ],
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.profile_picture = avatarUrl;
    await user.save();

    return user;
  }

  async updateMe(userId: number, login?: string, fullName?: string) {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: [
          'password',
          'email_verification_token',
          'email_verification_expires_at',
        ],
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (login) {
      const existingUser = await User.findOne({ where: { login } });
      if (existingUser && existingUser.id !== user.id) {
        throw new AppError('Login already in use', 400);
      }
      user.login = login;
    }

    if (fullName) {
      user.full_name = fullName;
    }

    await user.save();
    return user;
  }

  async deleteMe(userId: number) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await user.destroy();
  }

  async getAllUsers() {
    return await User.findAll({
      attributes: {
        exclude: [
          'full_name',
          'email',
          'role',
          'password',
          'email_verification_token',
          'email_verification_expires_at',
          'email_verified',
          'created_at',
        ],
      },
    });
  }

  async getUserById(userId: number) {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: [
          'password',
          'email_verification_token',
          'email_verification_expires_at',
        ],
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async createUser(
    login: string,
    password: string,
    email: string,
    role: 'user' | 'admin',
  ) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
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
      passwordResets: [],
      email_verified: true,
    });

    return newUser;
  }

  async updateUser(userId: number, role: 'user' | 'admin') {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: [
          'password',
          'email_verification_token',
          'email_verification_expires_at',
        ],
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.role = role;
    await user.save();

    return user;
  }

  async deleteUser(userId: number) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await user.destroy();
  }
}

export default new UserService();
