import React, { useEffect, useState } from 'react';
import Header from '../components/Posts/Header';
import PostMyList from '../components/Posts/PostMyList';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import Sidebar from '../components/Sidebar/Sidebar';
import UserCurrentItem from '../components/User/UserCurrentItem';

const MyPosts: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('User is not authenticated');
    }
  }, []);

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Header onSearch={handleSearch} />
      <div className="flex flex-grow pt-16">
        <div className="sticky top-16 w-64">
          <Sidebar />
        </div>
        <div className="flex-grow flex flex-col pl-8 pr-4">
          <div className="w-full mx-auto pl-20 pr-80">
            <UserCurrentItem />
            <PostMyList searchText={searchText} />
          </div>
          <ScrollToTop />
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
