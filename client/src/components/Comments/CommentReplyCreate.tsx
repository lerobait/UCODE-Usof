import { useState } from 'react';
import useAuthStore from '../../hooks/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import TextArea from '../Common/TextArea';
import CommentService from '../../API/CommentService';
import Modal from '../Modal/Modal';
import Button from '../Common/Button';

interface CommentReplyCreateProps {
  commentId: number;
  postId: number;
  status: 'active' | 'inactive';
  onReplyCreated: () => void;
}

const CommentReplyCreate: React.FC<CommentReplyCreateProps> = ({
  commentId,
  postId,
  status,
  onReplyCreated,
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
      await CommentService.createReply(postId, commentId, content);
      setContent('');
      onReplyCreated();
      handleCloseModal();
    } catch {
      setError('Failed to create reply');
    }
  };

  return (
    <div className="md:mb-4">
      <Button
        onClick={handleOpenModal}
        disabled={status === 'inactive'}
        className={`w-full px-4 py-2 ${
          status === 'inactive'
            ? 'cursor-not-allowed'
            : 'hover:border-2 dark:hover:border-2 hover:border-blue-600 dark:hover:border-white'
        } text-blue-500 border border-blue-500 dark:text-white dark:border-white rounded-full flex items-center justify-center space-x-2`}
      >
        <IoMdAdd />
        <span>Create Reply</span>
      </Button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} width="1000px">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h2 className="text-lg font-bold">Create Reply</h2>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            label="Reply Content"
            placeholder="Write your reply here..."
            required
          />
          {error && <div className="text-red-500">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600"
          >
            Create Reply
          </Button>
        </form>
      </Modal>

      <Modal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal}>
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Authentication Required</h2>
          <p className="mb-4">You need to be logged in to create a reply.</p>
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

export default CommentReplyCreate;
