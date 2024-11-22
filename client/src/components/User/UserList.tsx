import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../API/UserService';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

interface User {
  id: number;
  login: string;
  profile_picture: string | null;
  rating: number;
}

interface UserListProps {
  searchText: string;
}

const UserList: React.FC<UserListProps> = ({ searchText }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.login.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleUserClick = (login: string) => {
    navigate(`/posts/user/${login}`);
  };

  return (
    <div className="grid grid-cols-4 gap-6 mt-6 px-4">
      {filteredUsers.map((user) => {
        const normalizedRating = user.rating
          ? Math.min(user.rating / 20, 5)
          : 0;

        return (
          <div
            key={user.id}
            onClick={() => handleUserClick(user.login)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleUserClick(user.login);
              }
            }}
            role="button"
            tabIndex={0}
            className="p-6 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg shadow-md text-center transition-all duration-300 cursor-pointer"
          >
            <img
              src={user.profile_picture || '/images/avatars/default-avatar.png'}
              alt={`${user.login} avatar`}
              className="w-16 h-16 mx-auto rounded-full mb-4"
            />
            <h3 className="text-lg font-semibold">{user.login}</h3>
            <Box sx={{ '& > legend': { mt: 2 } }}>
              <Rating
                name={`rating-${user.id}`}
                value={normalizedRating}
                precision={0.1}
                readOnly
              />
            </Box>
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
