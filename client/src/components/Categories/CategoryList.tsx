import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../API/CategoryService';
import { RiPushpinFill } from 'react-icons/ri';
import CircularProgress from '@mui/joy/CircularProgress';

interface CategoriesListProps {
  searchText: string;
}

interface Category {
  id: number;
  title: string;
}

const CategoriesList: React.FC<CategoriesListProps> = ({ searchText }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getCategories();
        setCategories(data);
      } catch {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-400 text-center">
        <div>
          <img
            src="images/icons/error.svg"
            alt="Error Icon"
            className="w-60 h-60 mx-auto mb-4"
          />

          <h1 className="text-4xl text-blue-600 font-bold">
            Something Went Wrong. Please Try Again Later!
          </h1>
        </div>
      </div>
    );
  }

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/category-posts/${categoryId}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent, categoryId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleCategoryClick(categoryId);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mt-6">
      {filteredCategories.map((category) => (
        <div
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          onKeyDown={(event) => handleKeyDown(event, category.id)}
          role="button"
          tabIndex={0}
          className="flex items-center space-x-2 bg-white dark:bg-gray-600 p-4 rounded-lg shadow-lg hover:bg-blue-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <RiPushpinFill className="text-blue-500 text-lg" />
          <span className="text-gray-800 dark:text-white font-medium">
            {category.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CategoriesList;
