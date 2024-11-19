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
  image_url: string | null;
}

interface Category {
  id: number;
  title: string;
}

export interface PostComment {
  id: number;
  content: string;
  author_id: number;
  publish_date: string;
  status: string;
  likes_count: number;
}

interface PostResponse {
  status: string;
  data: {
    post: Post;
  };
}

export default class PostService {
  private static baseUrl = 'http://localhost:3000/api/posts';

  static async getAllPosts(
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

    if (sortBy && sortBy !== 'likes') params.sortBy = sortBy;
    if (order && order !== 'DESC') params.order = order;
    if (status) params.status = status;

    const response: AxiosResponse<{ data: { posts: Post[] } }> =
      await axios.get(this.baseUrl, { params });
    return response.data.data.posts;
  }

  static async getPostById(id: number): Promise<Post> {
    const response: AxiosResponse<PostResponse> = await axios.get(
      `${this.baseUrl}/${id}`,
    );
    return response.data.data.post;
  }

  static async getCommentsForPost(
    postId: number,
    page: number,
    limit: number,
    sortBy?: 'likes' | 'date',
    order?: 'ASC' | 'DESC',
    status?: 'active' | 'inactive',
  ): Promise<PostComment[]> {
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

    if (sortBy && sortBy !== 'likes') params.sortBy = sortBy;
    if (order && order !== 'DESC') params.order = order;
    if (status) params.status = status;

    const response: AxiosResponse<{ data: { comments: PostComment[] } }> =
      await axios.get(`${this.baseUrl}/${postId}/comments`, { params });
    return response.data.data.comments;
  }

  static async getUserFavoritePosts(
    page: number,
    limit: number,
    sortBy?: 'likes' | 'date',
    order?: 'ASC' | 'DESC',
    status?: 'active' | 'inactive',
  ): Promise<Post[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const params: {
      page: number;
      limit: number;
      sortBy?: 'likes' | 'date';
      order?: 'ASC' | 'DESC';
      status?: 'active' | 'inactive';
    } = { page, limit };

    if (sortBy && sortBy !== 'likes') params.sortBy = sortBy;
    if (order && order !== 'DESC') params.order = order;
    if (status) params.status = status;

    const response: AxiosResponse<{ data: { posts: Post[] } }> =
      await axios.get(`${this.baseUrl}/myFavoritePosts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });
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

  static async getMyPosts(
    page: number,
    limit: number,
    sortBy?: 'likes' | 'date',
    order?: 'ASC' | 'DESC',
    status?: 'active' | 'inactive',
  ): Promise<Post[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const params: {
      page: number;
      limit: number;
      sortBy?: 'likes' | 'date';
      order?: 'ASC' | 'DESC';
      status?: 'active' | 'inactive';
    } = { page, limit };

    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (status) params.status = status;

    const response: AxiosResponse<{ data: { posts: Post[] } }> =
      await axios.get(`${this.baseUrl}/myPosts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

    return response.data.data.posts;
  }

  static async getUserPosts(
    username: string,
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

    const response: AxiosResponse<{ data: { posts: Post[] } }> =
      await axios.get(`${this.baseUrl}/user/${username}/posts`, {
        params,
      });

    return response.data.data.posts;
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

  static async addFavorite(postId: number) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    await axios.post(
      `${this.baseUrl}/${postId}/favorite`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  static async deleteFavorite(postId: number) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    await axios.delete(`${this.baseUrl}/${postId}/favorite`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static async getUserFavorites(): Promise<Post[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const response: AxiosResponse<{ data: { favorites: Post[] } }> =
      await axios.get(`${this.baseUrl}/myFavoritePosts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    return response.data.data.favorites;
  }

  static async createPost(formData: FormData): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    await axios.post(`${this.baseUrl}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static async deletePost(postId: number): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    await axios.delete(`${this.baseUrl}/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static async updatePost(postId: number, formData: FormData): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    await axios.patch(`${this.baseUrl}/${postId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}
