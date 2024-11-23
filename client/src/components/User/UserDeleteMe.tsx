import React, { useState } from 'react';
import useAuthStore from '../../hooks/useAuthStore';
import Modal from '../Modal/Modal';
import UserService from '../../API/UserService';
import Button from '../Common/Button';
import { TiDeleteOutline } from 'react-icons/ti';

const UserDeleteMe: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const clearUser = useAuthStore((state) => state.clearUser);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await UserService.deleteCurrentUser();
      clearUser();
      window.location.href = '/posts';
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleOpenModal}
        className="px-4 py-2 font-bold text-red-500 border border-red-500 rounded-full hover:border-2 hover:border-red-600 flex items-center justify-center space-x-2"
      >
        <TiDeleteOutline />
        <span>Delete Account</span>
      </Button>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Delete Account?</h3>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete your account? This action cannot
              be undone, and all your data will be permanently deleted.
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <Button
                onClick={handleCloseModal}
                className="px-4 py-2 mr-2 font-bold text-gray-500 border border-gray-500 rounded-full hover:border-2 hover:border-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                className="px-4 py-2 m-0 font-bold text-red-500 border border-red-500 rounded-full hover:border-2 hover:border-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserDeleteMe;
