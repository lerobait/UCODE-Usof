import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import useAuthStore from '../../hooks/useAuthStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useAuthStore();

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem('authToken');
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">CodeUnity</h1>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 rounded-lg py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled
          />
        </div>

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
