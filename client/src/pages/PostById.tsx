import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostService from '../API/PostService';
import PostItem from '../components/Posts/PostItem';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import CommentList from '../components/Comments/CommentList';
import CommentCreate from '../components/Comments/CommentCreate';
import Snackbar from '@mui/joy/Snackbar';
import { SiTicktick } from 'react-icons/si';

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

const PostById: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [commentsKey, setCommentsKey] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  const handleCommentCreated = () => {
    setOpenSnackbar(true);
    setCommentsKey((prevKey) => prevKey + 1);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const fetchedPost = await PostService.getPostById(Number(id));
        setPost(fetchedPost);
      } catch {
        setError('Error loading post');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return post !== null ? (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-400">
      <Header onSearch={handleSearch} toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow pt-16">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            role="button"
            tabIndex={0}
            onClick={toggleSidebar}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleSidebar();
              }
            }}
          ></div>
        )}
        <div
          className={`fixed left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 md:top-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0`}
        >
          <Sidebar />
        </div>
        <div className="flex-grow flex flex-col">
          <div className="w-full mx-auto md:pl-10 md:pr-10">
            <PostItem
              id={post.id}
              title={post.title}
              content={post.content}
              authorId={post.author_id}
              date={post.publish_date}
              status={post.status}
              likeCount={post.likes_count}
              commentCount={post.comments_count}
              imageUrl={post.image_url}
              onPostDeleted={(deletedPostId: number) => {
                console.log(`Post with id ${deletedPostId} deleted`);
              }}
            />
            <div className="flex justify-between items-center mt-8">
              <h1 className="text-3xl font-bold text-blue-500 dark:text-white">
                Comments
              </h1>
              <CommentCreate
                postId={post.id}
                postStatus={post.status}
                onCommentCreated={handleCommentCreated}
              />
            </div>
            <CommentList
              postId={post.id}
              searchText={searchText}
              key={commentsKey}
            />
          </div>
          <ScrollToTop />
        </div>
      </div>

      <Snackbar
        variant="solid"
        color="success"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        startDecorator={<SiTicktick />}
        autoHideDuration={3000}
      >
        Comment created successfully!
      </Snackbar>
    </div>
  ) : (
    <div>Post not found</div>
  );
};

export default PostById;
