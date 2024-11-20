import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../hooks/useAuthStore';
import Modal from '../Modal/Modal';
import CategoryService from '../../API/CategoryService';

interface CategoryDeleteProps {
  categoryId: number;
}

const CategoryDelete: React.FC<CategoryDeleteProps> = ({ categoryId }) => {
  const { user } = useAuthStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleDeleteCategory = async () => {
    setDeleting(true);
    try {
      await CategoryService.deleteCategory(categoryId);
      navigate('/categories');
    } catch (error) {
      console.error('Failed to delete category:', error);
    } finally {
      setDeleting(false);
      setModalOpen(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Delete Category
      </button>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Delete Category?
            </h3>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete this category? All posts related
              to this category will be permanently deleted. This action cannot
              be undone.
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={handleDeleteCategory}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CategoryDelete;
