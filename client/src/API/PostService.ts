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
}

interface Category {
  id: number;
  title: string;
}

export default class PostService {
  private static baseUrl = 'http://localhost:3000/api/posts';

  static async getAllPosts(): Promise<Post[]> {
    const response: AxiosResponse<{ data: { posts: Post[] } }> =
      await axios.get(`${this.baseUrl}/`);
    return response.data.data.posts;
  }

  static async getCategoriesForPost(postId: number): Promise<Category[]> {
    const response: AxiosResponse<{ data: { categories: Category[] } }> =
      await axios.get(`${this.baseUrl}/${postId}/categories`);
    return response.data.data.categories;
  }

  static async getLikesForPost(postId: number) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const response = await axios.get(`${this.baseUrl}/${postId}/like`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async createLike(postId: number, likeStatus: 'like' | 'dislike') {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const response = await axios.post(
      `${this.baseUrl}/${postId}/like`,
      { type: likeStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  static async deleteLike(postId: number): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    await axios.delete(`${this.baseUrl}/${postId}/like`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
