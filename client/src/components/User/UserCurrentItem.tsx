import React, { useEffect, useState } from 'react';
import UserService from '../../API/UserService';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import PostCreate from '../Posts/PostCreate';
import { SiTicktick } from 'react-icons/si';
import Snackbar from '@mui/joy/Snackbar';

interface UserCurrentItemProps {
  setUpdateKey: React.Dispatch<React.SetStateAction<number>>;
}

interface User {
  profile_picture: string | null;
  login: string;
  full_name: string;
  rating: number;
}

const UserCurrentItem: React.FC<UserCurrentItemProps> = ({ setUpdateKey }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

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

  const handlePostCreated = () => {
    setUpdateKey((prevKey) => prevKey + 1);
    setSnackbarMessage('Post created successfully!');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-center">
        <div>
          <img
            src="/images/icons/error.svg"
            alt="Error Icon"
            className="w-60 h-60 mx-auto mb-4"
          />

          <h1 className="text-4xl text-blue-600 font-bold">
            Something Went Wrong. Please Try Again Later!
          </h1>
        </div>
      </div>
    );
  }

  const defaultAvatar = '/images/avatars/default-avatar.png';
  const profilePicture = user?.profile_picture || defaultAvatar;
  const normalizedRating = user?.rating ? Math.min(user.rating / 20, 5) : 0;

  return (
    <div className="bg-white dark:bg-gray-600 shadow-lg rounded-lg p-6 mb-8 flex flex-wrap items-center">
      {user && (
        <>
          <div className="flex-shrink-0">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
          </div>
          <div className="ml-3 flex-1">
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
        </>
      )}
      <div className="w-full mt-4 md:ml-auto md:mt-0 md:w-auto">
        <PostCreate onPostCreated={handlePostCreated} />
      </div>

      <Snackbar
        variant="solid"
        color="success"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        startDecorator={<SiTicktick />}
        autoHideDuration={3000}
        key="post-snackbar"
      >
        {snackbarMessage}
      </Snackbar>
    </div>
  );
};

export default UserCurrentItem;
