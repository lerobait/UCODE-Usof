import React, { useEffect, useState } from 'react';
import UserService from '../../API/UserService';

interface User {
  profile_picture: string | null;
  login: string;
  full_name: string;
  rating: number;
}

const UserCurrentItem: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await UserService.getCurrentUser();
        setUser(currentUser);
      } catch {
        setError('Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const defaultAvatar = '/images/avatars/default-avatar.png';
  const profilePicture = user?.profile_picture || defaultAvatar;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8 flex items-center">
      {user && (
        <>
          <img
            src={profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          <div className="ml-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.login}
            </h2>
            <p className="text-lg text-gray-600">{user.full_name}</p>
            <p className="text-sm text-gray-500 mt-2">Rating: {user.rating}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default UserCurrentItem;
