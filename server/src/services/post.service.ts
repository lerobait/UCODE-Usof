import { Post } from '../../database/models/Post';
import { Category } from '../../database/models/Category';
import { PostCategory } from '../../database/models/PostCategory';
import { User } from '../../database/models/User';
import { Comment } from '../../database/models/Comment';
import { Like } from '../../database/models/Like';
import { Favorite } from '../../database/models/Favorite';
import AppError from '../utils/appError';
import { Op, QueryTypes } from 'sequelize';
import { Transaction } from 'sequelize';
import { applyFilters } from '../utils/filters';
import { updateUserRating } from '../utils/rating';
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

export const getAllPostsService = async (
  status?: 'active' | 'inactive',
  sortBy?: 'likes' | 'date',
  order?: 'ASC' | 'DESC',
  limit: number = 0,
  offset: number = 0,
) => {
  const { whereClause, orderClause } = applyFilters({
    status,
    sortBy,
    order,
  }) as {
    whereClause: { [key: string]: unknown };
    orderClause: [string, string][];
  };

  const allPostIds = await Post.findAll({
    where: whereClause,
    attributes: ['id'],
    order: sequelize.literal(
      `(SELECT COUNT(*) FROM likes WHERE likes.post_id = Post.id AND likes.type = 'like' AND likes.comment_id IS NULL) DESC`,
    ),
    raw: true,
  }).then((posts) => posts.map((post) => post.id));

  const paginatedPostIds = allPostIds.slice(offset, offset + limit);

  const posts = await Post.findAll({
    where: {
      id: {
        [Op.in]: paginatedPostIds,
      },
    },
    include: [
      {
        model: User,
        attributes: ['id'],
      },
    ],
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM comments AS c
            WHERE c.post_id = Post.id
          )`),
          'comments_count',
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM likes AS l
            WHERE l.post_id = Post.id AND l.type = 'like' AND l.comment_id IS NULL
          )`),
          'likes_count',
        ],
      ],
    },
    order: orderClause,
  });

  return {
    posts: posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      publish_date: post.publish_date,
      status: post.status,
      image_url: post.image_url,
      author_id: post.author_id,
      likes_count: post.getDataValue('likes_count'),
      comments_count: post.getDataValue('comments_count'),
    })),
    totalItems: allPostIds.length,
  };
};

export const getPostByIdService = async (postId: string) => {
  const post = await Post.findOne({
    where: { id: postId },
    include: [
      {
        model: User,
        attributes: ['id'],
      },
    ],
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM comments AS c
            WHERE c.post_id = Post.id
          )`),
          'comments_count',
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM likes AS l
            WHERE l.post_id = Post.id AND l.type = 'like' AND l.comment_id IS NULL
          )`),
          'likes_count',
        ],
      ],
    },
  });

  if (!post) return null;

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    publish_date: post.publish_date,
    status: post.status,
    image_url: post.image_url,
    author_id: post.author_id,
    likes_count: post.getDataValue('likes_count'),
    comments_count: post.getDataValue('comments_count'),
  };
};

export const getMyPostsService = async (
  userId: number,
  status?: 'active' | 'inactive',
  sortBy?: 'likes' | 'date',
  order?: 'ASC' | 'DESC',
) => {
  const { whereClause, orderClause } = applyFilters({
    status,
    sortBy,
    order,
  }) as {
    whereClause: { [key: string]: unknown; author_id?: number };
    orderClause: [string, string][];
  };

  whereClause['author_id'] = userId;

  const posts = await Post.findAll({
    where: whereClause,
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM comments AS c
            WHERE c.post_id = Post.id
          )`),
          'comments_count',
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM likes AS l
            WHERE l.post_id = Post.id AND l.type = 'like' AND l.comment_id IS NULL
          )`),
          'likes_count',
        ],
      ],
    },
    order: orderClause,
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    publish_date: post.publish_date,
    status: post.status,
    image_url: post.image_url,
    author_id: post.author_id,
    likes_count: post.getDataValue('likes_count'),
    comments_count: post.getDataValue('comments_count'),
  }));
};

export const getCommentsForPostService = async (
  postId: string,
  status?: 'active' | 'inactive',
  sortBy: 'likes' | 'date' = 'likes',
  order: 'ASC' | 'DESC' = 'DESC',
  limit: number = 10,
  offset: number = 0,
) => {
  const whereClause: { [key: string]: string | number | null } = {
    post_id: postId,
    parent_id: null,
  };

  if (status) whereClause.status = status;

  const allCommentIds = await Comment.findAll({
    where: whereClause,
    attributes: ['id'],
    order: sequelize.literal(
      sortBy === 'likes'
        ? `
        (SELECT COUNT(*)
         FROM likes
         WHERE likes.comment_id = Comment.id AND likes.type = 'like') ${order}`
        : `"publish_date" ${order}`,
    ),
    raw: true,
  }).then((comments) => comments.map((comment) => comment.id));

  const paginatedCommentIds = allCommentIds.slice(offset, offset + limit);

  const comments = await Comment.findAll({
    where: {
      id: {
        [Op.in]: paginatedCommentIds,
      },
    },
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
              FROM comments AS c
              WHERE c.parent_id = Comment.id)`,
          ),
          'replies_count',
        ],
        [
          sequelize.literal(
            `(SELECT COUNT(*)
              FROM likes AS l
              WHERE l.comment_id = Comment.id AND l.type = 'like')`,
          ),
          'likes_count',
        ],
      ],
    },
    order:
      sortBy === 'likes'
        ? [[sequelize.literal('likes_count'), order]]
        : [['publish_date', order]],
  });

  return {
    comments: comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      publish_date: comment.publish_date,
      status: comment.status,
      author_id: comment.author?.id,
      likes_count: comment.getDataValue('likes_count'),
      replies_count: comment.getDataValue('replies_count'),
    })),
    totalItems: allCommentIds.length,
  };
};

export const getCategoriesForPostService = async (postId: string) => {
  const post = await Post.findOne({
    where: { id: postId },
    include: [
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

  if (!post) return null;

  return (post.postCategories ?? []).map(({ category }) => ({
    id: category?.id || 0,
    title: category?.title || '',
    description: category?.description || '',
  }));
};

export const createPostService = async (
  title: string,
  content: string,
  categories: number[],
  userId: number | undefined,
  imageUrl?: string,
) => {
  if (!title || !content || !categories || !Array.isArray(categories)) {
    throw new AppError('Title, content, and categories are required.', 400);
  }

  const existingCategories = await Category.findAll({
    where: { id: categories },
  });
  if (existingCategories.length !== categories.length) {
    throw new AppError('One or more categories are invalid.', 400);
  }

  const newPost = await Post.create({
    title,
    content,
    author_id: userId ?? 0,
    status: 'active',
    publish_date: new Date(),
    image_url: imageUrl,
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

  return { post: newPost, categories: filteredCategories };
};

export const updatePostService = async (
  postId: string,
  title: string | undefined,
  content: string | undefined,
  categories: number[] | undefined,
  status: string | undefined,
  userId: number | undefined,
  imageUrl?: string,
) => {
  const post = await Post.findOne({ where: { id: postId } });
  if (!post) return null;

  if (post.author_id !== userId) {
    throw new AppError('You are not authorized to update this post', 403);
  }

  if (title) post.title = title;
  if (content) post.content = content;

  if (imageUrl === null || imageUrl === undefined) {
    post.image_url = null;
  } else if (imageUrl) {
    post.image_url = imageUrl;
  }

  if (status === 'active' || status === 'inactive') post.status = status;

  if (categories && Array.isArray(categories)) {
    const existingCategories = await Category.findAll({
      where: { id: categories },
    });
    if (existingCategories.length !== categories.length) {
      throw new AppError('One or more categories are invalid.', 400);
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
    where: { id: postId },
    include: [
      {
        model: PostCategory,
        include: [{ model: Category }],
      },
    ],
  });

  return updatedPost;
};

export const deletePostService = async (
  postId: string,
  userId: number | undefined,
) => {
  return sequelize.transaction(async (transaction: Transaction) => {
    const post = await Post.findOne({
      where: { id: postId, author_id: userId },
      transaction,
    });

    if (!post) {
      throw new AppError(
        'Post not found or not authorized to delete this post',
        403,
      );
    }

    try {
      await PostCategory.destroy({ where: { post_id: postId }, transaction });

      const commentIds = await Comment.findAll({
        attributes: ['id'],
        where: { post_id: postId },
        transaction,
      });
      const commentIdList = commentIds.map((comment) => comment.id);

      if (commentIdList.length > 0) {
        await Like.destroy({
          where: { comment_id: { [Op.in]: commentIdList } },
          transaction,
        });
      }

      await Comment.destroy({ where: { post_id: postId }, transaction });

      await Like.destroy({ where: { post_id: postId }, transaction });

      await Favorite.destroy({ where: { post_id: postId }, transaction });

      await Post.destroy({ where: { id: postId }, transaction });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.stack);
      } else {
        console.error(error);
      }
      throw new AppError('Error during post deletion', 500);
    }
  });
};

export const getMyFavoritePostsService = async (
  userId: number,
  status?: 'active' | 'inactive',
  sortBy?: 'likes' | 'date',
  order?: 'ASC' | 'DESC',
) => {
  const { whereClause, orderClause } = applyFilters({
    status,
    sortBy,
    order,
  }) as {
    whereClause: { [key: string]: unknown };
    orderClause: [string, string][];
  };

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
      (SELECT COUNT(*) FROM likes WHERE likes.post_id = p.id AND likes.type = 'like' AND likes.comment_id IS NULL) AS likes_count
    FROM favorites f
    JOIN posts p ON f.post_id = p.id
    JOIN users u ON p.author_id = u.id
    WHERE f.user_id = :userId
    ${status ? `AND p.status = :status` : ''}
    GROUP BY p.id, u.id
    ORDER BY ${sortBy === 'likes' ? 'likes_count' : 'p.publish_date'} ${order};
  `;

  const favoritePosts = await sequelize.query<PostWithCounts>(query, {
    replacements: { userId, status },
    type: QueryTypes.SELECT,
  });

  return favoritePosts.map((post) => ({
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

export const addPostToFavoritesService = async (
  postId: number,
  userId: number,
) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const existingFavorite = await Favorite.findOne({
    where: {
      post_id: postId,
      user_id: userId,
    },
  });

  if (existingFavorite) {
    throw new AppError('Post is already in favorites', 400);
  }

  const favorite = await Favorite.create({
    post_id: postId,
    user_id: userId,
  });

  return favorite;
};

export const removePostFromFavoritesService = async (
  postId: number,
  userId: number,
) => {
  const favorite = await Favorite.findOne({
    where: {
      post_id: postId,
      user_id: userId,
    },
  });

  if (!favorite) {
    throw new AppError('Favorite post not found', 404);
  }

  await favorite.destroy();
};

export const getLikesForPostService = async (postId: number) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const likes = await Like.findAll({
    where: {
      post_id: postId,
    },
  });

  return likes;
};

export const toggleLikeForPostService = async (
  postId: number,
  userId: number,
  type: 'like' | 'dislike',
) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.status === 'inactive') {
    throw new AppError('You cannot like an inactive post', 403);
  }

  if (post.author_id === userId) {
    throw new AppError('You cannot like or dislike your own post', 403);
  }

  const existingLike = await Like.findOne({
    where: {
      post_id: postId,
      author_id: userId,
    },
  });

  if (existingLike) {
    if (existingLike.type !== type) {
      existingLike.type = type;
      await existingLike.save();

      await updateUserRating(post.author_id);

      return existingLike;
    }

    throw new AppError(`You have already ${type}d this post`, 400);
  } else {
    const like = await Like.create({
      post_id: postId,
      author_id: userId,
      type,
    });

    await updateUserRating(post.author_id);

    return like;
  }
};

export const deleteLikeFromPostService = async (
  postId: number,
  userId: number,
) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const like = await Like.findOne({
    where: {
      post_id: postId,
      author_id: userId,
      comment_id: {
        [Op.is]: sequelize.literal('NULL'),
      },
    },
  });

  if (!like) {
    throw new AppError('Like not found', 404);
  }

  await like.destroy();

  await updateUserRating(post.author_id);
};

export const createCommentService = async (
  postId: string,
  content: string,
  userId: number,
) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.status === 'inactive') {
    throw new AppError('Cannot comment on an inactive post', 403);
  }

  const comment = await Comment.create({
    post_id: Number(postId),
    content,
    author_id: userId,
    status: 'active',
  });

  return {
    id: comment.id,
    content: comment.content,
    post_id: comment.post_id,
    author_id: comment.author_id,
    status: comment.status,
  };
};
