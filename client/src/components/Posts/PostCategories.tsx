import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostService from '../../API/PostService';
import Button from '../Common/Button';

interface PostCategoriesProps {
  postId: number;
}

const PostCategories: React.FC<PostCategoriesProps> = ({ postId }) => {
  const [categories, setCategories] = useState<{ id: number; title: string }[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories =
          await PostService.getCategoriesForPost(postId);
        setCategories(fetchedCategories);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [postId]);

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/category-posts/${categoryId}`);
  };

  const handleKeyPress = (event: React.KeyboardEvent, categoryId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      navigate(`/category-posts/${categoryId}`);
    }
  };

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-wrap mt-4">
      {categories.map((category) => (
        <Button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          onKeyDown={(e) => handleKeyPress(e, category.id)}
          className="text-sm bg-blue-100 text-blue-500 rounded-full px-2 py-1 mr-2 mb-2 cursor-pointer hover:bg-blue-200 transition-colors duration-200"
          role="link"
          tabIndex={0}
        >
          {category.title}
        </Button>
      ))}
    </div>
  );
};

export default PostCategories;
