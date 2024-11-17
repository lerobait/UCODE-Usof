import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CommentAuthor from './CommentAuthor';
import CommentLike from './CommentLike';
import useAuthStore from '../../hooks/useAuthStore';
import CommentService from '../../API/CommentService';

dayjs.extend(relativeTime);

interface CommentItemProps {
  id: number;
  content: string;
  authorId: number;
  publishDate: string;
  status: string;
  likeCount: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  id,
  content,
  authorId,
  publishDate,
  status,
  likeCount,
}) => {
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [likeStatus, setLikeStatus] = useState<'like' | 'dislike' | null>(null);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (user) {
        try {
          const response = await CommentService.getLikesForComment(id);
          const userLike = response.data.likes.find(
            (like: { author_id: number; type: string }) =>
              like.author_id === user.id,
          );
          if (userLike) {
            setLikeStatus(userLike.type === 'like' ? 'like' : 'dislike');
          }
        } catch (error) {
          console.error('Error fetching like status:', error);
        }
      }
    };

    fetchLikeStatus();
  }, [id, user]);

  const handleLikeUpdate = (newStatus: 'like' | 'dislike' | null) => {
    if (newStatus === 'like') {
      if (likeStatus === 'dislike') {
        setCurrentLikeCount((prevCount) => prevCount + 1);
      } else if (likeStatus === 'like') {
        setCurrentLikeCount((prevCount) => prevCount - 1);
      } else {
        setCurrentLikeCount((prevCount) => prevCount + 1);
      }
    } else if (newStatus === 'dislike') {
      if (likeStatus === 'like') {
        setCurrentLikeCount((prevCount) => prevCount - 1);
      }
    } else {
      if (likeStatus === 'like') {
        setCurrentLikeCount((prevCount) => prevCount - 1);
      }
    }

    setLikeStatus(newStatus);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center justify-between">
        <CommentAuthor authorId={authorId} />
        <div>
          <span className="text-sm text-gray-500">
            {dayjs(publishDate).fromNow()}
          </span>
        </div>
      </div>
      <p className="text-gray-600 mt-2">{content}</p>
      <span className="ml-2 text-xs text-gray-400">{status}</span>

      <CommentLike
        commentId={id}
        initialLikeStatus={likeStatus}
        onLikeStatusChange={handleLikeUpdate}
        currentLikeCount={currentLikeCount}
        commentStatus={status}
      />
    </div>
  );
};

export default CommentItem;
