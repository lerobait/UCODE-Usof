import React from 'react';
import PostAuthor from './PostAuthor';
import Button from '../Common/Button';
import PostCategories from './PostCategories';

interface PostItemProps {
  id: number;
  title: string;
  content: string;
  authorId: number;
  date: string;
  status: string;
  likeCount: number;
  commentCount: number;
}

const PostItem: React.FC<PostItemProps> = ({
  id,
  title,
  content,
  authorId,
  date,
  status,
  likeCount,
  commentCount,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <PostAuthor authorId={authorId} />
      <div>
        <span className="text-xs text-gray-400 ml-2">{date}</span>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mt-4">{title}</h2>
      <p className="text-gray-600 mt-2">{content}</p>

      <PostCategories postId={id} />

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
