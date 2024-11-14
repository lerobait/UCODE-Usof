import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../API/CategoryService';

interface Category {
  id: number;
  title: string;
}

const CategoriesList: React.FC = () => {
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
        setError('Не удалось загрузить категории');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/category-posts/${categoryId}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent, categoryId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleCategoryClick(categoryId);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-6 mt-6 px-4">
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          onKeyDown={(event) => handleKeyDown(event, category.id)}
          role="button"
          tabIndex={0}
          className="p-6 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg shadow-md text-center text-blue-600 font-semibold text-lg transition-all duration-300 cursor-pointer"
        >
          <h3>{category.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default CategoriesList;
