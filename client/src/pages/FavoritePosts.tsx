import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import PostFavoriteList from '../components/Posts/PostFavoriteList';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import Sidebar from '../components/Sidebar/Sidebar';

const FavoritePosts: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('User is not authenticated');
      return;
    }
  }, []);

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-400">
      <Header onSearch={handleSearch} toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow pt-16">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        <div
          className={`fixed left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 md:top-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0`}
        >
          <Sidebar />
        </div>
        <div className="flex-grow flex flex-col">
          <div className="w-full mx-auto md:pl-10 md:pr-10">
            <PostFavoriteList searchText={searchText} />
          </div>
          <ScrollToTop />
        </div>
      </div>
    </div>
  );
};

export default FavoritePosts;
