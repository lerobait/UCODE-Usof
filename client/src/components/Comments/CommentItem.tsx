import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CommentAuthor from './CommentAuthor';
import CommentLike from './CommentLike';
import useAuthStore from '../../hooks/useAuthStore';
import CommentService from '../../API/CommentService';
import { IoMdMore } from 'react-icons/io';
import Button from '../Common/Button';
import CommentDelete from './CommentDelete';
import CommentEdit from './CommentEdit';

dayjs.extend(relativeTime);

interface CommentItemProps {
  id: number;
  content: string;
  authorId: number;
  publishDate: string;
  status: 'active' | 'inactive';
  likeCount: number;
  onCommentDeleted?: (commentId: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  id,
  content,
  authorId,
  publishDate,
  status,
  likeCount,
  onCommentDeleted,
}) => {
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [likeStatus, setLikeStatus] = useState<'like' | 'dislike' | null>(null);

  const { user } = useAuthStore();
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  const toggleActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActionsVisible((prev) => !prev);
  };

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
    <div className="bg-white shadow-md rounded-lg p-4 relative">
      <div className="flex items-center justify-between">
        <CommentAuthor authorId={authorId} />
        {user && user.id === authorId && (
          <div className="absolute top-4 right-4">
            <Button
              onClick={toggleActions}
              className="text-gray-500 hover:text-gray-700 flex items-center justify-center"
            >
              <IoMdMore size={24} />
            </Button>
            {isActionsVisible && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md w-32">
                <CommentEdit
                  commentId={id}
                  initialContent={content}
                  initialStatus={status}
                />
                <CommentDelete
                  commentId={id}
                  onCommentDeleted={() => onCommentDeleted?.(id)}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-gray-600 mt-2">{content}</p>
      <span className="ml-2 text-xs text-gray-400">{status}</span>

      <div className="absolute bottom-4 right-4 text-sm text-gray-500">
        {dayjs(publishDate).fromNow()}
      </div>

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
