import React, { useEffect, useState, useRef } from 'react';
import PostItem from './PostItem';
import PostFilter from './PostFilter';
import { useFetching } from '../../hooks/useFetching';
import PostService from '../../API/PostService';
import { useObserver } from '../../hooks/useObserver';
import Snackbar from '@mui/joy/Snackbar';
import { SiTicktick } from 'react-icons/si';
import CircularProgress from '@mui/joy/CircularProgress';

interface PostMyListProps {
  searchText: string;
  updateKey: number;
}

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

const PostMyList: React.FC<PostMyListProps> = ({ searchText, updateKey }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const [updateKeyLocal, setUpdateKeyLocal] = useState(0);
  const [filter, setFilter] = useState<{
    sortBy: 'likes' | 'date' | undefined;
    order: 'ASC' | 'DESC' | undefined;
    status?: 'active' | 'inactive' | undefined;
  }>({
    sortBy: 'likes',
    order: 'DESC',
    status: undefined,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const lastElement = useRef<HTMLDivElement>(null);

  const [fetchMyPosts, isLoading, error] = useFetching(async () => {
    const fetchedPosts = await PostService.getMyPosts(
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
    setPage(1);
    setPosts([]);
    setHasMore(true);
    fetchMyPosts();
  }, [page, filter, updateKey, updateKeyLocal]);

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

  const handlePostDeleted = (deletedPostId: number) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPostId),
    );
    setSnackbarMessage('Post Deleted successfully!');
    setOpenSnackbar(true);
  };

  const handlePostUpdated = () => {
    setUpdateKeyLocal((prev) => prev + 1);
    setSnackbarMessage('Post updated successfully!');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-center">
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
    <div className="space-y-6">
      <PostFilter onFilterChange={handleFilterChange} />
      {filteredPosts.map((post) => (
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
          showActions={true}
          onPostDeleted={handlePostDeleted}
          onPostUpdated={handlePostUpdated}
        />
      ))}

      <Snackbar
        variant="solid"
        color="success"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        startDecorator={<SiTicktick />}
        autoHideDuration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </div>
  );
};

export default PostMyList;
