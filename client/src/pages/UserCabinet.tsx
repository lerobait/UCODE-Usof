import React, { useState, useEffect } from 'react';
import UserService from '.././API/UserService';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import UserAvatarChange from '../components/User/UserAvatarChange';
import UserInfoChange from '../components/User/UserInfoChange';
import UserPasswordChange from '../components/User/UserPasswordChange';
import UserDeleteMe from '../components/User/UserDeleteMe';
import { SiTicktick } from 'react-icons/si';
import Snackbar from '@mui/joy/Snackbar';

interface User {
  profile_picture: string;
  login: string;
  full_name: string;
  email: string;
  email_verified: boolean;
}

const UserCabinet: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await UserService.getCurrentUser();
        setUser(currentUser);
      } catch {
        setError('Error loading user data');
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarUpdated = (newAvatarUrl: string) => {
    setUser((prevUser) =>
      prevUser ? { ...prevUser, profile_picture: newAvatarUrl } : prevUser,
    );
    setOpenSnackbar(true);
    setSnackbarMessage('Avatar updated successfully!');
  };

  const handleUserInfoUpdate = (login: string, fullName: string) => {
    setUser((prevUser) =>
      prevUser ? { ...prevUser, login, full_name: fullName } : prevUser,
    );
    setOpenSnackbar(true);
    setSnackbarMessage('User Info updated successfully!');
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Header onSearch={(searchText: string) => console.log(searchText)} />
      <div className="flex flex-grow pt-16">
        <div className="sticky top-16 w-64">
          <Sidebar />
        </div>
        <div className="flex-grow flex flex-col pl-12 pr-12 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8 w-full h-full flex">
            <div className="flex-1 pr-8 border-r border-blue-200 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-blue-500 mt-2 mb-2">
                  Profile Picture
                </h1>
                <div className="mb-6 p-3 bg-blue-100 shadow-lg rounded-lg">
                  <UserAvatarChange
                    currentAvatar={
                      user.profile_picture ||
                      '/images/avatars/default-avatar.png'
                    }
                    onAvatarUpdated={handleAvatarUpdated}
                  />
                </div>
                <h1 className="text-4xl font-bold text-blue-500 mt-2 mb-2">
                  User Info
                </h1>
                <div className="mb-6 p-3 bg-blue-100 shadow-lg rounded-lg">
                  <h1 className="text-3xl font-bold text-gray-600 mb-3">
                    Login:{' '}
                    <span className="text-blue-500 font-semibold">
                      {user.login}
                    </span>
                  </h1>
                  <p className="text-2xl font-bold text-gray-600 mb-3">
                    Full Name:{' '}
                    <span className="text-blue-500 font-semibold">
                      {user.full_name}
                    </span>
                  </p>

                  <UserInfoChange
                    currentUser={user}
                    onSave={handleUserInfoUpdate}
                  />
                </div>
                <h1 className="text-4xl font-bold text-blue-500 mt-2 mb-2">
                  Account Verification
                </h1>
                <div className="mb-6 p-3 bg-blue-100 shadow-lg rounded-lg">
                  <h1 className="text-2x1 font-bold text-gray-600 mb-3">
                    Email:{' '}
                    <span className="text-blue-500 font-semibold">
                      {user.email}
                    </span>
                  </h1>
                  <p className="text-sm text-gray-600 flex items-center">
                    {user.email_verified ? (
                      <span className="text-green-600 font-bold flex items-center">
                        Email Verified
                        <SiTicktick className="ml-2" />
                      </span>
                    ) : (
                      'Email Not Verified'
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <UserDeleteMe />
              </div>
            </div>

            <div className="flex-1 pl-8 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-blue-500 mt-2 mb-2">
                  Password Change
                </h1>
                <UserPasswordChange />
                <div className="mt-8 flex flex-col items-center justify-center">
                  <img
                    src="/images/icons/logo.svg"
                    alt="CodeUnity Logo"
                    className="w-36 h-36"
                  />
                  <h2 className="text-6xl font-bold text-blue-600 mt-4">
                    CodeUnity
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        variant="solid"
        color="success"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openSnackbar}
        onClose={handleSnackbarClose}
        startDecorator={<SiTicktick />}
        autoHideDuration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </div>
  );
};

export default UserCabinet;
