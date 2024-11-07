import React, { useState } from 'react';
import PostService from '../../API/PostService';
import Button from '../Common/Button';

interface PostLikeProps {
  postId: number;
  initialLikeStatus: 'like' | 'dislike' | null;
  onLikeStatusChange: (newStatus: 'like' | 'dislike' | null) => void;
}

const PostLike: React.FC<PostLikeProps> = ({
  postId,
  initialLikeStatus,
  onLikeStatusChange,
}) => {
  const [likeStatus, setLikeStatus] = useState<'like' | 'dislike' | null>(
    initialLikeStatus,
  );

  const handleLikeClick = async () => {
    const newStatus = likeStatus === 'like' ? null : 'like';
    try {
      if (newStatus === 'like') {
        await PostService.createLike(postId, 'like');
      } else if (newStatus === null) {
        await PostService.deleteLike(postId);
      }
      setLikeStatus(newStatus);
      onLikeStatusChange(newStatus);
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };

  const handleDislikeClick = async () => {
    const newStatus = likeStatus === 'dislike' ? null : 'dislike';
    try {
      if (newStatus === 'dislike') {
        await PostService.createLike(postId, 'dislike');
      } else if (newStatus === null) {
        await PostService.deleteLike(postId);
      }
      setLikeStatus(newStatus);
      onLikeStatusChange(newStatus);
    } catch (error) {
      console.error('Error disliking the post:', error);
    }
  };

  return (
    <div>
      <Button
        onClick={handleLikeClick}
        className={`${
          likeStatus === 'like'
            ? 'text-blue-500 border-2 border-blue-500'
            : 'text-gray-500'
        } hover:border-2 hover:border-blue-300 focus:outline-none`}
      >
        👍
      </Button>
      <Button
        onClick={handleDislikeClick}
        className={`${
          likeStatus === 'dislike'
            ? 'text-red-500 border-2 border-red-500'
            : 'text-gray-500'
        } hover:border-2 hover:border-red-300 focus:outline-none`}
      >
        👎
      </Button>
    </div>
  );
};

export default PostLike;
