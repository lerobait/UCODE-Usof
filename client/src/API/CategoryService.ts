import axios from 'axios';

interface CategoryResponse {
  status: string;
  results: number;
  data: {
    categories: {
      id: number;
      title: string;
      description: string;
      created_at: string;
    }[];
  };
}

export const getCategories = async () => {
  try {
    const response = await axios.get<CategoryResponse>(
      'http://localhost:3000/api/categories',
    );
    return response.data.data.categories;
  } catch (error) {
    throw new Error('Ошибка при загрузке категорий');
  }
};
