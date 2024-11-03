import React, { useEffect } from 'react';
import Button from '../components/Common/Button';
import Header from '../components/Posts/Header';
import useAuthStore from '../hooks/useAuthStore';

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

        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800">Post Title</h2>
            <p className="text-gray-600 mt-2">
              This is a short description of the post. It gives an idea of the
              content.
            </p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">Posted by User123</span>
              <Button className="text-blue-500 hover:underline">
                Read More
              </Button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Another Post Title
            </h2>
            <p className="text-gray-600 mt-2">
              Another example of a post. This is a placeholder description.
            </p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">Posted by User456</span>
              <Button className="text-blue-500 hover:underline">
                Read More
              </Button>
            </div>
          </div>
        </div>

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
