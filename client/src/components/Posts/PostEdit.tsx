import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import Input from '../Common/Input';
import TextArea from '../Common/TextArea';
import InputFileUpload from '../Common/InputFileUpload';
import ImagePreview from '../Common/ImagePreview';
import CategorySelector from '../Common/CategorySelector';
import Button from '../Common/Button';
import PostService from '../../API/PostService';
import { FormControl, FormHelperText, Switch } from '@mui/joy';

interface PostEditProps {
  postId: number;
  onPostUpdated: () => void;
}

const PostEdit: React.FC<PostEditProps> = ({ postId, onPostUpdated }) => {
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await PostService.getPostById(postId);
        const { title, content, image_url, status } = response;
        setTitle(title);
        setContent(content);
        setImagePreview(image_url);
        setStatus(status === 'active' ? 'active' : 'inactive');

        const categoriesResponse =
          await PostService.getCategoriesForPost(postId);
        setCategories(
          categoriesResponse.map((cat: { id: number }) => String(cat.id)),
        );
      } catch {
        setError('Failed to fetch post details');
      } finally {
        setIsLoading(false);
      }
    };

    if (isModalOpen) fetchPost();
  }, [postId, isModalOpen]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.checked ? 'active' : 'inactive');
  };

  const updatePost = async () => {
    if (!title || !content || categories.length === 0) {
      setError('All fields are required.');
      return;
    }

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('status', status);
      if (image) formData.append('image', image);
      categories.forEach((category) => {
        formData.append('categories[]', category);
      });

      await PostService.updatePost(postId, formData);
      onPostUpdated();
      handleCloseModal();
    } catch {
      setError('Failed to update post. Try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePost();
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
    setCategories((prevCategories) =>
      prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId],
    );
  };

  return (
    <div>
      <Button
        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        onClick={handleOpenModal}
      >
        Edit Post
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        height="auto"
        width="800px"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h2 className="text-lg font-bold">Editing a post</h2>
          {(error || isLoading || isUpdating) && (
            <div className="text-red-500">
              {error ||
                (isLoading && 'Loading...') ||
                (isUpdating && 'Updating...')}
            </div>
          )}

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
              placeholder="Edit your post title here..."
              required
            />
          </div>

          <div>
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              label="Content"
              placeholder="Edit your post content here..."
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <FormControl
              orientation="horizontal"
              sx={{
                width: 300,
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Switch
                checked={status === 'active'}
                onChange={handleStatusChange}
                color="primary"
              />
              <FormHelperText
                sx={{
                  marginLeft: '8px',
                  color: status === 'active' ? 'green' : 'red',
                }}
              >
                {status === 'active' ? 'Active' : 'Inactive'}
              </FormHelperText>
            </FormControl>
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
            disabled={isUpdating || isLoading}
          >
            {isUpdating ? 'Updating...' : 'Update Post'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default PostEdit;
