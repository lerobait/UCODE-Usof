import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import PostFavoriteList from '../components/Posts/PostFavoriteList';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import Sidebar from '../components/Sidebar/Sidebar';

const FavoritePosts: React.FC = () => {
  const [searchText, setSearchText] = useState('');

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

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-400">
      <Header onSearch={handleSearch} />
      <div className="flex flex-grow pt-16">
        <div className="sticky top-16 w-64">
          <Sidebar />
        </div>
        <div className="flex-grow flex flex-col pl-8 pr-4">
          <div className="w-full mx-auto pl-20 pr-80">
            <PostFavoriteList searchText={searchText} />
          </div>
          <ScrollToTop />
        </div>
      </div>
    </div>
  );
};

export default FavoritePosts;
