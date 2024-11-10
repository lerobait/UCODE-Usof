import React, { useEffect, useState } from 'react';
import Header from '../components/Posts/Header';
import useAuthStore from '../hooks/useAuthStore';
import PostList from '../components/Posts/PostList';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';

const Posts: React.FC = () => {
  const { user } = useAuthStore();
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
    <div className="flex min-h-screen bg-gray-100 flex-col pt-16">
      <Header onSearch={handleSearch} />
      <div className="w-full max-w-3xl mx-auto p-6 mt-4">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Posts
        </h1>
        <PostList searchText={searchText} />
        {!user && (
          <div className="text-center text-gray-500 mt-6">
            Вы можете просматривать посты, но для взаимодействия вам нужно войти
            в систему.
          </div>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
};

export default Posts;
