import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostService from '../API/PostService';
import PostItem from '../components/Posts/PostItem';
import Header from '../components/Posts/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import CommentList from '../components/Comments/CommentList';

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

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('User is not authenticated');
    }
  }, []);

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
            <h2 className="text-xl font-semibold mt-8">Comments</h2>
            <CommentList postId={post.id} searchText={searchText} />
          </div>
          <ScrollToTop />
        </div>
      </div>
    </div>
  ) : (
    <div>Post not found</div>
  );
};

export default PostById;
