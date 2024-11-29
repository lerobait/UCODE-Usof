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
  // Base URL for category-related API endpoints
  private static baseUrl = 'http://localhost:3000/api/categories';

  // Fetches all categories
  static async getCategories(): Promise<Category[]> {
    try {
      const response: AxiosResponse<{ data: { categories: Category[] } }> =
        await axios.get(this.baseUrl);
      return response.data.data.categories; // Returns an array of categories
    } catch {
      throw new Error('Error loading categories'); // Handles API errors
    }
  }

  // Fetches posts for a specific category with optional filters and pagination
  static async getCategoryPosts(
    categoryId: number, // ID of the category
    page: number, // Current page for pagination
    limit: number, // Number of items per page
    sortBy?: 'likes' | 'date', // Optional sort criterion
    order?: 'ASC' | 'DESC', // Optional sort order
    status?: 'active' | 'inactive', // Optional status filter
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

    // Add optional parameters only if they meet specific conditions
    if (sortBy && sortBy !== 'date') params.sortBy = sortBy;
    if (order && order !== 'DESC') params.order = order;
    if (status) params.status = status;

    try {
      const response: AxiosResponse<{ data: { posts: Post[] } }> =
        await axios.get(`${this.baseUrl}/${categoryId}/posts`, { params });
      return response.data.data.posts; // Returns an array of posts
    } catch {
      throw new Error('Error loading category posts'); // Handles API errors
    }
  }

  // Fetches details of a single category by its ID
  static async getCategory(categoryId: number): Promise<Category> {
    try {
      const response: AxiosResponse<{ data: { category: Category } }> =
        await axios.get(`${this.baseUrl}/${categoryId}`);
      return response.data.data.category; // Returns the category object
    } catch {
      throw new Error('Error loading category'); // Handles API errors
    }
  }

  // Creates a new category
  static async createCategory(category: {
    title: string; // Title of the new category
    description: string; // Description of the new category
  }): Promise<void> {
    try {
      await axios.post(this.baseUrl, category, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Auth token for authorization
        },
      });
    } catch {
      throw new Error('Failed to create category'); // Handles API errors
    }
  }

  // Updates an existing category
  static async updateCategory(
    categoryId: number, // ID of the category to update
    data: { title: string; description: string }, // Updated category data
  ): Promise<void> {
    try {
      await axios.patch(`${this.baseUrl}/${categoryId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Auth token for authorization
        },
      });
    } catch {
      throw new Error('Failed to update category'); // Handles API errors
    }
  }

  // Deletes a category by its ID
  static async deleteCategory(categoryId: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Auth token for authorization
        },
      });
    } catch {
      throw new Error('Failed to delete category'); // Handles API errors
    }
  }
}
