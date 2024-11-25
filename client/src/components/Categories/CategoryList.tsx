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

  if (error) return <div>{error}</div>;

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
          className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-lg hover:bg-blue-100 cursor-pointer"
        >
          <RiPushpinFill className="text-blue-500 text-lg" />
          <span className="text-gray-800 font-medium">{category.title}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoriesList;
