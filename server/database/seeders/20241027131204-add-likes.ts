import { QueryInterface } from 'sequelize';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { Like } from '../models/Like';
import sequelize from '../db';

export const up = async (): Promise<void> => {
  sequelize.addModels([User, Post, Comment, Like]);

  const users = await User.findAll();
  const posts = await Post.findAll();
  const comments = await Comment.findAll();

  await Promise.all(
    posts.map(async (post) => {
      const likesToAdd = 3;
      const dislikesToAdd = 3;

      for (let i = 0; i < likesToAdd; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];

        const existingDislike = await Like.findOne({
          where: {
            author_id: randomUser.id,
            post_id: post.id,
            type: 'dislike',
          },
        });

        if (!existingDislike) {
          await Like.create({
            author_id: randomUser.id,
            post_id: post.id,
            type: 'like',
          });
        }
      }

      for (let i = 0; i < dislikesToAdd; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];

        const existingLike = await Like.findOne({
          where: {
            author_id: randomUser.id,
            post_id: post.id,
            type: 'like',
          },
        });

        if (!existingLike) {
          await Like.create({
            author_id: randomUser.id,
            post_id: post.id,
            type: 'dislike',
          });
        }
      }
    }),
  );

  await Promise.all(
    comments.map(async (comment) => {
      const likesToAdd = 3;
      const dislikesToAdd = 3;

      for (let i = 0; i < likesToAdd; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];

        const existingDislike = await Like.findOne({
          where: {
            author_id: randomUser.id,
            comment_id: comment.id,
            type: 'dislike',
          },
        });

        if (!existingDislike) {
          await Like.create({
            author_id: randomUser.id,
            post_id: comment.post_id,
            comment_id: comment.id,
            type: 'like',
          });
        }
      }

      for (let i = 0; i < dislikesToAdd; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];

        const existingLike = await Like.findOne({
          where: {
            author_id: randomUser.id,
            comment_id: comment.id,
            type: 'like',
          },
        });

        if (!existingLike) {
          await Like.create({
            author_id: randomUser.id,
            post_id: comment.post_id,
            comment_id: comment.id,
            type: 'dislike',
          });
        }
      }
    }),
  );
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.bulkDelete('likes', {}, {});
};
