import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostService from '../../API/PostService';
import PostAuthor from './PostAuthor';
import Button from '../Common/Button';
import PostCategories from './PostCategories';
import PostLike from './PostLike';
import useAuthStore from '../../hooks/useAuthStore';

dayjs.extend(relativeTime);

interface PostItemProps {
  id: number;
  title: string;
  content: string;
  authorId: number;
  date: string;
  status: string;
  likeCount: number;
  commentCount: number;
  imageUrl?: string | null;
}

const PostItem: React.FC<PostItemProps> = ({
  id,
  title,
  content,
  authorId,
  date,
  status,
  likeCount,
  commentCount,
  imageUrl,
}) => {
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [likeStatus, setLikeStatus] = useState<'like' | 'dislike' | null>(null);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (user) {
        try {
          const response = await PostService.getLikesForPost(id);
          const userLike = response.data.likes.find(
            (like: { author_id: number; type: string }) =>
              like.author_id === user.id,
          );
          if (userLike) {
            setLikeStatus(userLike.type === 'like' ? 'like' : 'dislike');
          }
        } catch (error) {
          console.error('Error fetching like status:', error);
        }
      }
    };

    fetchLikeStatus();
  }, [id, user]);

  const handleLikeUpdate = (newStatus: 'like' | 'dislike' | null) => {
    if (newStatus === 'like') {
      if (likeStatus === 'dislike') {
        setCurrentLikeCount((prevCount) => prevCount + 1);
      } else if (likeStatus === 'like') {
        setCurrentLikeCount((prevCount) => prevCount - 1);
      } else {
        setCurrentLikeCount((prevCount) => prevCount + 1);
      }
    } else if (newStatus === 'dislike') {
      if (likeStatus === 'like') {
        setCurrentLikeCount((prevCount) => prevCount - 1);
      }
    } else {
      if (likeStatus === 'like') {
        setCurrentLikeCount((prevCount) => prevCount - 1);
      }
    }

    setLikeStatus(newStatus);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <PostAuthor authorId={authorId} />
      <div>
        <span className="text-xs text-gray-400 ml-2">
          {/* Используем dayjs для вычисления времени */}
          {dayjs(date).fromNow()}
        </span>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mt-4">{title}</h2>
      <p className="text-gray-600 mt-2">{content}</p>

      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt={title} className="max-w-full rounded-lg" />
        </div>
      )}

      <PostCategories postId={id} />

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">{status}</span>
        <div className="flex items-center space-x-4">
          <Button className="text-blue-500 hover:underline">
            Add to Favorites
          </Button>
          <div className="flex items-center">
            <PostLike
              postId={id}
              initialLikeStatus={likeStatus}
              onLikeStatusChange={handleLikeUpdate}
              currentLikeCount={currentLikeCount}
              postStatus={status}
            />
          </div>
          <Button className="text-gray-500 hover:text-gray-700">
            💬 {commentCount}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
