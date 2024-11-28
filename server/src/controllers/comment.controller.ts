import { Request, Response, NextFunction } from 'express';
import * as CommentService from '../services/comment.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { getStringQueryParam } from '../utils/filters';

interface CustomRequest extends Request {
  user?: {
    id: number;
  };
}

export const getCommentById = catchAsync(
  async (req: Request, res: Response) => {
    const commentId = parseInt(req.params.comment_id, 10);
    const comment = await CommentService.findCommentById(commentId);
    const likeCount = await CommentService.countLikes(commentId);

    return res.status(200).json({
      status: 'success',
      data: {
        comment,
        likeCount,
      },
    });
  },
);

export const getAllReplies = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { parent_id } = req.params;
    const status = getStringQueryParam(req.query.status);
    const sortBy = getStringQueryParam(req.query.sortBy) || 'likes';
    const order = getStringQueryParam(req.query.order) || 'DESC';

    const { replies } = await CommentService.getAllRepliesService(
      parseInt(parent_id, 10),
      status as 'active' | 'inactive',
      sortBy as 'likes' | 'date',
      order as 'ASC' | 'DESC',
    );

    res.status(200).json({
      status: 'success',
      data: {
        replies,
      },
    });
  },
);

export const createReply = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { parent_id, post_id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!content) {
      return next(new AppError('Content is required', 400));
    }

    const reply = await CommentService.createReplyService(
      parseInt(parent_id, 10),
      parseInt(post_id, 10),
      content,
      userId,
    );

    res.status(201).json({
      status: 'success',
      data: {
        reply,
      },
    });
  },
);

export const updateComment = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const commentId = parseInt(req.params.comment_id, 10);
    const { content, status } = req.body;
    const userId = req.user?.id ?? 0;

    const updatedComment = await CommentService.updateComment(
      commentId,
      content,
      status,
      userId,
    );

    return res.status(200).json({
      status: 'success',
      data: {
        comment: updatedComment,
      },
    });
  },
);

export const deleteComment = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const commentId = parseInt(req.params.comment_id, 10);
    const userId = req.user?.id ?? 0;

    await CommentService.deleteComment(commentId, userId);

    return res.status(204).json({
      status: 'success',
      message: 'Comment and associated likes deleted successfully',
    });
  },
);

export const deleteCommentByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const commentId = parseInt(req.params.comment_id, 10);

    await CommentService.deleteCommentByAdmin(commentId);

    return res.status(204).json({
      status: 'success',
      message: 'Comment deleted successfully by admin',
    });
  },
);

export const getLikesForComment = catchAsync(
  async (req: Request, res: Response) => {
    const commentId = parseInt(req.params.comment_id, 10);

    const likes = await CommentService.getLikesForComment(commentId);

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
    const userId = req.user?.id ?? 0;
    const { type } = req.body;

    if (type !== 'like' && type !== 'dislike') {
      throw new AppError('Invalid like type', 400);
    }

    const like = await CommentService.toggleLikeForComment(
      commentId,
      userId,
      type,
    );

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
    const userId = req.user?.id ?? 0;

    await CommentService.deleteLikeFromComment(commentId, userId);

    return res.status(204).json({
      status: 'success',
      message: 'Like removed successfully',
    });
  },
);
