import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../Common/Button';
import Modal from '../Modal/Modal';
import useAuthStore from '../../hooks/useAuthStore';
import { BsFileEarmarkPost } from 'react-icons/bs';
import { BiCategory } from 'react-icons/bi';
import { IoIosTrendingUp } from 'react-icons/io';
import { GoStar } from 'react-icons/go';
import { PiUsersThree } from 'react-icons/pi';
import { IoSettingsOutline } from 'react-icons/io5';

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

  const handleUsersClick = () => {
    navigate('/users');
  };

  const handleSettingsClick = () => {
    navigate('/users/me');
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
      <aside className="sticky top-16 min-h-screen bg-white dark:bg-gray-600 shadow-lg flex flex-col p-4 w-64">
        <div className="flex-grow space-y-5">
          <Button
            className={`w-full text-left font-semibold flex items-center space-x-2 text-gray-700 hover:bg-blue-100 dark:text-white dark:hover:bg-gray-800 py-2 px-4 rounded ${isActive('/posts') ? 'bg-blue-100 dark:bg-gray-800 dark:text-white text-gray-900 ' : 'text-gray-700 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-800'}`}
            onClick={handleTrendsClick}
          >
            <IoIosTrendingUp className="text-lg" />
            <span>Trends</span>
          </Button>
          <Button
            className={`w-full text-left font-semibold flex items-center space-x-2 text-gray-700 hover:bg-blue-100 dark:text-white dark:hover:bg-gray-800 py-2 px-4 rounded ${isActive('/categories') ? 'bg-blue-100 dark:bg-gray-800 dark:text-white text-gray-900 ' : 'text-gray-700 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-800'}`}
            onClick={handleCategoriesClick}
          >
            <BiCategory className="text-lg" />
            <span>Categories</span>
          </Button>
          <Button
            className={`w-full text-left font-semibold flex items-center space-x-2 text-gray-700 hover:bg-blue-100 dark:text-white dark:hover:bg-gray-800 py-2 px-4 rounded ${isActive('/posts/my') ? 'bg-blue-100 dark:bg-gray-800 dark:text-white text-gray-900 ' : 'text-gray-700 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-800'}`}
            onClick={handleMyPostsClick}
          >
            <BsFileEarmarkPost className="text-lg" />
            <span>My Posts</span>
          </Button>
          <Button
            className={`w-full text-left font-semibold flex items-center space-x-2 text-gray-700 hover:bg-blue-100 dark:text-white dark:hover:bg-gray-800 py-2 px-4 rounded ${isActive('/posts/favorite') ? 'bg-blue-100 dark:bg-gray-800 dark:text-white text-gray-900 ' : 'text-gray-700 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-800'}`}
            onClick={handleFavoriteClick}
          >
            <GoStar className="text-lg" />
            <span>Favorites</span>
          </Button>
          <Button
            className={`w-full text-left font-semibold flex items-center space-x-2 text-gray-700 hover:bg-blue-100 dark:text-white dark:hover:bg-gray-800 py-2 px-4 rounded ${isActive('/users') ? 'bg-blue-100 dark:bg-gray-800 dark:text-white text-gray-900 ' : 'text-gray-700 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-800'}`}
            onClick={handleUsersClick}
          >
            <PiUsersThree className="text-lg" />
            <span>All Users</span>
          </Button>
          {user && (
            <Button
              className={`w-full text-left font-semibold flex items-center space-x-2 text-gray-700 hover:bg-blue-100 dark:text-white dark:hover:bg-gray-800 py-2 px-4 rounded ${isActive('/users/me') ? 'bg-blue-100 dark:bg-gray-800 dark:text-white text-gray-900 ' : 'text-gray-700 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-800'}`}
              onClick={handleSettingsClick}
            >
              <IoSettingsOutline className="text-lg" />
              <span>Settings</span>
            </Button>
          )}
        </div>
      </aside>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Authentication Required</h2>
          <p className="mb-4">You need to be logged in to access this page.</p>
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600"
          >
            Login
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
