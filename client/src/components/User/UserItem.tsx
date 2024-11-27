import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserService from '../../API/UserService';
import UserEdit from './UserEdit';
import UserDelete from './UserDelete';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

interface User {
  id: number;
  profile_picture: string | null;
  login: string;
  full_name: string;
  rating: number;
  role: string;
}

const UserItem: React.FC = () => {
  const { login } = useParams<{ login: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!login) return;
      try {
        const userData = await UserService.getUserByLogin(login);
        setUser(userData);
      } catch {
        setError('Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [login]);

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const defaultAvatar = '/images/avatars/default-avatar.png';
  const profilePicture = user?.profile_picture || defaultAvatar;

  const handleRoleUpdate = (newRole: string) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const normalizedRating = user?.rating ? Math.min(user.rating / 20, 5) : 0;

  return (
    <div className="bg-white dark:bg-gray-600 shadow-lg rounded-lg p-6 mb-8 flex flex-wrap items-center justify-between">
      {user && (
        <>
          <div className="flex items-center">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <div className="ml-6">
              <h2 className="text-2xl pl-1 font-semibold text-gray-800 dark:text-white">
                {user.login}
              </h2>
              <p className="text-lg pl-1 text-gray-600 dark:text-white">
                {user.full_name}
              </p>
              <Box className="mt-2" sx={{ '& > legend': { mt: 2 } }}>
                <Rating
                  name="user-rating"
                  value={normalizedRating}
                  precision={0.1}
                  readOnly
                />
              </Box>
            </div>
          </div>
  
          <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-0">
            <UserEdit
              userId={user.id}
              currentRole={user.role}
              onRoleUpdate={handleRoleUpdate}
            />
            <UserDelete userId={user.id} />
          </div>
        </>
      )}
    </div>
  );
};

export default UserItem;
