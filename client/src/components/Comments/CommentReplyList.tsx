import { useEffect, useState } from 'react';
import CommentItem from './CommentItem';
import CommentService from '../../API/CommentService';
import Snackbar from '@mui/joy/Snackbar';
import { SiTicktick } from 'react-icons/si';
import CommentReplyCreate from './CommentReplyCreate';

interface RepliesListProps {
  commentId: number;
  postId: number;
  status: 'active' | 'inactive';
}

interface CommentReply {
  id: number;
  content: string;
  author_id: number;
  publish_date: string;
  status: 'active' | 'inactive';
  likes_count: number;
  replies_count: number;
}

const RepliesList: React.FC<RepliesListProps> = ({
  commentId,
  postId,
  status,
}) => {
  const [replies, setReplies] = useState<CommentReply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fetchReplies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await CommentService.getRepliesForComment(commentId);
      setReplies(response);
    } catch {
      setError('Failed to fetch replies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [commentId]);

  const handleCommentUpdated = (updatedComment: CommentReply) => {
    setReplies((prevComments) =>
      prevComments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    );
    setSnackbarMessage('Comment updated successfully!');
    setOpenSnackbar(true);
  };

  const handleCommentDeleted = (commentId: number) => {
    setReplies((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId),
    );
    setSnackbarMessage('Comment Deleted successfully!');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleReplyCreated = () => {
    fetchReplies();
    setSnackbarMessage('Reply created successfully!');
    setOpenSnackbar(true);
  };

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-500 dark:text-white">
          Replies
        </h1>
        <CommentReplyCreate
          commentId={commentId}
          postId={postId}
          status={status}
          onReplyCreated={handleReplyCreated}
        />
      </div>
      {isLoading ? (
        <div>Loading replies...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : replies.length > 0 ? (
        replies.map((reply) => (
          <div className="my-2" key={reply.id}>
            <CommentItem
              key={reply.id}
              id={reply.id}
              postId={postId}
              content={reply.content}
              authorId={reply.author_id}
              publishDate={reply.publish_date}
              status={reply.status}
              likeCount={reply.likes_count}
              repliesCount={reply.replies_count}
              onCommentDeleted={handleCommentDeleted}
              onCommentUpdated={handleCommentUpdated}
              isReply={true}
            />
          </div>
        ))
      ) : (
        <div>No replies available.</div>
      )}
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

export default RepliesList;
