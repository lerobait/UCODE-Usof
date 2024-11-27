import React, { useEffect, useState, useRef } from 'react';
import PostItem from '../Posts/PostItem';
import PostFilter from '../Posts/PostFilter';
import { useFetching } from '../../hooks/useFetching';
import CategoryService from '../../API/CategoryService';
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

interface CategoryPostsListProps {
  categoryId: number;
  searchText: string;
}

const CategoryPostsList: React.FC<CategoryPostsListProps> = ({
  categoryId,
  searchText,
}) => {
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

  const [fetchCategoryPosts, isLoading, error] = useFetching(async () => {
    const fetchedPosts = await CategoryService.getCategoryPosts(
      categoryId,
      page,
      limit,
      filter.sortBy,
      filter.order,
      filter.status,
    );

    if (page === 1) {
      setPosts(fetchedPosts);
    } else {
      setPosts((prevPosts) => [
        ...prevPosts,
        ...fetchedPosts.filter(
          (newPost) =>
            !prevPosts.some((prevPost) => prevPost.id === newPost.id),
        ),
      ]);
    }

    setHasMore(fetchedPosts.length === limit);
  });

  useObserver(lastElement, hasMore && !isLoading, isLoading, () => {
    setPage((prevPage) => prevPage + 1);
  });

  useEffect(() => {
    fetchCategoryPosts();
  }, [page, filter, categoryId]);

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
    <div className="flex flex-col lg:flex-row-reverse lg:space-x-reverse lg:space-x-6 space-y-6 lg:space-y-0">
      <div className="w-full lg:w-1/4">
        <PostFilter onFilterChange={handleFilterChange} />
      </div>
      
      <div className="w-full lg:w-3/4 space-y-6">
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
    </div>
  );
};

export default CategoryPostsList;
