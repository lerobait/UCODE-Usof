import { Request, Response } from 'express';
import * as CommentService from '../services/comment.service';
import catchAsync from '../utils/catchAsync';

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

    const like = await CommentService.addLikeToComment(commentId, userId);

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
