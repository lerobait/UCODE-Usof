import React, { useEffect, useState } from 'react';
import { getCategories } from '../../API/CategoryService';

interface Category {
  id: number;
  title: string;
}

const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        setError('Не удалось загрузить категории');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-4 gap-6 mt-6 px-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="p-6 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg shadow-md text-center text-blue-600 font-semibold text-lg transition-all duration-300"
        >
          <h3>{category.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default CategoriesList;
