import React, { useEffect, useState } from 'react';
import CategoryService from '../../API/CategoryService';
import CategoryDelete from './CategoryDelete';
import CategoryEdit from './CategoryEdit';

interface CategoryItemProps {
  categoryId: string;
}

interface Category {
  id: number;
  title: string;
  description: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ categoryId }) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const fetchedCategory = await CategoryService.getCategory(
          Number(categoryId),
        );
        setCategory(fetchedCategory);
      } catch {
        setError('Error loading category data');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleCategoryUpdated = async () => {
    try {
      const updatedCategory = await CategoryService.getCategory(
        Number(categoryId),
      );
      setCategory(updatedCategory);
    } catch {
      setError('Failed to refresh category data.');
    }
  };

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
          <CategoryEdit
            category={category}
            onCategoryUpdated={handleCategoryUpdated}
          />
          <CategoryDelete categoryId={Number(categoryId)} />
        </>
      )}
    </div>
  );
};

export default CategoryItem;
