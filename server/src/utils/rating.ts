import { Like } from '../../database/models/Like';
import { Post } from '../../database/models/Post';
import { Comment } from '../../database/models/Comment';
import { User } from '../../database/models/User';

export const updateUserRating = async (userId: number) => {
  // Лайки на посты, написанные данным пользователем
  const postLikes = await Like.count({
    include: [
      {
        model: Post,
        where: {
          author_id: userId,
        },
      },
    ],
    where: {
      type: 'like',
    },
  });

  // Лайки на комментарии, написанные данным пользователем
  const commentLikes = await Like.count({
    include: [
      {
        model: Comment,
        where: {
          author_id: userId,
        },
      },
    ],
    where: {
      type: 'like',
    },
  });

  // Дизлайки на посты, написанные данным пользователем
  const postDislikes = await Like.count({
    include: [
      {
        model: Post,
        where: {
          author_id: userId,
        },
      },
    ],
    where: {
      type: 'dislike',
    },
  });

  // Дизлайки на комментарии, написанные данным пользователем
  const commentDislikes = await Like.count({
    include: [
      {
        model: Comment,
        where: {
          author_id: userId,
        },
      },
    ],
    where: {
      type: 'dislike',
    },
  });

  // Подсчет общего рейтинга
  const rating = postLikes + commentLikes - (postDislikes + commentDislikes);

  // Обновление рейтинга пользователя
  await User.update({ rating }, { where: { id: userId } });
};
