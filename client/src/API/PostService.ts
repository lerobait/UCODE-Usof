import axios, { AxiosResponse } from 'axios';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export default class PostService {
  static async getAll(
    limit: number = 10,
    page: number = 1,
  ): Promise<AxiosResponse<Post[]>> {
    const response = await axios.get<Post[]>(
      'https://jsonplaceholder.typicode.com/posts',
      {
        params: {
          _limit: limit,
          _page: page,
        },
      },
    );
    return response;
  }

  static async getById(id: number): Promise<AxiosResponse<Post>> {
    const response = await axios.get<Post>(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
    );
    return response;
  }

  static async getCommentsByPostId(
    id: number,
  ): Promise<AxiosResponse<Comment[]>> {
    const response = await axios.get<Comment[]>(
      `https://jsonplaceholder.typicode.com/posts/${id}/comments`,
    );
    return response;
  }
}
