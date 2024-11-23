import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import TextArea from '../Common/TextArea';
import Input from '../Common/Input';
import Button from '../Common/Button';
import useAuthStore from '../../hooks/useAuthStore';
import CategoryService from '../../API/CategoryService';
import { IoMdAdd } from 'react-icons/io';

interface CategoryCreateProps {
  onCategoryCreated: () => void;
}

const CategoryCreate: React.FC<CategoryCreateProps> = ({
  onCategoryCreated,
}) => {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleCreateCategory = async () => {
    try {
      await CategoryService.createCategory({ title, description });
      setTitle('');
      setDescription('');
      setError(null);
      setIsModalOpen(false);

      onCategoryCreated();
    } catch {
      setError('Category with this title already exists');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-blue-500 border border-blue-500 hover:border-2 hover:border-blue-600 rounded-full flex items-center justify-center space-x-2"
      >
        <IoMdAdd />
        <span>Create Category</span>
      </Button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4">Create a New Category</h2>

          <div className="mb-4">
            <label
              htmlFor="categoryTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <Input
              id="categoryTitle"
              placeholder="Enter category title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <TextArea
              label="Description"
              placeholder="Enter category description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-end">
            <Button
              onClick={handleCloseModal}
              className="px-4 py-2 mr-2 font-bold text-gray-500 border border-gray-500 rounded-full hover:border-2 hover:border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCategory}
              className="px-4 py-2 font-bold text-blue-500 border border-blue-500 rounded-full hover:border-2 hover:border-blue-600"
            >
              Create Category
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CategoryCreate;
