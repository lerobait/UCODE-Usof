import React, { useEffect, useState } from 'react';
import CategoryService from '../../API/CategoryService';

interface Category {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

interface CategoryItemProps {
  categoryId: number;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ categoryId }) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const fetchedCategory = await CategoryService.getCategory(categoryId);
        setCategory(fetchedCategory);
      } catch {
        setError('Error loading category data');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      {category && (
        <>
          <h2 className="text-3xl font-semibold text-gray-800">
            {category.title}
          </h2>
          <p className="text-gray-600 mt-4">{category.description}</p>
        </>
      )}
    </div>
  );
};

export default CategoryItem;
