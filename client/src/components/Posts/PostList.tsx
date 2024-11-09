import React, { useEffect, useState, useRef } from 'react';
import PostItem from './PostItem';
import PostFilter from './PostFilter';
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
  image_url?: string | null;
}

const PostList: React.FC<{ searchText: string }> = ({ searchText }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<{
    sortBy: 'likes' | 'date' | undefined;
    order: 'ASC' | 'DESC' | undefined;
    status?: 'active' | 'inactive' | undefined;
  }>({
    sortBy: 'likes',
    order: 'DESC' as 'ASC' | 'DESC',
    status: undefined,
  });
  const lastElement = useRef<HTMLDivElement>(null);

  const [fetchPosts, isLoading, error] = useFetching(async () => {
    const fetchedPosts = await PostService.getAllPosts(
      page,
      limit,
      filter.sortBy,
      filter.order,
      filter.status,
    );
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
    setPage(1);
    fetchPosts();
  }, [filter]);

  const handleFilterChange = (newFilter: {
    sortBy: 'likes' | 'date' | undefined;
    order: 'ASC' | 'DESC' | undefined;
    status?: 'active' | 'inactive' | undefined;
  }) => {
    setPosts([]);
    setFilter((prevFilter) => ({
      ...prevFilter,
      ...newFilter,
      sortBy: newFilter.sortBy ?? prevFilter.sortBy,
      order: newFilter.order ?? prevFilter.order,
    }));
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.content.toLowerCase().includes(searchText.toLowerCase()),
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <PostFilter onFilterChange={handleFilterChange} />
      {filteredPosts.map((post) => (
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
          imageUrl={post.image_url}
        />
      ))}
      <div ref={lastElement} style={{ height: 20 }} />
      {isLoading && <div>Loading more posts...</div>}
    </div>
  );
};

export default PostList;
