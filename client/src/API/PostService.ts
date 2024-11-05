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
}
