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
  const [commentsKey, setCommentsKey] = useState(0); // Состояние для обновления списка комментариев

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  const handleCommentCreated = () => {
    setOpenSnackbar(true);
    // Изменение состояния ключа, чтобы принудительно обновить комментарии
    setCommentsKey((prevKey) => prevKey + 1);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

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
    <div className="flex min-h-screen bg-gray-100">
      <Header onSearch={handleSearch} />
      <div className="flex flex-grow pt-16">
        <div className="sticky top-16 w-64">
          <Sidebar />
        </div>
        <div className="flex-grow flex flex-col pl-8 pr-4">
          <div className="w-full mx-auto pl-20 pr-80">
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
              <h1 className="text-3xl font-bold text-blue-500">Comments</h1>
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
