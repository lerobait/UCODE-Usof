import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../Common/Button';
import Modal from '../Modal/Modal';
import useAuthStore from '../../hooks/useAuthStore';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuthStore();

  const handleTrendsClick = () => {
    navigate('/posts');
  };

  const handleCategoriesClick = () => {
    navigate('/categories');
  };

  const handleFavoriteClick = () => {
    if (user) {
      navigate('/posts/favorite');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleMyPostsClick = () => {
    if (user) {
      navigate('/posts/my');
    } else {
      setIsModalOpen(true);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <aside className="sticky top-16 h-[940px] bg-white shadow-lg flex flex-col p-4 w-64">
        <div className="flex-grow overflow-y-auto space-y-4">
          <Button
            className={`w-full text-left font-semibold py-2 px-4 rounded ${
              isActive('/posts')
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={handleTrendsClick}
          >
            Trends
          </Button>
          <Button
            className={`w-full text-left font-semibold text-gray-700 hover:bg-gray-200 py-2 px-4 rounded ${
              isActive('/categories')
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={handleCategoriesClick}
          >
            Categories
          </Button>
          <Button
            className={`w-full text-left font-semibold py-2 px-4 rounded ${
              isActive('/posts/my')
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={handleMyPostsClick}
          >
            My Posts
          </Button>
          <Button
            className={`w-full text-left font-semibold py-2 px-4 rounded ${
              isActive('/posts/favorite')
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={handleFavoriteClick}
          >
            Favorites
          </Button>
          <Button className="w-full text-left font-semibold text-gray-700 hover:bg-gray-200 py-2 px-4 rounded">
            All Users
          </Button>
        </div>
        <div className="pt-4">
          <Button className="w-full text-left font-semibold text-gray-700 hover:bg-gray-200 py-2 px-4 rounded">
            Settings
          </Button>
        </div>
      </aside>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Authentication Required</h2>
          <p className="mb-4">
            You need to be logged in to access your favorites.
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white mb-2 w-full"
          >
            Login
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
