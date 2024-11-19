import React, { useState, useEffect } from 'react';
import Button from '../Common/Button';
import Modal from '../Modal/Modal';
import TextArea from '../Common/TextArea';
import { FormControl, FormHelperText, Switch } from '@mui/joy';
import CommentService from '../../API/CommentService';

interface CommentEditProps {
  commentId: number;
  initialContent: string;
  initialStatus: 'active' | 'inactive';
}

const CommentEdit: React.FC<CommentEditProps> = ({
  commentId,
  initialContent,
  initialStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState<string>(initialContent);
  const [status, setStatus] = useState<'active' | 'inactive'>(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setContent(initialContent);
    setStatus(initialStatus);
  }, [initialContent, initialStatus]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Content cannot be empty.');
      return;
    }

    setIsUpdating(true);
    try {
      await CommentService.updateComment(commentId, {
        content,
        status,
      });
      handleCloseModal();
    } catch {
      setError('Failed to update comment. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.checked ? 'active' : 'inactive');
  };

  return (
    <div>
      <Button
        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        onClick={handleOpenModal}
      >
        Edit
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        height="auto"
        width="600px"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h2 className="text-lg font-bold">Editing a Comment</h2>
          {error && <div className="text-red-500">{error}</div>}

          <div>
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              label="Content"
              placeholder="Edit your comment..."
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <FormControl
              orientation="horizontal"
              sx={{
                width: 300,
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Switch
                checked={status === 'active'}
                onChange={handleStatusChange}
                color="primary"
              />
              <FormHelperText
                sx={{
                  marginLeft: '8px',
                  color: status === 'active' ? 'green' : 'red',
                }}
              >
                {status === 'active' ? 'Active' : 'Inactive'}
              </FormHelperText>
            </FormControl>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Comment'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default CommentEdit;
