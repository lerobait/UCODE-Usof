import React, { useEffect } from 'react';
import Header from '../components/Posts/Header';
import useAuthStore from '../hooks/useAuthStore';
import PostList from '../components/Posts/PostList';

const Posts: React.FC = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('User is not authenticated');
    }
  });

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col">
      <Header />
      <div className="w-full max-w-3xl mx-auto p-6 mt-4">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Posts
        </h1>

        <PostList />

        {!user && (
          <div className="text-center text-gray-500 mt-6">
            Вы можете просматривать посты, но для взаимодействия вам нужно войти
            в систему.
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
