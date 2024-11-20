import React, { useState } from 'react';
import Button from '../Common/Button';
import Modal from '../Modal/Modal';
import UserService from '../../API/UserService';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../hooks/useAuthStore';

interface UserDeleteProps {
  userId: number;
}

const UserDelete: React.FC<UserDeleteProps> = ({ userId }) => {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  if (!user || user.role !== 'admin' || user.id === userId) return null;

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    try {
      await UserService.deleteUser(userId);

      navigate('/users');
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <Button
        onClick={handleOpenModal}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Delete User
      </Button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Delete User?</h3>
          <p className="text-gray-600 mt-2">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Button
              onClick={handleDeleteUser}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
            <Button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserDelete;
