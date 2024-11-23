import React, { useState } from 'react';
import Button from '../Common/Button';
import TextArea from '../Common/TextArea';
import Modal from '../Modal/Modal';
import CommentService from '../../API/PostService';
import { IoMdAdd } from 'react-icons/io';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setContent('');
    setError(null);
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
        className={`w-full px-4 py-2 ${postStatus === 'inactive' ? 'cursor-not-allowed' : 'hover:border-2 hover:border-blue-600'} text-blue-500 border border-blue-500 rounded-full flex items-center justify-center space-x-2`}
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
    </div>
  );
};

export default CommentCreate;
