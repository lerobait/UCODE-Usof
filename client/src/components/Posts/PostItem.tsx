import React from 'react';
import Button from '../Common/Button';

interface PostItemProps {
  title: string;
  content: string;
  username: string;
  date: string;
  status: string;
  categories: string[];
  likeCount: number;
  commentCount: number;
}

const PostItem: React.FC<PostItemProps> = ({
  title,
  content,
  username,
  date,
  status,
  categories,
  likeCount,
  commentCount,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-4">
        <img
          src="/images/avatars/default-avatar.png"
          alt="User avatar"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <span className="text-sm text-gray-500">{username}</span>
          <span className="text-xs text-gray-400 ml-2">{date}</span>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mt-4">{title}</h2>
      <p className="text-gray-600 mt-2">{content}</p>

      <div className="flex flex-wrap mt-4">
        {categories.map((category, index) => (
          <span
            key={index}
            className="text-sm bg-blue-100 text-blue-500 rounded-full px-2 py-1 mr-2 mb-2"
          >
            {category}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">{status}</span>
        <div className="flex items-center space-x-4">
          <Button className="text-blue-500 hover:underline">
            Add to Favorites
          </Button>
          <Button className="text-gray-500 hover:text-gray-700">
            👍 {likeCount}
          </Button>
          <Button className="text-gray-500 hover:text-gray-700">
            💬 {commentCount}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
