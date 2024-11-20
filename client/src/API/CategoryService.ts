import axios, { AxiosResponse } from 'axios';

interface Post {
  id: number;
  title: string;
  content: string;
  username: string;
  publish_date: string;
  author_id: number;
  status: string;
  likes_count: number;
  comments_count: number;
  image_url?: string | null;
}

interface Category {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export default class CategoryService {
  private static baseUrl = 'http://localhost:3000/api/categories';

  static async getCategories(): Promise<Category[]> {
    try {
      const response: AxiosResponse<{ data: { categories: Category[] } }> =
        await axios.get(this.baseUrl);
      return response.data.data.categories;
    } catch {
      throw new Error('Error loading categories');
    }
  }

  static async getCategoryPosts(
    categoryId: number,
    page: number,
    limit: number,
    sortBy?: 'likes' | 'date',
    order?: 'ASC' | 'DESC',
    status?: 'active' | 'inactive',
  ): Promise<Post[]> {
    const params: {
      page: number;
      limit: number;
      sortBy?: 'likes' | 'date';
      order?: 'ASC' | 'DESC';
      status?: 'active' | 'inactive';
    } = {
      page,
      limit,
    };

    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (status) params.status = status;

    try {
      const response: AxiosResponse<{ data: { posts: Post[] } }> =
        await axios.get(`${this.baseUrl}/${categoryId}/posts`, { params });
      return response.data.data.posts;
    } catch {
      throw new Error('Error loading categories');
    }
  }

  static async getCategory(categoryId: number): Promise<Category> {
    try {
      const response: AxiosResponse<{ data: { category: Category } }> =
        await axios.get(`${this.baseUrl}/${categoryId}`);
      return response.data.data.category;
    } catch {
      throw new Error('Error loading category');
    }
  }

  static async createCategory(category: {
    title: string;
    description: string;
  }): Promise<void> {
    try {
      await axios.post(this.baseUrl, category, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
    } catch {
      throw new Error('Failed to create category');
    }
  }
}
