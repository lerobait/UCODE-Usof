import React, { useEffect, useState, useRef } from 'react';
import PostItem from './PostItem';
import { useFetching } from '../../hooks/useFetching';
import PostService from '../../API/PostService';
import { useObserver } from '../../hooks/useObserver';

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
  const [page, setPage] = useState(1);
  const [limit] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const lastElement = useRef<HTMLDivElement>(null);

  const [fetchPosts, isLoading, error] = useFetching(async () => {
    const fetchedPosts = await PostService.getAllPosts(page, limit);
    if (fetchedPosts.length < limit) {
      setHasMore(false);
    }

    setPosts((prevPosts) => {
      const newPosts = fetchedPosts.filter(
        (newPost) => !prevPosts.some((prevPost) => prevPost.id === newPost.id),
      );
      return [...prevPosts, ...newPosts];
    });
  });

  useObserver(lastElement, hasMore && !isLoading, isLoading, () => {
    setPage((prevPage) => prevPage + 1);
  });

  useEffect(() => {
    fetchPosts();
  }, [page]);

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
      <div ref={lastElement} style={{ height: 20 }} />
      {isLoading && <div>Loading more posts...</div>}
    </div>
  );
};

export default PostList;
