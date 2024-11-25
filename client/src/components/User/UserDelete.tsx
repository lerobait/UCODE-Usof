import React, { useState } from 'react';
import Button from '../Common/Button';
import Modal from '../Modal/Modal';
import UserService from '../../API/UserService';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../hooks/useAuthStore';
import { TiDeleteOutline } from 'react-icons/ti';

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
    <div className="flex items-center">
      <Button
        onClick={handleOpenModal}
        className="px-4 py-2 font-bold text-red-500 border border-red-500 rounded-full hover:border-2 hover:border-red-600 flex items-center justify-center space-x-2"
      >
        <TiDeleteOutline />
        <span>Delete User</span>
      </Button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Delete User?</h3>
          <p className="text-gray-600 mt-2">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Button
              onClick={handleCloseModal}
              className="px-4 py-2 mr-2 font-bold text-gray-500 border border-gray-500 rounded-full hover:border-2 hover:border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              className="px-4 py-2 m-0 font-bold text-red-500 border border-red-500 rounded-full hover:border-2 hover:border-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserDelete;
