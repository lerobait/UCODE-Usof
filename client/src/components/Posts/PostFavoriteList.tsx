// components/Posts/PostFavoriteList.tsx
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

const PostFavoriteList: React.FC<{ searchText: string }> = ({ searchText }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<{
    sortBy: 'likes' | 'date' | undefined;
    order: 'ASC' | 'DESC' | undefined;
    status?: 'active' | 'inactive' | undefined;
  }>({
    sortBy: 'likes',
    order: 'DESC',
    status: undefined,
  });
  const lastElement = useRef<HTMLDivElement>(null);

  const [fetchPosts, isLoading, error] = useFetching(async () => {
    const fetchedPosts = await PostService.getUserFavoritePosts(
      page,
      limit,
      filter.sortBy,
      filter.order,
      filter.status,
    );

    const paginatedPosts = fetchedPosts.slice((page - 1) * limit, page * limit);

    if (page === 1) {
      setPosts(paginatedPosts);
    } else {
      setPosts((prevPosts) => [
        ...prevPosts,
        ...paginatedPosts.filter(
          (newPost) =>
            !prevPosts.some((prevPost) => prevPost.id === newPost.id),
        ),
      ]);
    }

    setHasMore(paginatedPosts.length === limit);
  });

  useObserver(lastElement, hasMore && !isLoading, isLoading, () => {
    setPage((prevPage) => prevPage + 1);
  });

  useEffect(() => {
    fetchPosts();
  }, [page, filter]);

  const handleFilterChange = (newFilter: {
    sortBy: 'likes' | 'date' | undefined;
    order: 'ASC' | 'DESC' | undefined;
    status?: 'active' | 'inactive' | undefined;
  }) => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    setFilter(newFilter);
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
          onPostDeleted={(deletedPostId) => {
            setPosts((prevPosts) =>
              prevPosts.filter((p) => p.id !== deletedPostId),
            );
          }}
        />
      ))}
      <div ref={lastElement} style={{ height: 20 }} />
      {isLoading && <div>Loading more posts...</div>}
    </div>
  );
};

export default PostFavoriteList;
