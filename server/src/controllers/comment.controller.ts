import { Request, Response } from 'express';
import { Comment } from '../../database/models/Comment';
import { User } from '../../database/models/User';
import { Like } from '../../database/models/Like';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

interface CustomRequest extends Request {
  user?: {
    id: number;
  };
}

export const getCommentById = catchAsync(
  async (req: Request, res: Response) => {
    const commentId = parseInt(req.params.comment_id, 10);

    const comment = await Comment.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    const likeCount = await Like.count({
      where: { comment_id: commentId, type: 'like' },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        comment,
        likeCount,
      },
    });
  },
);

export const updateComment = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const commentId = parseInt(req.params.comment_id, 10);
    const { content, status } = req.body;

    const comment = await Comment.findOne({
      where: { id: commentId },
      include: [{ model: User, attributes: ['id'] }],
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    const userId = req.user?.id;
    if (comment.author_id !== userId) {
      throw new AppError('You are not authorized to update this comment', 403);
    }

    if (content) {
      comment.content = content;
    }

    if (status) {
      if (status === 'inactive' && comment.status === 'active') {
        await Like.destroy({
          where: { comment_id: commentId },
        });
      }
      comment.status = status;
    }

    await comment.save();

    const responseComment = {
      id: comment.id,
      author_id: comment.author_id,
      post_id: comment.post_id,
      content: comment.content,
      publish_date: comment.publish_date,
      status: comment.status,
    };

    return res.status(200).json({
      status: 'success',
      data: {
        responseComment,
      },
    });
  },
);

export const deleteComment = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const commentId = parseInt(req.params.comment_id, 10);

    const comment = await Comment.findOne({
      where: { id: commentId },
      include: [{ model: User, attributes: ['id'] }],
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    const userId = req.user?.id;
    if (comment.author_id !== userId) {
      throw new AppError('You are not authorized to delete this comment', 403);
    }

    await Like.destroy({
      where: { comment_id: commentId },
    });

    await comment.destroy();

    return res.status(204).json({
      status: 'success',
      message: 'Comment and associated likes deleted successfully',
    });
  },
);

export const deleteCommentByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const commentId = parseInt(req.params.comment_id, 10);

    const comment = await Comment.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    await Like.destroy({
      where: { comment_id: commentId },
    });

    await comment.destroy();

    return res.status(204).json({
      status: 'success',
      message: 'Comment deleted successfully by admin',
    });
  },
);

export const getLikesForComment = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const commentId = parseInt(req.params.comment_id, 10);

    const comment = await Comment.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    const likes = await Like.findAll({
      where: { comment_id: commentId },
      include: [{ model: User, attributes: ['id', 'login', 'full_name'] }],
    });

    return res.status(200).json({
      status: 'success',
      data: {
        likes,
      },
    });
  },
);

export const addLikeToComment = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const commentId = parseInt(req.params.comment_id, 10);
    const userId = req.user?.id;

    const comment = await Comment.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.status === 'inactive') {
      throw new AppError('Cannot like an inactive comment', 403);
    }

    if (comment.author_id === userId) {
      throw new AppError('You cannot like your own comment', 403);
    }

    const existingLike = await Like.findOne({
      where: {
        comment_id: commentId,
        author_id: userId,
      },
    });

    if (existingLike) {
      throw new AppError('You have already liked this comment', 400);
    }

    const like = await Like.create({
      comment_id: commentId,
      author_id: userId ?? 0,
      post_id: comment.post_id,
      type: 'like',
    });

    return res.status(201).json({
      status: 'success',
      data: {
        like,
      },
    });
  },
);

export const deleteLikeFromComment = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const commentId = parseInt(req.params.comment_id, 10);
    const userId = req.user?.id;

    const comment = await Comment.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    const like = await Like.findOne({
      where: {
        comment_id: commentId,
        author_id: userId,
      },
    });

    if (!like) {
      throw new AppError('Like not found', 404);
    }

    await like.destroy();

    return res.status(204).json({
      status: 'success',
      message: 'Like removed successfully',
    });
  },
);
