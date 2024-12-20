import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../API/UserService';

interface CommentAuthorProps {
  authorId: number;
}

interface User {
  id: number;
  login: string;
  profile_picture: string | null;
}

const CommentAuthor: React.FC<CommentAuthorProps> = ({ authorId }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserService.getUserById(authorId);
        setUser(response);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, [authorId]);

  if (!user) {
    return <span>Loading...</span>;
  }

  const handleAuthorClick = () => {
    navigate(`/posts/user/${user.login}`);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleAuthorClick();
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div
        role="button"
        className="w-10 h-10 rounded-full cursor-pointer"
        onClick={handleAuthorClick}
        tabIndex={0}
        onKeyDown={handleKeyPress}
      >
        <img
          src={user.profile_picture || '/images/avatars/default-avatar.png'}
          alt="User avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>
      <div
        role="button"
        className="text-sm text-gray-500 dark:text-white"
        onClick={handleAuthorClick}
        onKeyDown={handleKeyPress}
        tabIndex={0}
      >
        {user.login}
      </div>
    </div>
  );
};

export default CommentAuthor;
