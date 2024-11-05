import React from 'react';
import PostItem from './PostItem';

const posts = [
  {
    title: 'First Post',
    content: 'This is the content of the first post.',
    username: 'User123',
    date: '2023-11-05',
    status: 'Active',
    categories: ['React', 'TypeScript', 'Frontend', 'Vite'],
    likeCount: 10,
    commentCount: 5,
  },
  {
    title: 'Second Post',
    content: 'Another example of a post content.',
    username: 'User456',
    date: '2023-11-04',
    status: 'Active',
    categories: ['JavaScript', 'Backend', 'API', 'Express'],
    likeCount: 8,
    commentCount: 3,
  },
];

const PostList: React.FC = () => {
  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <PostItem key={index} {...post} />
      ))}
    </div>
  );
};

export default PostList;
