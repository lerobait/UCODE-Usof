import React, { useEffect, useState } from 'react';
import CategoryService from '../../API/CategoryService';
import Button from '../Common/Button';

interface Category {
  id: number;
  title: string;
}

interface CategorySelectorProps {
  selectedCategories: string[];

  onCategorySelect: (
    categoryId: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  onCategorySelect,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await CategoryService.getCategories();
        setCategories(categoriesData);
        setFilteredCategories(categoriesData);
      } catch {
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.title.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredCategories(filtered);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}

      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search categories..."
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div
        className="grid grid-cols-3 gap-2 overflow-y-auto"
        style={{ maxHeight: '60px' }}
      >
        {filteredCategories.map((category) => (
          <Button
            key={category.id}
            className={`${
              selectedCategories.includes(String(category.id))
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-blue-300'
            } py-1 px-2 rounded-full text-center text-xs whitespace-nowrap`}
            style={{
              minWidth: '25px',
              height: '25px',
              fontSize: '12px',
            }}
            onClick={(e) => onCategorySelect(String(category.id), e)}
          >
            {category.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
