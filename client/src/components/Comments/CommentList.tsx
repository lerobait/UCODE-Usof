import React, { useEffect, useState, useRef } from 'react';
import CommentItem from './CommentItem';
import CommentFilter from './CommentFilter';
import { useFetching } from '../../hooks/useFetching';
import PostService from '../../API/PostService';
import { useObserver } from '../../hooks/useObserver';

interface PostComment {
  id: number;
  content: string;
  author_id: number;
  publish_date: string;
  status: 'active' | 'inactive';
  likes_count: number;
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

  const handleCommentDeleted = (commentId: number) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId),
    );
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <CommentFilter onFilterChange={handleFilterChange} />
      {filteredPosts.map((comment) => (
        <CommentItem
          key={comment.id}
          id={comment.id}
          content={comment.content}
          authorId={comment.author_id}
          publishDate={comment.publish_date}
          status={comment.status}
          likeCount={comment.likes_count}
          onCommentDeleted={handleCommentDeleted}
        />
      ))}
      <div ref={lastElement} style={{ height: 20 }} />
      {isLoading && <div>Loading more comments...</div>}
    </div>
  );
};

export default CommentList;
