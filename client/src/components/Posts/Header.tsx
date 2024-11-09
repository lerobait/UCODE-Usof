import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import useAuthStore from '../../hooks/useAuthStore';

const Header: React.FC<{ onSearch: (searchText: string) => void }> = ({
  onSearch,
}) => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const { user, clearUser } = useAuthStore();

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem('authToken');
  };

  const defaultAvatar = 'public/images/avatars/default-avatar.png';

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    onSearch(value);
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      <h1 className="text-2xl font-bold text-blue-600">CodeUnity</h1>

      <div className="flex-1 flex justify-center">
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search"
          className="border border-gray-300 rounded-lg py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full max-w-xs"
        />
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-2">
            <img
              src={user.profile_picture || defaultAvatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        )}

        {user ? (
          <Button
            className="text-blue-600 font-semibold hover:underline"
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button
            className="text-blue-600 font-semibold hover:underline"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
