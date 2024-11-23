import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import PostService from '../../API/PostService';
import Button from '../Common/Button';

interface PostDeleteProps {
  postId: number;
  onPostDeleted: (deletedPostId: number) => void;
}

const PostDelete: React.FC<PostDeleteProps> = ({ postId, onPostDeleted }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      await PostService.deletePost(postId);
      onPostDeleted?.(postId);
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-100"
      >
        Delete
      </Button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Delete post?</h3>
          <p className="text-gray-600 mt-2">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Button
              onClick={handleCloseModal}
              className="px-4 py-2 mr-2 font-bold text-gray-500 border border-gray-500 rounded-full hover:border-2 hover:border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeletePost}
              className="px-4 py-2 m-0 font-bold text-red-500 border border-red-500 rounded-full hover:border-2 hover:border-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PostDelete;
