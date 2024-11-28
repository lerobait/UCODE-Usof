import React, { useEffect, useState } from 'react';
import CategoryService from '../../API/CategoryService';
import CategoryDelete from './CategoryDelete';
import CategoryEdit from './CategoryEdit';
import Snackbar from '@mui/joy/Snackbar';
import { SiTicktick } from 'react-icons/si';

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
      setSnackbarOpen(true);
    } catch {
      setError('Failed to refresh category data.');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-600 shadow-lg rounded-lg p-6 mb-8 flex justify-between items-start">
      {category && (
        <>
          <div className="flex-1">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
              {category.title}
            </h2>
            <p className="text-gray-600 dark:text-white mt-4">
              {category.description}
            </p>
          </div>

          <div className="flex flex-wrap justify-end items-center gap-4 mt-4">
            <CategoryEdit
              category={category}
              onCategoryUpdated={handleCategoryUpdated}
            />
            <CategoryDelete categoryId={Number(categoryId)} />
          </div>
        </>
      )}
      <Snackbar
        variant="solid"
        color="success"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        startDecorator={<SiTicktick />}
        autoHideDuration={3000}
      >
        Category updated successfully!
      </Snackbar>
    </div>
  );
};

export default CategoryItem;
