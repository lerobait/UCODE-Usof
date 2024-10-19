import { Comment } from '../../database/models/Comment';
import { User } from '../../database/models/User';
import { Like } from '../../database/models/Like';
import AppError from '../utils/appError';

export const findCommentById = async (commentId: number) => {
  const comment = await Comment.findOne({
    where: { id: commentId },
  });
  if (!comment) {
    throw new AppError('Comment not found', 404);
  }
  return comment;
};

export const countLikes = async (commentId: number) => {
  return await Like.count({
    where: { comment_id: commentId, type: 'like' },
  });
};

export const updateComment = async (
  commentId: number,
  content: string | undefined,
  status: string | undefined,
  userId: number,
) => {
  const comment = await Comment.findOne({
    where: { id: commentId },
    include: [{ model: User, attributes: ['id'] }],
  });

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

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
    if (status === 'active' || status === 'inactive') {
      comment.status = status;
    } else {
      throw new AppError('Invalid status value', 400);
    }
  }

  await comment.save();
  return comment;
};

export const deleteComment = async (commentId: number, userId: number) => {
  const comment = await Comment.findOne({
    where: { id: commentId },
    include: [{ model: User, attributes: ['id'] }],
  });

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  if (comment.author_id !== userId) {
    throw new AppError('You are not authorized to delete this comment', 403);
  }

  await Like.destroy({
    where: { comment_id: commentId },
  });

  await comment.destroy();
};

export const deleteCommentByAdmin = async (commentId: number) => {
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
};

export const getLikesForComment = async (commentId: number) => {
  const likes = await Like.findAll({
    where: { comment_id: commentId },
    include: [{ model: User, attributes: ['id', 'login', 'full_name'] }],
  });

  return likes;
};

export const addLikeToComment = async (commentId: number, userId: number) => {
  const comment = await findCommentById(commentId);

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
    author_id: userId,
    post_id: comment.post_id,
    type: 'like',
  });

  return like;
};

export const deleteLikeFromComment = async (
  commentId: number,
  userId: number,
) => {
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
};