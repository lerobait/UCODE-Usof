import React, { useState } from 'react';
import Button from '../Common/Button';
import TextArea from '../Common/TextArea';
import Modal from '../Modal/Modal';
import CommentService from '../../API/PostService';

interface CommentCreateProps {
  postId: number;
  onCommentCreated: () => void;
}

const CommentCreate: React.FC<CommentCreateProps> = ({
  postId,
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
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Comment
      </Button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} width="1000px">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h2 className="text-lg font-bold">Create Comment</h2>
          {error && <div className="text-red-500">{error}</div>}
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            label="Comment Content"
            placeholder="Write your comment here..."
            required
          />
          <Button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Create Comment
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default CommentCreate;
