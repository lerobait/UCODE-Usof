import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../hooks/useAuthStore';
import Modal from '../Modal/Modal';
import CategoryService from '../../API/CategoryService';
import Button from '../Common/Button';
import { TiDeleteOutline } from 'react-icons/ti';

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
      <Button
        onClick={handleOpenModal}
        className="px-4 py-2 font-bold text-red-500 border border-red-500 rounded-full hover:border-2 hover:border-red-600 flex items-center justify-center space-x-2 flex-shrink-0 max-w-full"
      >
        <TiDeleteOutline />
        <span>Delete Category</span>
      </Button>
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
              <Button
                onClick={handleCloseModal}
                className="px-4 py-2 mr-2 font-bold text-gray-500 border border-gray-500 rounded-full hover:border-2 hover:border-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteCategory}
                className="px-4 py-2 m-0 font-bold text-red-500 border border-red-500 rounded-full hover:border-2 hover:border-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CategoryDelete;
