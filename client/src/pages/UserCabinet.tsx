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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-400">
      <Header
        onSearch={(searchText: string) => console.log(searchText)}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex flex-grow pt-16">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={toggleSidebar}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleSidebar();
              }
            }}
          ></div>
        )}
        <div
          className={`fixed left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:relative lg:translate-x-0`}
        >
          <Sidebar />
        </div>
        <div className="flex-grow flex flex-col lg:pl-10 lg:pr-10 lg:mb-8">
          <div className="bg-white dark:bg-gray-600 shadow-lg rounded-lg p-6 lg:mb-8 w-full h-full flex flex-col md:flex-row">
            <div className="flex-1 md:pr-8 border-b md:border-r md:border-b-0 border-blue-200 pb-6 md:pb-0 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-blue-500 dark:text-white mt-2 mb-2">
                  Profile Picture
                </h1>
                <div className="mb-6 p-3 bg-blue-100 dark:bg-gray-400 shadow-lg rounded-lg">
                  <UserAvatarChange
                    currentAvatar={
                      user.profile_picture ||
                      '/images/avatars/default-avatar.png'
                    }
                    onAvatarUpdated={handleAvatarUpdated}
                  />
                </div>
                <h1 className="text-4xl font-bold text-blue-500 dark:text-white mt-2 mb-2">
                  User Info
                </h1>
                <div className="mb-6 p-3 bg-blue-100 dark:bg-gray-400 shadow-lg rounded-lg">
                  <h1 className="text-3xl font-bold text-gray-600 dark:text-gray-800 mb-3">
                    Login:{' '}
                    <span className="text-blue-600 font-semibold">
                      {user.login}
                    </span>
                  </h1>
                  <p className="text-2xl font-bold text-gray-600 dark:text-gray-800 mb-3">
                    Full Name:{' '}
                    <span className="text-blue-600 font-semibold">
                      {user.full_name}
                    </span>
                  </p>

                  <UserInfoChange
                    currentUser={user}
                    onSave={handleUserInfoUpdate}
                  />
                </div>
                <h1 className="text-4xl font-bold text-blue-500 dark:text-white mt-2 mb-2">
                  Account Verification
                </h1>
                <div className="mb-6 p-3 bg-blue-100 dark:bg-gray-400 shadow-lg rounded-lg">
                  <h1 className="text-2xl font-bold text-gray-600 dark:text-gray-800 mb-3">
                    Email:{' '}
                    <span className="text-blue-600 font-semibold">
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

            <div className="flex-1 md:pl-8 flex flex-col justify-between mt-6 md:mt-0">
              <div>
                <h1 className="text-4xl font-bold text-blue-500 dark:text-white mt-2 mb-2">
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
