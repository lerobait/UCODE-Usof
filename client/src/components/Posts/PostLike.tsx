import React, { useState, useEffect } from 'react';
import PostService from '../../API/PostService';
import Button from '../Common/Button';
import Modal from '../Modal/Modal';
import useAuthStore from '../../hooks/useAuthStore';
import { useNavigate } from 'react-router-dom';

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
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [likeStatus, setLikeStatus] = useState<'like' | 'dislike' | null>(
    initialLikeStatus,
  );
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const savedLikeStatus = localStorage.getItem(
        `likeStatus-${user.id}-${postId}`,
      );
      setLikeStatus(savedLikeStatus as 'like' | 'dislike' | null);
    } else {
      setLikeStatus(null);
    }
  }, [postId, user]);

  const handleLikeClick = async () => {
    if (!user) {
      setModalOpen(true);
      return;
    }

    const newStatus = likeStatus === 'like' ? null : 'like';
    try {
      if (newStatus === 'like') {
        await PostService.createLike(postId, 'like');
      } else if (newStatus === null) {
        await PostService.deleteLike(postId);
      }
      setLikeStatus(newStatus);
      localStorage.setItem(`likeStatus-${user.id}-${postId}`, newStatus || '');
      onLikeStatusChange(newStatus);
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };

  const handleDislikeClick = async () => {
    if (!user) {
      setModalOpen(true);
      return;
    }

    const newStatus = likeStatus === 'dislike' ? null : 'dislike';
    try {
      if (newStatus === 'dislike') {
        await PostService.createLike(postId, 'dislike');
      } else if (newStatus === null) {
        await PostService.deleteLike(postId);
      }
      setLikeStatus(newStatus);
      localStorage.setItem(`likeStatus-${user.id}-${postId}`, newStatus || '');
      onLikeStatusChange(newStatus);
    } catch (error) {
      console.error('Error disliking the post:', error);
    }
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <Button
        onClick={handleLikeClick}
        className={`${likeStatus === 'like' ? 'text-blue-500 border-2 border-blue-500' : 'text-gray-500'} hover:border-2 hover:border-blue-300 focus:outline-none`}
      >
        👍
      </Button>
      <Button
        onClick={handleDislikeClick}
        className={`${likeStatus === 'dislike' ? 'text-red-500 border-2 border-red-500' : 'text-gray-500'} hover:border-2 hover:border-red-300 focus:outline-none`}
      >
        👎
      </Button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Authentication Required</h2>
          <p className="mb-4">
            You need to be logged in to like or dislike posts.
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white mb-2 w-full"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate('/register')}
            className="bg-gray-500 text-white w-full"
          >
            Still don&apos;t have an account? Register
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PostLike;
