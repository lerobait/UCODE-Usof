import React, { useState } from 'react';
import useAuthStore from '../../hooks/useAuthStore';
import Modal from '../Modal/Modal';
import UserService from '../../API/UserService';
import Button from '../Common/Button';

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
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Delete Account
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
                onClick={handleDeleteAccount}
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
      )}
    </div>
  );
};

export default UserDeleteMe;
