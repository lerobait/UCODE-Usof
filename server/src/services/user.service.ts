import { User } from '../../database/models/User';
import bcrypt from 'bcrypt';
import AppError from '../utils/appError';
import { Post } from '../../database/models/Post';
import { Like } from '../../database/models/Like';
import { Comment } from '../../database/models/Comment';
import { applyFilters } from '../utils/filters';
import { PostCategory } from '../../database/models/PostCategory';
import { Op } from 'sequelize';

interface Filters {
  status?: 'active' | 'inactive';
  sortBy?: 'likes' | 'date';
  order?: 'ASC' | 'DESC';
}

export class UserService {
  async getMe(userId: number) {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: [
          'password',
          'role',
          'created_at',
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
    const user = await User.findByPk(userId, {
      include: [Post, Comment, Like],
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await Like.destroy({
      where: {
        comment_id: {
          [Op.in]: user.comments.map((comment) => comment.id),
        },
      },
    });

    await Comment.destroy({ where: { author_id: userId } });

    await Like.destroy({
      where: { post_id: { [Op.in]: user.posts.map((post) => post.id) } },
    });

    await PostCategory.destroy({
      where: { post_id: { [Op.in]: user.posts.map((post) => post.id) } },
    });

    await Post.destroy({ where: { author_id: userId } });

    await Like.destroy({ where: { author_id: userId } });

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

  async getUserById(userId: number, filters: Filters) {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: [
          'password',
          'email_verification_token',
          'email_verification_expires_at',
        ],
      },
      include: [
        {
          model: Post,
          as: 'posts',
          attributes: [
            'id',
            'status',
            'publish_date',
            'title',
            'content',
            'image_url',
          ],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'login', 'full_name', 'profile_picture'],
            },
            {
              model: Like,
              attributes: [],
            },
            {
              model: Comment,
              attributes: [],
            },
          ],
        },
      ],
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { whereClause, orderClause } = applyFilters(filters);

    const postsWithCounts = await Post.findAll({
      where: whereClause,
      order: orderClause,
      group: ['Post.id'],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'login', 'full_name', 'profile_picture'],
        },
        {
          model: Like,
          attributes: [],
        },
        {
          model: Comment,
          attributes: [],
        },
      ],
    });

    const postsWithDetailedCounts = await Promise.all(
      postsWithCounts.map(async (post) => {
        const likesCount = await Like.count({
          where: { post_id: post.id, type: 'like' },
        });

        const commentsCount = await Comment.count({
          where: { post_id: post.id },
        });

        return {
          ...post.toJSON(),
          likes_count: likesCount,
          comments_count: commentsCount,
        };
      }),
    );

    return {
      ...user.toJSON(),
      posts: postsWithDetailedCounts,
    };
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
    const user = await User.findByPk(userId, {
      include: [Post, Comment, Like],
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await Like.destroy({
      where: {
        comment_id: {
          [Op.in]: user.comments.map((comment) => comment.id),
        },
      },
    });

    await Comment.destroy({ where: { author_id: userId } });

    await Like.destroy({
      where: { post_id: { [Op.in]: user.posts.map((post) => post.id) } },
    });

    await PostCategory.destroy({
      where: { post_id: { [Op.in]: user.posts.map((post) => post.id) } },
    });

    await Post.destroy({ where: { author_id: userId } });

    await Like.destroy({ where: { author_id: userId } });

    await user.destroy();
  }

  async getUserByIdAdmin(userId: number) {
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
}

export default new UserService();
