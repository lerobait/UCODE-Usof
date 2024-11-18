import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import PostService from '../../API/PostService';
import Button from '../Common/Button';
import Input from '../Common/Input';
import TextArea from '../Common/TextArea';
import InputFileUpload from '../Common/InputFileUpload';
import ImagePreview from '../Common/ImagePreview';
import CategorySelector from '../Common/CategorySelector';

const PostCreate: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setImage(null);
    setImagePreview(null);
    setCategories([]);
    setError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || categories.length === 0) {
      setError('All fields are required, please select at least one category.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) formData.append('image', image);

      categories.forEach((category) => {
        formData.append('categories[]', String(category));
      });

      await PostService.createPost(formData);
      handleCloseModal();
    } catch {
      setError('Failed to create post. Try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleCategorySelect = (
    categoryId: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setCategories((prevCategories) => {
      if (prevCategories.includes(categoryId)) {
        return prevCategories.filter((id) => id !== categoryId);
      }
      return [...prevCategories, categoryId];
    });
  };

  return (
    <div className="mb-4">
      <Button
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleOpenModal}
      >
        Create a post
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        height="auto"
        width="800px"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h2 className="text-lg font-bold">Creating a post</h2>
          {error && <div className="text-red-500">{error}</div>}

          <div>
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="Write your post title here..."
              required
            />
          </div>

          <div>
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              label="Content"
              placeholder="Write your post content here..."
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium">
              Image
            </label>
            <InputFileUpload onChange={handleFileChange} />
            <ImagePreview
              imagePreview={imagePreview}
              onRemoveImage={handleRemoveImage}
            />
          </div>

          <div>
            <label htmlFor="categories" className="block text-sm font-medium">
              Categories
            </label>
            <CategorySelector
              selectedCategories={categories}
              onCategorySelect={handleCategorySelect}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Create
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default PostCreate;
