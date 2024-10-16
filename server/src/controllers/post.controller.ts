import { Request, Response, NextFunction } from 'express';
import { Post } from '../../database/models/Post';
import { Category } from '../../database/models/Category';
import { User } from '../../database/models/User';
import { PostCategory } from '../../database/models/PostCategory';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

export const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'full_name', 'profile_picture', 'rating'],
        },
        {
          model: PostCategory,
          include: [
            {
              model: Category,
              attributes: ['id', 'title', 'description'],
            },
          ],
        },
      ],
    });

    const formattedPosts = posts.map(
      ({
        id,
        title,
        content,
        publish_date,
        status,
        author,
        postCategories = [],
      }) => ({
        id,
        title,
        content,
        publish_date,
        status,
        author,
        categories: postCategories.map(({ category }) => ({
          id: category?.id || 0,
          title: category?.title || '',
          description: category?.description || '',
        })),
      }),
    );

    res.status(200).json({
      status: 'success',
      data: {
        posts: formattedPosts,
      },
    });
  },
);

export const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { post_id } = req.params;

    const post = await Post.findOne({
      where: { id: post_id },
      include: [
        {
          model: User,
          attributes: ['id', 'full_name', 'profile_picture', 'rating'],
        },
        {
          model: PostCategory,
          include: [
            {
              model: Category,
              attributes: ['id', 'title', 'description'],
            },
          ],
        },
      ],
    });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    const formattedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      publish_date: post.publish_date,
      status: post.status,
      author: post.author,
      categories: post.postCategories?.map(({ category }) => ({
        id: category?.id || 0,
        title: category?.title || '',
        description: category?.description || '',
      })),
    };

    res.status(200).json({
      status: 'success',
      data: {
        post: formattedPost,
      },
    });
  },
);

interface CustomRequest extends Request {
  user?: {
    id: number;
  };
}

export const createPost = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { title, content, categories } = req.body;

    if (!title || !content || !categories || !Array.isArray(categories)) {
      return next(
        new AppError('Title, content, and categories are required.', 400),
      );
    }

    const existingCategories = await Category.findAll({
      where: { id: categories },
    });

    if (existingCategories.length !== categories.length) {
      return next(new AppError('One or more categories are invalid.', 400));
    }

    const newPost = await Post.create({
      title,
      content,
      author_id: req.user?.id ?? 0,
      status: 'active',
      publish_date: new Date(),
    });

    const postCategories = categories.map((categoryId: number) => ({
      post_id: newPost.id,
      category_id: categoryId,
    }));

    await PostCategory.bulkCreate(postCategories);

    const filteredCategories = existingCategories.map(
      ({ id, title, description }) => ({
        id,
        title,
        description,
      }),
    );

    res.status(201).json({
      status: 'success',
      data: {
        post: newPost,
        categories: filteredCategories,
      },
    });
  },
);

export const updatePost = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { post_id } = req.params;
    const { title, content, categories } = req.body;

    const post = await Post.findOne({ where: { id: post_id } });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    if (post.author_id !== req.user?.id) {
      return next(
        new AppError('You are not authorized to update this post', 403),
      );
    }

    if (title) post.title = title;
    if (content) post.content = content;

    if (categories && Array.isArray(categories)) {
      const existingCategories = await Category.findAll({
        where: { id: categories },
      });
      if (existingCategories.length !== categories.length) {
        return next(new AppError('One or more categories are invalid.', 400));
      }

      await PostCategory.destroy({ where: { post_id: post.id } });
      const postCategories = categories.map((categoryId: number) => ({
        post_id: post.id,
        category_id: categoryId,
      }));
      await PostCategory.bulkCreate(postCategories);
    }

    await post.save();

    const updatedPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: User,
          attributes: ['id', 'full_name', 'profile_picture', 'rating'],
        },
        {
          model: PostCategory,
          include: [
            {
              model: Category,
              attributes: ['id', 'title', 'description'],
            },
          ],
        },
      ],
    });

    const formattedPost = {
      id: updatedPost?.id,
      title: updatedPost?.title,
      content: updatedPost?.content,
      author_id: updatedPost?.author_id,
      status: updatedPost?.status,
      publish_date: updatedPost?.publish_date,
      categories:
        updatedPost?.postCategories?.map(({ category }) => ({
          id: category?.id || 0,
          title: category?.title || '',
          description: category?.description || '',
        })) || [],
    };

    res.status(200).json({
      status: 'success',
      data: {
        post: formattedPost,
      },
    });
  },
);

export const deletePost = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { post_id } = req.params;

    const post = await Post.findOne({ where: { id: post_id } });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    if (post.author_id !== req.user?.id) {
      return next(
        new AppError('You are not authorized to delete this post', 403),
      );
    }

    await PostCategory.destroy({ where: { post_id: post.id } });

    await post.destroy();

    res.status(204).json({
      status: 'success',
      message: 'Post deleted successfully',
    });
  },
);
