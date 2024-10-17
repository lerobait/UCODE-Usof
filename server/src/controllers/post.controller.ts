import { Request, Response, NextFunction } from 'express';
import {
  createPostService,
  getAllPostsService,
  getPostByIdService,
  getMyPostsService,
  updatePostService,
  deletePostService,
} from '../services/post.service';
import uploadImage from '../utils/upload';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

interface CustomRequest extends Request {
  user?: {
    id: number;
  };
}

export const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await getAllPostsService();
    res.status(200).json({
      status: 'success',
      data: {
        posts,
      },
    });
  },
);

export const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { post_id } = req.params;
    const post = await getPostByIdService(post_id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        post,
      },
    });
  },
);

export const getMyPosts = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const posts = await getMyPostsService(userId);
    res.status(200).json({
      status: 'success',
      data: {
        posts,
      },
    });
  },
);

export const createPost = [
  uploadImage.single('image'),
  catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { title, content, categories } = req.body;
    const userId = req.user?.id;
    const imageUrl = req.file?.location;

    const newPost = await createPostService(
      title,
      content,
      categories,
      userId,
      imageUrl,
    );
    res.status(201).json({
      status: 'success',
      data: {
        post: newPost.post,
        categories: newPost.categories,
      },
    });
  }),
];

export const updatePost = [
  uploadImage.single('image'),
  catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { post_id } = req.params;
    const { title, content, categories } = req.body;
    const userId = req.user?.id;
    const imageUrl = req.file?.location;

    const updatedPost = await updatePostService(
      post_id,
      title,
      content,
      categories,
      userId,
      imageUrl,
    );
    if (!updatedPost) {
      return next(new AppError('Post not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        post: updatedPost,
      },
    });
  }),
];

export const deletePost = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { post_id } = req.params;
    const userId = req.user?.id;

    const result = await deletePostService(post_id, userId);
    if (!result) {
      return next(
        new AppError(
          'Post not found or not authorized to delete this post',
          403,
        ),
      );
    }

    res.status(204).json({
      status: 'success',
      message: 'Post deleted successfully',
    });
  },
);
