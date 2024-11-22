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
      <aside className="sticky top-16 h-[940px] bg-white shadow-lg flex flex-col p-4 w-64">
        <div className="flex-grow overflow-y-auto space-y-4">
          <Button
            className={`w-full text-left font-semibold py-2 px-4 rounded flex items-center space-x-2 ${isActive('/posts') ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={handleTrendsClick}
          >
            <IoIosTrendingUp className="text-lg" />
            <span>Trends</span>
          </Button>
          <Button
            className={`w-full text-left font-semibold flex items-center space-x-2 text-gray-700 hover:bg-gray-200 py-2 px-4 rounded ${isActive('/categories') ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={handleCategoriesClick}
          >
            <BiCategory className="text-lg" />
            <span>Categories</span>
          </Button>
          <Button
            className={`w-full text-left font-semibold flex items-center space-x-2 py-2 px-4 rounded ${isActive('/posts/my') ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={handleMyPostsClick}
          >
            <BsFileEarmarkPost className="text-lg" />
            <span>My Posts</span>
          </Button>
          <Button
            className={`w-full text-left font-semibold flex items-center space-x-2 py-2 px-4 rounded ${isActive('/posts/favorite') ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={handleFavoriteClick}
          >
            <GoStar className="text-lg" />
            <span>Favorites</span>
          </Button>
          <Button
            className={`w-full text-left font-semibold flex items-center space-x-2 text-gray-700 hover:bg-gray-200 py-2 px-4 rounded ${isActive('/users') ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={handleUsersClick}
          >
            <PiUsersThree className="text-lg" />
            <span>All Users</span>
          </Button>
        </div>

        {user && (
          <div className="pt-4">
            <Button
              className={`w-full text-left font-semibold flex items-center space-x-2  text-gray-700 hover:bg-gray-200 py-2 px-4 rounded ${isActive('/users/me') ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`}
              onClick={handleSettingsClick}
            >
              <IoSettingsOutline className="text-lg" />
              <span>Settings</span>
            </Button>
          </div>
        )}
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
