import { useState, useEffect } from 'react';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import Modal from '../Modal/Modal';
import CommentService from '../../API/CommentService';
import useAuthStore from '../../hooks/useAuthStore';

interface CommentLikeProps {
  commentId: number;
  initialLikeStatus: 'like' | 'dislike' | null;
  onLikeStatusChange: (newStatus: 'like' | 'dislike' | null) => void;
  currentLikeCount: number;
  commentStatus: string;
}

const CommentLike: React.FC<CommentLikeProps> = ({
  commentId,
  initialLikeStatus,
  onLikeStatusChange,
  currentLikeCount,
  commentStatus,
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
        `likeStatus-${user.id}-${commentId}`,
      );
      setLikeStatus(savedLikeStatus as 'like' | 'dislike' | null);
    } else {
      setLikeStatus(null);
    }
  }, [commentId, user]);

  const handleLikeClick = async () => {
    if (!user) {
      setModalOpen(true);
      return;
    }
    if (commentStatus === 'inactive') {
      return;
    }
    const newStatus = likeStatus === 'like' ? null : 'like';
    try {
      if (newStatus === 'like') {
        await CommentService.createLike(commentId, 'like');
      } else if (newStatus === null) {
        await CommentService.deleteLike(commentId);
      }
      setLikeStatus(newStatus);
      localStorage.setItem(
        `likeStatus-${user.id}-${commentId}`,
        newStatus || '',
      );
      onLikeStatusChange(newStatus);
    } catch (error) {
      console.error('Error liking the comment:', error);
    }
  };

  const handleDislikeClick = async () => {
    if (!user) {
      setModalOpen(true);
      return;
    }
    if (commentStatus === 'inactive') {
      return;
    }
    const newStatus = likeStatus === 'dislike' ? null : 'dislike';
    try {
      if (newStatus === 'dislike') {
        await CommentService.createLike(commentId, 'dislike');
      } else if (newStatus === null) {
        await CommentService.deleteLike(commentId);
      }
      setLikeStatus(newStatus);
      localStorage.setItem(
        `likeStatus-${user.id}-${commentId}`,
        newStatus || '',
      );
      onLikeStatusChange(newStatus);
    } catch (error) {
      console.error('Error disliking the comment:', error);
    }
  };

  const closeModal = () => setModalOpen(false);

  const buttonClass =
    commentStatus === 'inactive'
      ? 'cursor-not-allowed'
      : 'hover:text-blue-300 dark:hover:text-blue-300';

  return (
    <div className="flex items-center mt-4">
      <Button
        onClick={handleLikeClick}
        className={`focus:outline-none ${commentStatus === 'inactive' ? 'text-gray-400' : 'text-2xl'} ${buttonClass}`}
        disabled={commentStatus === 'inactive'}
      >
        <AiOutlineLike
          className={`text-2xl ${likeStatus === 'like' ? 'text-blue-500' : 'text-gray-500 dark:text-white'} ${buttonClass}`}
        />
      </Button>
      <span className="mx-2 text-gray-500 dark:text-white">
        {currentLikeCount}
      </span>
      <Button
        onClick={handleDislikeClick}
        className={`focus:outline-none ${commentStatus === 'inactive' ? 'text-gray-400 dark:text-white' : 'text-2xl'} ${buttonClass}`}
        disabled={commentStatus === 'inactive'}
      >
        <AiOutlineDislike
          className={`text-2xl ${likeStatus === 'dislike' ? 'text-red-500' : 'text-gray-500 dark:text-white'} ${buttonClass}`}
        />
      </Button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Authentication Required</h2>
          <p className="mb-4">
            You need to be logged in to like or dislike comments.
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600"
          >
            Login
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CommentLike;
