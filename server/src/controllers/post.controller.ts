import { Request, Response, NextFunction } from 'express';
import {
  createPostService,
  getAllPostsService,
  getPostByIdService,
  getMyPostsService,
  updatePostService,
  deletePostService,
  createCommentService,
  getCommentsForPostService,
  getCategoriesForPostService,
  toggleLikeForPostService,
  deleteLikeFromPostService,
  getLikesForPostService,
  addPostToFavoritesService,
  getMyFavoritePostsService,
  removePostFromFavoritesService,
} from '../services/post.service';
import uploadImage from '../utils/upload';
import { User } from '../../database/models/User';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { getStringQueryParam } from '../utils/filters';

interface CustomRequest extends Request {
  user?: {
    id: number;
  };
}

export const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const status = getStringQueryParam(req.query.status);
    const sortBy = getStringQueryParam(req.query.sortBy) || 'likes';
    const order = getStringQueryParam(req.query.order) || 'DESC';
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = (page - 1) * limit;

    const { posts, totalItems } = await getAllPostsService(
      status as 'active' | 'inactive',
      sortBy as 'likes' | 'date',
      order as 'ASC' | 'DESC',
      limit,
      offset,
    );

    res.status(200).json({
      status: 'success',
      data: {
        posts,
        totalItems,
        totalPages: Math.ceil(Number(totalItems) / Number(limit)),
        currentPage: page,
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

export const getUserPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userLogin = req.params.login;

    if (!userLogin) {
      return next(new AppError('User login is required', 400));
    }

    const user = await User.findOne({
      where: { login: userLogin },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const userId = user.id;

    const status = getStringQueryParam(req.query.status);
    const sortBy = getStringQueryParam(req.query.sortBy) || 'date';
    const order = getStringQueryParam(req.query.order) || 'DESC';

    const posts = await getMyPostsService(
      userId,
      status as 'active' | 'inactive',
      sortBy as 'likes' | 'date',
      order as 'ASC' | 'DESC',
    );

    res.status(200).json({
      status: 'success',
      data: {
        posts,
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

    const status = getStringQueryParam(req.query.status);
    const sortBy = getStringQueryParam(req.query.sortBy) || 'date';
    const order = getStringQueryParam(req.query.order) || 'DESC';

    const posts = await getMyPostsService(
      userId,
      status as 'active' | 'inactive',
      sortBy as 'likes' | 'date',
      order as 'ASC' | 'DESC',
    );

    res.status(200).json({
      status: 'success',
      data: {
        posts,
      },
    });
  },
);

export const getCategoriesForPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { post_id } = req.params;
    const categories = await getCategoriesForPostService(post_id);

    if (!categories) {
      return next(new AppError('No categories found for this post', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        categories,
      },
    });
  },
);

export const getCommentsForPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { post_id } = req.params;

    const status = getStringQueryParam(req.query.status);
    const sortBy = getStringQueryParam(req.query.sortBy) || 'likes';
    const order = getStringQueryParam(req.query.order) || 'DESC';
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = (page - 1) * limit;

    const { comments, totalItems } = await getCommentsForPostService(
      post_id,
      status as 'active' | 'inactive',
      sortBy as 'likes' | 'date',
      order as 'ASC' | 'DESC',
      limit,
      offset,
    );

    if (!comments || comments.length === 0) {
      return next(new AppError('No comments found for this post', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        comments,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
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
    const { title, content, categories, status } = req.body;
    const userId = req.user?.id;
    const imageUrl = req.file?.location ?? null;

    const updatedPost = await updatePostService(
      post_id,
      title,
      content,
      categories,
      status,
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

export const getMyFavoritePosts = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const status = getStringQueryParam(req.query.status);
    const sortBy = getStringQueryParam(req.query.sortBy) || 'date';
    const order = getStringQueryParam(req.query.order) || 'DESC';

    const favoritePosts = await getMyFavoritePostsService(
      userId,
      status as 'active' | 'inactive',
      sortBy as 'likes' | 'date',
      order as 'ASC' | 'DESC',
    );
    res.status(200).json({
      status: 'success',
      data: {
        posts: favoritePosts,
      },
    });
  },
);

export const addPostToFavorites = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { post_id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const favorite = await addPostToFavoritesService(Number(post_id), userId);

    res.status(201).json({
      status: 'success',
      data: {
        favorite,
      },
    });
  },
);

export const removePostFromFavorites = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { post_id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    await removePostFromFavoritesService(Number(post_id), userId);

    res.status(204).send();
  },
);

export const getLikesForPost = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { post_id } = req.params;

    const likes = await getLikesForPostService(Number(post_id));

    res.status(200).json({
      status: 'success',
      results: likes.length,
      data: {
        likes,
      },
    });
  },
);

export const addlikeToPost = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { post_id } = req.params;
    const { type } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const like = await toggleLikeForPostService(Number(post_id), userId, type);

    res.status(201).json({
      status: 'success',
      data: {
        like,
      },
    });
  },
);

export const deleteLikeFromPost = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const postId = parseInt(req.params.post_id, 10);
    const userId = req.user?.id ?? 0;

    await deleteLikeFromPostService(postId, userId);

    return res.status(204).json({
      status: 'success',
      message: 'Like deleted successfully',
    });
  },
);

export const createComment = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { post_id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!content) {
      return next(new AppError('Content is required', 400));
    }

    const comment = await createCommentService(post_id, content, userId);

    res.status(201).json({
      status: 'success',
      data: {
        comment,
      },
    });
  },
);
