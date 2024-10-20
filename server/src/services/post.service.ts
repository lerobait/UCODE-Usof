import { Post } from '../../database/models/Post';
import { Category } from '../../database/models/Category';
import { PostCategory } from '../../database/models/PostCategory';
import { User } from '../../database/models/User';
import { Comment } from '../../database/models/Comment';
import { Like } from '../../database/models/Like';
import { Favorite } from '../../database/models/Favorite';
import AppError from '../utils/appError';
import { Op } from 'sequelize';
import Sequelize from 'sequelize';
import sequelize from '../../database/db';

export const getAllPostsService = async () => {
  const posts = await Post.findAll({
    include: [
      {
        model: User,
        attributes: ['id', 'login', 'profile_picture'],
      },
      {
        model: Comment,
        attributes: [],
      },
      {
        model: Like,
        attributes: [],
      },
    ],
    attributes: {
      include: [
        [Sequelize.fn('COUNT', Sequelize.col('comments.id')), 'comments_count'],
        [Sequelize.fn('COUNT', Sequelize.col('likes.id')), 'likes_count'],
      ],
    },
    group: ['Post.id', 'author.id'],
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    publish_date: post.publish_date,
    status: post.status,
    image_url: post.image_url,
    author_id: post.author_id,
    author: post.author
      ? {
          id: post.author.id,
          login: post.author.login,
          profile_picture: post.author.profile_picture,
        }
      : null,
    likes_count: post.getDataValue('likes_count'),
    comments_count: post.getDataValue('comments_count'),
  }));
};

export const getPostByIdService = async (postId: string) => {
  const post = await Post.findOne({
    where: { id: postId },
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

  if (!post) return null;

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    publish_date: post.publish_date,
    status: post.status,
    author: post.author,
    image_url: post.image_url,
    categories: post.postCategories?.map(({ category }) => ({
      id: category?.id || 0,
      title: category?.title || '',
      description: category?.description || '',
    })),
  };
};

export const getMyPostsService = async (userId: number) => {
  const posts = await Post.findAll({
    where: { author_id: userId },
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

  return posts.map(
    ({
      id,
      title,
      content,
      publish_date,
      status,
      author,
      image_url,
      postCategories = [],
    }) => ({
      id,
      title,
      content,
      publish_date,
      status,
      author,
      image_url,
      categories: postCategories.map(({ category }) => ({
        id: category?.id || 0,
        title: category?.title || '',
        description: category?.description || '',
      })),
    }),
  );
};

export const getCommentsForPostService = async (postId: string) => {
  const comments = await Comment.findAll({
    where: { post_id: postId },
    include: [
      {
        model: User,
        attributes: ['id', 'full_name', 'profile_picture'],
      },
    ],
  });

  return comments.map(({ id, content, publish_date, status, author }) => ({
    id,
    content,
    publish_date,
    status,
    author,
  }));
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
  if (imageUrl) post.image_url = imageUrl;
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
  return sequelize.transaction(async (transaction: Sequelize.Transaction) => {
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

export const getMyFavoritePostsService = async (userId: number) => {
  const favoritePosts = await Favorite.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Post,
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
      },
    ],
  });

  return favoritePosts
    .map(({ post }) => {
      if (!post) return null;
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        publish_date: post.publish_date,
        status: post.status,
        author: post.author,
        image_url: post.image_url,
        categories: post.postCategories?.map(({ category }) => ({
          id: category?.id || 0,
          title: category?.title || '',
          description: category?.description || '',
        })),
      };
    })
    .filter(Boolean);
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

export const getLikesForPostService = async (postId: number) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const likes = await Like.findAll({
    where: {
      post_id: postId,
    },
    include: [
      {
        model: User,
        attributes: ['id', 'login', 'full_name', 'profile_picture'],
      },
    ],
  });

  return likes;
};

export const addLikeToPostService = async (postId: number, userId: number) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.status === 'inactive') {
    throw new AppError('You cannot like an inactive post', 403);
  }

  if (post.author_id === userId) {
    throw new AppError('You cannot like your own post', 403);
  }

  const existingLike = await Like.findOne({
    where: {
      post_id: postId,
      author_id: userId,
    },
  });

  if (existingLike) {
    throw new AppError('You already liked this post', 400);
  }

  const like = await Like.create({
    post_id: postId,
    author_id: userId,
    type: 'like',
  });
  return like;
};

export const deleteLikeFromPostService = async (
  postId: number,
  userId: number,
) => {
  const like = await Like.findOne({
    where: {
      post_id: postId,
      author_id: userId,
      comment_id: {
        [Op.is]: Sequelize.literal('NULL'),
      },
    },
  });

  if (!like) {
    throw new AppError('Like not found', 404);
  }

  await like.destroy();
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

  const author = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'full_name', 'profile_picture', 'rating'],
  });

  return {
    id: comment.id,
    content: comment.content,
    post_id: comment.post_id,
    author,
    status: comment.status,
  };
};
