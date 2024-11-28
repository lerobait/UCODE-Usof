import React, { useEffect, useState, useRef } from 'react';
import CommentItem from './CommentItem';
import CommentFilter from './CommentFilter';
import { useFetching } from '../../hooks/useFetching';
import PostService from '../../API/PostService';
import { useObserver } from '../../hooks/useObserver';
import Snackbar from '@mui/joy/Snackbar';
import { SiTicktick } from 'react-icons/si';

interface PostComment {
  id: number;
  content: string;
  author_id: number;
  publish_date: string;
  status: 'active' | 'inactive';
  likes_count: number;
  replies_count: number;
}

const CommentList: React.FC<{ postId: number; searchText: string }> = ({
  postId,
  searchText,
}) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const lastElement = useRef<HTMLDivElement>(null);

  const [fetchComments, isLoading, error] = useFetching(async () => {
    const fetchedComments = await PostService.getCommentsForPost(
      postId,
      1,
      Number.MAX_SAFE_INTEGER,
      filter.sortBy,
      filter.order,
      filter.status,
    );

    const paginatedComments = fetchedComments.slice(
      (page - 1) * limit,
      page * limit,
    );

    if (page === 1) {
      setComments(paginatedComments);
    } else {
      setComments((prevComments) => [
        ...prevComments,
        ...paginatedComments.filter(
          (newComment) =>
            !prevComments.some(
              (prevComment) => prevComment.id === newComment.id,
            ),
        ),
      ]);
    }

    setHasMore(paginatedComments.length === limit);
  });

  useObserver(lastElement, hasMore && !isLoading, isLoading, () => {
    setPage((prevPage) => prevPage + 1);
  });

  useEffect(() => {
    fetchComments();
  }, [page, filter]);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleFilterChange = (newFilter: {
    sortBy: 'likes' | 'date' | undefined;
    order: 'ASC' | 'DESC' | undefined;
    status?: 'active' | 'inactive' | undefined;
  }) => {
    setPage(1);
    setComments([]);
    setHasMore(true);
    setFilter(newFilter);
  };

  const filteredPosts = comments.filter((comments) =>
    comments.content.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleCommentUpdated = (updatedComment: PostComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    );
    setSnackbarMessage('Comment updated successfully!');
    setOpenSnackbar(true);
  };

  const handleCommentDeleted = (commentId: number) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId),
    );
    setSnackbarMessage('Comment Deleted successfully!');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row-reverse lg:space-x-reverse lg:space-x-6 space-y-6 lg:space-y-0">
      <div className="w-full lg:w-1/4">
        <CommentFilter onFilterChange={handleFilterChange} />
      </div>

      <div className="w-full lg:w-3/4 space-y-6">
        {filteredPosts.map((comment) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            content={comment.content}
            authorId={comment.author_id}
            publishDate={comment.publish_date}
            status={comment.status}
            likeCount={comment.likes_count}
            repliesCount={comment.replies_count}
            onCommentDeleted={handleCommentDeleted}
            onCommentUpdated={handleCommentUpdated}
          />
        ))}
        <div ref={lastElement} style={{ height: 20 }} />
        {isLoading && <div>Loading more comments...</div>}

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
    </div>
  );
};

export default CommentList;
