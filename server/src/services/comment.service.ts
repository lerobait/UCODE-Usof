import { Comment } from '../../database/models/Comment';
import { User } from '../../database/models/User';
import { Like } from '../../database/models/Like';
import { updateUserRating } from '../utils/rating';
import sequelize from '../../database/db';
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

export const getAllRepliesService = async (
  parentId: number,
  status?: 'active' | 'inactive',
  sortBy: 'likes' | 'date' = 'likes',
  order: 'ASC' | 'DESC' = 'DESC',
) => {
  const parentComment = await Comment.findByPk(parentId);

  if (!parentComment) {
    throw new AppError('Parent comment not found', 404);
  }

  const whereClause: { [key: string]: string | number | undefined } = {
    parent_id: parentId,
  };

  if (status) {
    whereClause.status = status;
  }

  const replies = await Comment.findAll({
    where: whereClause,
    include: [
      {
        model: User,
        attributes: ['id'],
        as: 'author',
      },
    ],
    attributes: {
      include: [
        [
          sequelize.literal(
            `(SELECT COUNT(*)
              FROM likes AS l
              WHERE l.comment_id = Comment.id AND l.type = 'like')`,
          ),
          'likes_count',
        ],
        [
          sequelize.literal(
            `(SELECT COUNT(*)
              FROM comments AS c
              WHERE c.parent_id = Comment.id)`,
          ),
          'replies_count',
        ],
      ],
    },
    order:
      sortBy === 'likes'
        ? [[sequelize.literal('likes_count'), order]]
        : [['publish_date', order]],
  });

  return {
    replies: replies.map((reply) => ({
      id: reply.id,
      content: reply.content,
      publish_date: reply.publish_date,
      status: reply.status,
      author_id: reply.author?.id,
      likes_count: reply.getDataValue('likes_count'),
      replies_count: reply.getDataValue('replies_count'),
    })),
  };
};

export const createReplyService = async (
  parentId: number,
  postId: number,
  content: string,
  userId: number,
) => {
  const parentComment = await Comment.findByPk(parentId);
  if (!parentComment) {
    throw new AppError('Parent comment not found', 404);
  }

  if (parentComment.status === 'inactive') {
    throw new AppError('Cannot reply to an inactive comment', 403);
  }

  const reply = await Comment.create({
    post_id: postId,
    parent_id: parentId,
    content,
    author_id: userId,
    status: 'active',
  });

  return {
    id: reply.id,
    content: reply.content,
    post_id: reply.post_id,
    parent_id: reply.parent_id,
    author_id: reply.author_id,
    status: reply.status,
  };
};

export const updateComment = async (
  commentId: number,
  content: string | undefined,
  status: string | undefined,
  userId: number,
) => {
  const comment = await Comment.findOne({
    where: { id: commentId },
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

export const toggleLikeForComment = async (
  commentId: number,
  userId: number,
  type: 'like' | 'dislike',
) => {
  const comment = await findCommentById(commentId);

  if (comment.status === 'inactive') {
    throw new AppError('Cannot like or dislike an inactive comment', 403);
  }

  if (comment.author_id === userId) {
    throw new AppError('You cannot like or dislike your own comment', 403);
  }

  const existingLike = await Like.findOne({
    where: {
      comment_id: commentId,
      author_id: userId,
    },
  });

  if (existingLike) {
    if (existingLike.type === type) {
      throw new AppError(`You have already ${type}d this comment`, 400);
    } else {
      existingLike.type = type;
      await existingLike.save();

      await updateUserRating(comment.author_id);

      return existingLike;
    }
  }

  const like = await Like.create({
    comment_id: commentId,
    author_id: userId,
    post_id: comment.post_id,
    type,
  });

  await updateUserRating(comment.author_id);

  return like;
};

export const deleteLikeFromComment = async (
  commentId: number,
  userId: number,
) => {
  const comment = await findCommentById(commentId);

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

  await updateUserRating(comment.author_id);
};
