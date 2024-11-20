import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import TextArea from '../Common/TextArea';
import Input from '../Common/Input';
import Button from '../Common/Button';
import useAuthStore from '../../hooks/useAuthStore';
import CategoryService from '../../API/CategoryService';

const CategoryCreate: React.FC = () => {
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
    } catch {
      setError('Category with this title already exists');
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Category
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded"
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
