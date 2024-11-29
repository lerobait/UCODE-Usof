import { QueryInterface } from 'sequelize';
import { User } from '../models/User';
import { Post } from '../models/Post';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  const users = await User.findAll();
  const posts = await Post.findAll();

  const commentTexts = [
    'Yo this post is great!',
    'Love this post!',
    'I didnt like it',
    'This post sucks',
  ];

  const comments = [];
  const activeComments = ['Yo this post is great!', 'Love this post!'];

  for (const post of posts) {
    for (let i = 0; i < commentTexts.length; i++) {
      const status = activeComments.includes(commentTexts[i])
        ? 'active'
        : 'inactive';
      const comment = {
        author_id: users[i % users.length].id,
        post_id: post.id,
        content: commentTexts[i],
        publish_date: new Date(),
        status: status,
        parent_id: null,
      };
      comments.push(comment);
    }
  }

  await queryInterface.bulkInsert('comments', comments);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.bulkDelete('comments', {}, {});
};
