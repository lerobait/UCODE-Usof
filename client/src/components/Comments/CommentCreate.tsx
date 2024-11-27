import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import TextArea from '../Common/TextArea';
import Modal from '../Modal/Modal';
import CommentService from '../../API/PostService';
import { IoMdAdd } from 'react-icons/io';
import useAuthStore from '../../hooks/useAuthStore';

interface CommentCreateProps {
  postId: number;
  postStatus: string;
  onCommentCreated: () => void;
}

interface CommentCreateProps {
  postId: number;
  postStatus: string;
  onCommentCreated: () => void;
}

const CommentCreate: React.FC<CommentCreateProps> = ({
  postId,
  postStatus,
  onCommentCreated,
}) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setContent('');
    setError(null);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      await CommentService.createComment(postId, content);
      setContent('');
      onCommentCreated();
      handleCloseModal();
    } catch {
      setError('Failed to create comment');
    }
  };

  return (
    <div className="mb-4">
      <Button
        onClick={handleOpenModal}
        disabled={postStatus === 'inactive'}
        className={`w-full px-4 py-2 ${
          postStatus === 'inactive'
            ? 'cursor-not-allowed'
            : 'hover:border-2 hover:border-blue-600'
        } text-blue-500 border border-blue-500 dark:text-white dark:border-white dark:hover:border-2 dark:hover:border-white rounded-full flex items-center justify-center space-x-2`}
      >
        <IoMdAdd />
        <span>Create Comment</span>
      </Button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} width="1000px">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h2 className="text-lg font-bold">Create Comment</h2>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            label="Comment Content"
            placeholder="Write your comment here..."
            required
          />
          {error && <div className="text-red-500">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600"
          >
            Create Comment
          </Button>
        </form>
      </Modal>

      <Modal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal}>
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Authentication Required</h2>
          <p className="mb-4">You need to be logged in to create a comment.</p>
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

export default CommentCreate;
