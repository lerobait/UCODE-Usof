import { Post } from '../../database/models/Post';
import { Category } from '../../database/models/Category';
import { PostCategory } from '../../database/models/PostCategory';
import { User } from '../../database/models/User';
import { Comment } from '../../database/models/Comment';
import AppError from '../utils/appError';

export const getAllPostsService = async () => {
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
  const post = await Post.findOne({ where: { id: postId } });
  if (!post || post.author_id !== userId) return null;

  await PostCategory.destroy({ where: { post_id: post.id } });
  await post.destroy();
  return true;
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
