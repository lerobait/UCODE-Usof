import React, { useEffect, useState } from 'react';
import { getUserById } from '../../API/UserService';

interface PostAuthorProps {
  authorId: number;
}

interface User {
  id: number;
  login: string;
  profile_picture: string | null;
}

const PostAuthor: React.FC<PostAuthorProps> = ({ authorId }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(authorId);
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, [authorId]);

  if (!user) {
    return <span>Loading...</span>;
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={user.profile_picture || '/images/avatars/default-avatar.png'}
        alt="User avatar"
        className="w-12 h-12 rounded-full"
      />
      <span className="text-sm text-gray-500">{user.login}</span>
    </div>
  );
};

export default PostAuthor;
