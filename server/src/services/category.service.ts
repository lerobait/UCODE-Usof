import { Category } from '../../database/models/Category';
import { Post } from '../../database/models/Post';
import AppError from '../utils/appError';
import { QueryTypes } from 'sequelize';
import sequelize from '../../database/db';

interface PostWithCounts {
  id: number;
  title: string;
  content: string;
  publish_date: Date;
  status: 'active' | 'inactive';
  image_url?: string;
  author_id: number;
  author_login: string;
  author_profile_picture?: string;
  likes_count: number;
  comments_count: number;
}

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

export const getPostsByCategoryId = async (
  categoryId: number,
  status?: 'active' | 'inactive',
  sortBy?: 'likes' | 'date',
  order?: 'ASC' | 'DESC',
) => {
  const whereClause = status ? `AND p.status = :status` : '';
  const orderClause =
    sortBy === 'likes' ? 'ORDER BY likes_count' : 'ORDER BY p.publish_date';
  const direction = order ? order : 'DESC';

  const query = `
    SELECT 
      p.id, 
      p.title, 
      p.content, 
      p.publish_date, 
      p.status, 
      p.image_url, 
      u.id AS author_id, 
      (SELECT COUNT(*) FROM comments WHERE comments.post_id = p.id) AS comments_count,
      (SELECT COUNT(*) FROM likes WHERE likes.post_id = p.id AND likes.type = 'like') AS likes_count
    FROM post_categories pc
    JOIN posts p ON pc.post_id = p.id
    JOIN users u ON p.author_id = u.id
    WHERE pc.category_id = :categoryId
    ${whereClause}
    GROUP BY p.id, u.id
    ${orderClause} ${direction};
  `;

  const posts = await sequelize.query<PostWithCounts>(query, {
    replacements: { categoryId, status },
    type: QueryTypes.SELECT,
  });

  if (!posts.length) {
    throw new AppError('Category not found or no posts available', 404);
  }

  return posts.map((post: PostWithCounts) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    publish_date: post.publish_date,
    status: post.status,
    image_url: post.image_url,
    author_id: post.author_id,
    likes_count: post.likes_count,
    comments_count: post.comments_count,
  }));
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
