import React, { useEffect, useState } from 'react';
import PostService from '../../API/PostService';

interface PostCategoriesProps {
  postId: number;
}

const PostCategories: React.FC<PostCategoriesProps> = ({ postId }) => {
  const [categories, setCategories] = useState<{ id: number; title: string }[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-wrap mt-4">
      {categories.map((category) => (
        <span
          key={category.id}
          className="text-sm bg-blue-100 text-blue-500 rounded-full px-2 py-1 mr-2 mb-2"
        >
          {category.title}
        </span>
      ))}
    </div>
  );
};

export default PostCategories;
