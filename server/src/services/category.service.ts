import { Category } from '../../database/models/Category';
import { Post } from '../../database/models/Post';
import { User } from '../../database/models/User';
import { Comment } from '../../database/models/Comment';
import { Like } from '../../database/models/Like';
import AppError from '../utils/appError';

export const getAllCategories = async () => {
  return await Category.findAll();
};

export const getCategoryById = async (categoryId: number) => {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  return category;
};

export const formatPost = (post: Post) => ({
  id: post.id,
  title: post.title,
  content: post.content,
  publish_date: post.publish_date,
  status: post.status,
  author: post.author
    ? {
        id: post.author.id,
        full_name: post.author.full_name,
        profile_picture: post.author.profile_picture,
        rating: post.author.rating,
      }
    : null,
  image_url: post.image_url,
  categories: post.postCategories?.map(({ category }) => ({
    id: category?.id || 0,
    title: category?.title || '',
    description: category?.description || '',
  })),
});

export const getPostsByCategoryId = async (categoryId: number) => {
  const category = await Category.findByPk(categoryId, {
    include: [
      {
        model: Post,
        include: [
          {
            model: User,
            attributes: ['id', 'login', 'profile_picture'],
          },
          {
            model: Comment,
            attributes: [],
          },
          {
            model: Like,
            attributes: [],
          },
        ],
      },
    ],
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  const formattedPosts = await Promise.all(
    (category.posts ?? []).map(async (post) => {
      const likesCount = await post.$get('likes');
      const commentsCount = await post.$get('comments');

      return {
        id: post.id,
        author: {
          id: post.author?.id,
          login: post.author?.login,
          profile_picture: post.author?.profile_picture,
        },
        status: post.status,
        publish_date: post.publish_date,
        title: post.title,
        content: post.content,
        image_url: post.image_url,
        likes_count: likesCount.length,
        comments_count: commentsCount.length,
      };
    }),
  );

  return formattedPosts;
};

export const createCategory = async (title: string, description?: string) => {
  if (!title) {
    throw new AppError('Title is required', 400);
  }

  const existingCategory = await Category.findOne({ where: { title } });
  if (existingCategory) {
    throw new AppError('Category with this title already exists', 400);
  }

  return await Category.create({ title, description: description ?? '' });
};

export const updateCategory = async (
  categoryId: number,
  title?: string,
  description?: string,
) => {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  if (title) {
    const existingCategory = await Category.findOne({ where: { title } });
    if (existingCategory && existingCategory.id !== categoryId) {
      throw new AppError('Category with this title already exists', 400);
    }
    category.title = title;
  }

  if (description) {
    category.description = description;
  }

  await category.save();
  return category;
};

export const deleteCategory = async (categoryId: number) => {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  await category.destroy();
};
