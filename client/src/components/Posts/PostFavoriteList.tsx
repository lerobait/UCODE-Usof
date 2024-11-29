import React, { useEffect, useState, useRef } from 'react';
import PostItem from './PostItem';
import PostFilter from './PostFilter';
import { useFetching } from '../../hooks/useFetching';
import PostService from '../../API/PostService';
import { useObserver } from '../../hooks/useObserver';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';

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
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<{
    sortBy: 'likes' | 'date' | undefined;
    order: 'ASC' | 'DESC' | undefined;
    status?: 'active' | 'inactive' | undefined;
  }>({
    sortBy: 'date',
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
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-400 text-center">
        <div>
          <img
            src="/images/icons/error.svg"
            alt="Error Icon"
            className="w-60 h-60 mx-auto mb-4"
          />
          <h1 className="text-4xl text-blue-600 font-bold">
            Something Went Wrong. Please Try Again Later!
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row-reverse lg:space-x-reverse lg:space-x-6 space-y-6 lg:space-y-0">
      <div className="w-full lg:w-1/4">
        <PostFilter onFilterChange={handleFilterChange} />
      </div>

      <div className="w-full lg:w-3/4 space-y-6">
        {filteredPosts.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-[80vh] text-center text-gray-500 dark:text-white">
            <h2 className="text-2xl font-semibold mb-4">
              No favorite posts yet
            </h2>
            <p className="text-lg mb-6">
              Add some posts to your favorites, and they will appear here!
            </p>
            <Button
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              onClick={() => navigate('/posts')}
            >
              Explore Posts
            </Button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostItem
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              authorId={post.author_id}
              date={post.publish_date}
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
          ))
        )}
        <div ref={lastElement} style={{ height: 20 }} />
      </div>
    </div>
  );
};

export default PostFavoriteList;
