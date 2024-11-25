import React, { useState, useEffect } from 'react';
import PostService from '../../API/PostService';
import Button from '../Common/Button';
import useAuthStore from '../../hooks/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { GoStar, GoStarFill } from 'react-icons/go';
import Modal from '../Modal/Modal';

interface PostFavoriteProps {
  postId: number;
}

const PostFavorite: React.FC<PostFavoriteProps> = ({ postId }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const favorites = await PostService.getUserFavorites();
          if (favorites) {
            const isPostFavorite = favorites.some((post) => post.id === postId);
            setIsFavorite(isPostFavorite);

            localStorage.setItem(
              `favoriteStatus-${user.id}-${postId}`,
              isPostFavorite.toString(),
            );
          } else {
            setIsFavorite(false);
          }
        } catch (error) {
          console.error('Error fetching favorite posts:', error);
        }
      } else {
        setIsFavorite(false);
      }
    };

    if (user) {
      const savedFavoriteStatus = localStorage.getItem(
        `favoriteStatus-${user.id}-${postId}`,
      );
      if (savedFavoriteStatus !== null) {
        setIsFavorite(savedFavoriteStatus === 'true');
      } else {
        fetchFavorites();
      }
    } else {
      setIsFavorite(false);
    }
  }, [postId, user]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }

    try {
      if (isFavorite) {
        await PostService.deleteFavorite(postId);
        setIsFavorite(false);
        localStorage.setItem(`favoriteStatus-${user.id}-${postId}`, 'false');
      } else {
        await PostService.addFavorite(postId);
        setIsFavorite(true);
        localStorage.setItem(`favoriteStatus-${user.id}-${postId}`, 'true');
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button onClick={handleFavoriteToggle} className="flex items-center">
        {isFavorite ? (
          <GoStarFill className="text-yellow-500 hover:text-yellow-600 text-2xl" />
        ) : (
          <GoStar className="text-gray-500 hover:text-yellow-500 text-2xl" />
        )}
      </Button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Authentication Required</h2>
          <p className="mb-4">
            You need to be logged in to add posts to your favorites.
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600"
          >
            Login
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default PostFavorite;
