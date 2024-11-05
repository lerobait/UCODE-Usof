import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';
import { useFetching } from '../../hooks/useFetching';
import PostService from '../../API/PostService';

interface Post {
  id: number;
  title: string;
  content: string;
  username: string;
  publish_date: string;
  author_id: number;
  status: string;
  likes_count: number;
  comments_count: number;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetchPosts, isLoading, error] = useFetching(async () => {
    const fetchedPosts = await PostService.getAllPosts();
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
          id={post.id}
          title={post.title}
          content={post.content}
          authorId={post.author_id}
          date={new Date(post.publish_date).toLocaleDateString()}
          status={post.status}
          likeCount={post.likes_count}
          commentCount={post.comments_count}
        />
      ))}
    </div>
  );
};

export default PostList;
