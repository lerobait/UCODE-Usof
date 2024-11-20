import React, { useState, useEffect } from 'react';
import UserService from '.././API/UserService';
import Header from '../components/Posts/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import UserAvatarChange from '../components/User/UserAvatarChange';
import UserInfoChange from '../components/User/UserInfoChange';
import UserPasswordChange from '../components/User/UserPasswordChange';
import UserDeleteMe from '../components/User/UserDeleteMe';

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
  };

  const handleUserInfoUpdate = (login: string, fullName: string) => {
    setUser((prevUser) =>
      prevUser ? { ...prevUser, login, full_name: fullName } : prevUser,
    );
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
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8 w-full h-full">
            <h2 className="text-2xl font-semibold mb-4">User Cabinet</h2>

            <div className="mb-6">
              <UserAvatarChange
                currentAvatar={
                  user.profile_picture || '/images/avatars/default-avatar.png'
                }
                onAvatarUpdated={handleAvatarUpdated}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold">Login: {user.login}</h3>
              <p className="text-gray-600">Full Name: {user.full_name}</p>

              <UserInfoChange
                currentUser={user}
                onSave={handleUserInfoUpdate}
              />
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold">Email: {user.email}</h4>
              <p className="text-sm text-gray-600">
                {user.email_verified ? 'Email Verified' : 'Email Not Verified'}
              </p>
            </div>

            <div className="mb-6">
              <UserPasswordChange />
            </div>

            <div className="mb-6">
              <UserDeleteMe />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCabinet;
