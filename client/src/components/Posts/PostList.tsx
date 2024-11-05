import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';
import { useFetching } from '../../hooks/useFetching';
import { getAllPosts } from '../../API/PostService';

interface Post {
  id: number;
  title: string;
  content: string;
  username: string;
  publish_date: string;
  status: string;
  categories?: string[];
  likes_count: number;
  comments_count: number;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetchPosts, isLoading, error] = useFetching(async () => {
    const fetchedPosts = await getAllPosts();
    setPosts(fetchedPosts);
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          title={post.title}
          content={post.content}
          username={post.username || 'Anonymous'}
          date={new Date(post.publish_date).toLocaleDateString()}
          status={post.status}
          categories={
            post.categories || ['JavaScript', 'Backend', 'API', 'Express']
          }
          likeCount={post.likes_count}
          commentCount={post.comments_count}
        />
      ))}
    </div>
  );
};

export default PostList;
