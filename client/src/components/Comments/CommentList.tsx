import { useEffect, useState } from 'react';
import CommentItem from './CommentItem';
import PostService from '../../API/PostService';

interface PostComment {
  id: number;
  content: string;
  author_id: number;
  publish_date: string;
  status: string;
  likes_count: number;
}

const CommentList: React.FC<{ postId: number }> = ({ postId }) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const fetchedComments = await PostService.getCommentsForPost(postId);
        setComments(fetchedComments);
      } catch {
        setError('Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div>{error}</div>;
  if (comments.length === 0) return <div>No comments found</div>;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          id={comment.id}
          content={comment.content}
          authorId={comment.author_id}
          publishDate={comment.publish_date}
          status={comment.status}
          likeCount={comment.likes_count}
        />
      ))}
    </div>
  );
};

export default CommentList;
