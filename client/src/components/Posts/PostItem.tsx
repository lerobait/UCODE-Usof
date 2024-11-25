import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostService from '../../API/PostService';
import PostAuthor from './PostAuthor';
import Button from '../Common/Button';
import PostCategories from './PostCategories';
import PostLike from './PostLike';
import useAuthStore from '../../hooks/useAuthStore';
import PostFavorite from './PostFavorite';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMdMore } from 'react-icons/io';
import PostDelete from './PostDelete';
import PostEdit from './PostEdit';
import { LiaCommentSolid } from 'react-icons/lia';

dayjs.extend(relativeTime);

interface PostItemProps {
  id: number;
  title: string;
  content: string;
  authorId: number;
  date: string;
  status: string;
  likeCount: number;
  commentCount: number;
  imageUrl?: string | null;
  showActions?: boolean;
  onPostDeleted: (deletedPostId: number) => void;
  onPostUpdated?: () => void;
}

const PostItem: React.FC<PostItemProps> = ({
  id,
  title,
  content,
  authorId,
  date,
  status,
  likeCount,
  commentCount,
  imageUrl,
  showActions = false,
  onPostDeleted,
  onPostUpdated,
}) => {
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [likeStatus, setLikeStatus] = useState<'like' | 'dislike' | null>(null);
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateToPost = () => {
    navigate(`/posts/${id}`);
  };

  const toggleActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActionsVisible((prev) => !prev);
  };

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (user) {
        try {
          const response = await PostService.getLikesForPost(id);
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

  const statusClass =
    status === 'active'
      ? 'text-green-500 border border-green-500 rounded-full px-1 py-0.5 text-sm'
      : status === 'inactive'
        ? 'text-red-500 border border-red-500 rounded-full px-1 py-0.5 text-sm'
        : 'text-gray-500 text-sm';

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length > maxLength) {
      const truncated = content.slice(0, maxLength).trim();
      const lastSpaceIndex = truncated.lastIndexOf(' ');
      return `${truncated.slice(0, lastSpaceIndex)}...`;
    }
    return content;
  };

  const maxLength = 600;
  const shouldTruncate = !/\/posts\/\d+$/.test(location.pathname);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 relative">
      <div className="flex items-center text-gray-500 text-sm">
        <PostAuthor authorId={authorId} />
        <span className="mx-2">•</span>
        <span>{dayjs(date).fromNow()}</span>
      </div>

      {showActions && (
        <div className="absolute top-4 right-4">
          <Button
            onClick={toggleActions}
            className="text-gray-500 hover:text-gray-700 flex items-center justify-center"
          >
            <IoMdMore size={24} />
          </Button>
          {isActionsVisible && (
            <div className="absolute right-3 top-3 mt-2 bg-white shadow-md rounded-md w-32">
              <PostEdit
                postId={id}
                onPostUpdated={() => {
                  setIsActionsVisible(false);
                  onPostUpdated?.();
                }}
              />
              <PostDelete
                postId={id}
                onPostDeleted={() => {
                  setIsActionsVisible(false);
                  onPostDeleted?.(id);
                }}
              />
            </div>
          )}
        </div>
      )}

      <div
        className="cursor-pointer"
        onClick={handleNavigateToPost}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleNavigateToPost();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">{title}</h2>
        <p className="text-gray-600 mt-2">
          {shouldTruncate ? truncateContent(content, maxLength) : content}
        </p>

        {imageUrl && (
          <div className="mt-4 relative w-full h-[500px] overflow-hidden rounded-lg">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-xl scale-150"
              style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>
            <img
              src={imageUrl}
              alt={title}
              className="relative z-10 w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      <PostCategories postId={id} />

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <PostLike
              postId={id}
              initialLikeStatus={likeStatus}
              onLikeStatusChange={handleLikeUpdate}
              currentLikeCount={currentLikeCount}
              postStatus={status}
              authorId={authorId}
            />
          </div>
          <Button
            className="flex items-center text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/posts/${id}`);
            }}
          >
            <LiaCommentSolid className="text-2xl" />
            <span className="mx-2">{commentCount}</span>
          </Button>
          <PostFavorite postId={id} />
        </div>
        <span className={statusClass}>{status}</span>
      </div>
    </div>
  );
};

export default PostItem;
