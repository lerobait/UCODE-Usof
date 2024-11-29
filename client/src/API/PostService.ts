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
  status: 'active' | 'inactive';
  likes_count: number;
  replies_count: number;
}

interface PostResponse {
  status: string;
  data: {
    post: Post;
  };
}

export default class PostService {
  // Base URL for API requests
  private static baseUrl = 'http://localhost:3000/api/posts';

  // Fetch all posts with optional filters for sorting, ordering, and status
  static async getAllPosts(
    page: number,
    limit: number,
    sortBy?: 'likes' | 'date',
    order?: 'ASC' | 'DESC',
    status?: 'active' | 'inactive',
  ): Promise<Post[]> {
    // Define request parameters
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

    // Add optional filters to parameters
    if (sortBy && sortBy !== 'likes') params.sortBy = sortBy;
    if (order && order !== 'DESC') params.order = order;
    if (status) params.status = status;

    // Make GET request to fetch posts
    const response: AxiosResponse<{ data: { posts: Post[] } }> =
      await axios.get(this.baseUrl, { params });
    return response.data.data.posts;
  }

  // Fetch a single post by its ID
  static async getPostById(id: number): Promise<Post> {
    // Make GET request to fetch the post
    const response: AxiosResponse<PostResponse> = await axios.get(
      `${this.baseUrl}/${id}`,
    );
    return response.data.data.post;
  }

  // Fetch comments for a specific post with optional filters
  static async getCommentsForPost(
    postId: number,
    page: number,
    limit: number,
    sortBy?: 'likes' | 'date',
    order?: 'ASC' | 'DESC',
    status?: 'active' | 'inactive',
  ): Promise<PostComment[]> {
    // Define request parameters
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

    // Add optional filters to parameters
    if (sortBy && sortBy !== 'likes') params.sortBy = sortBy;
    if (order && order !== 'DESC') params.order = order;
    if (status) params.status = status;

    // Make GET request to fetch comments for the post
    const response: AxiosResponse<{ data: { comments: PostComment[] } }> =
      await axios.get(`${this.baseUrl}/${postId}/comments`, { params });
    return response.data.data.comments;
  }

  // Fetch user's favorite posts with optional sorting and filtering
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

    // Define request parameters
    const params: {
      page: number;
      limit: number;
      sortBy?: 'likes' | 'date';
      order?: 'ASC' | 'DESC';
      status?: 'active' | 'inactive';
    } = { page, limit };

    // Add optional filters to parameters
    if (sortBy && sortBy !== 'date') params.sortBy = sortBy;
    if (order && order !== 'DESC') params.order = order;
    if (status) params.status = status;

    // Make GET request to fetch favorite posts
    const response: AxiosResponse<{ data: { posts: Post[] } }> =
      await axios.get(`${this.baseUrl}/myFavoritePosts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });
    return response.data.data.posts;
  }

  // Fetch categories associated with a specific post
  static async getCategoriesForPost(postId: number): Promise<Category[]> {
    const response: AxiosResponse<{ data: { categories: Category[] } }> =
      await axios.get(`${this.baseUrl}/${postId}/categories`);
    return response.data.data.categories;
  }

  // Fetch likes for a specific post
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

  // Fetch all posts created by the logged-in user with optional filters
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

    if (sortBy && sortBy !== 'date') params.sortBy = sortBy;
    if (order && order !== 'DESC') params.order = order;
    if (status) params.status = status;

    // Make GET request to fetch posts created by the user
    const response: AxiosResponse<{ data: { posts: Post[] } }> =
      await axios.get(`${this.baseUrl}/myPosts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

    return response.data.data.posts;
  }

  // Fetch posts created by another user with optional filters
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

    if (sortBy && sortBy !== 'date') params.sortBy = sortBy;
    if (order && order !== 'DESC') params.order = order;
    if (status) params.status = status;

    // Make GET request to fetch posts of a specific user
    const response: AxiosResponse<{ data: { posts: Post[] } }> =
      await axios.get(`${this.baseUrl}/user/${username}/posts`, {
        params,
      });

    return response.data.data.posts;
  }

  // Create a like on a post with a specific like status ('like' or 'dislike')
  static async createLike(postId: number, likeStatus: 'like' | 'dislike') {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    // Make POST request to create a like on the post
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

  // Delete the like on a specific post
  static async deleteLike(postId: number): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    // Make DELETE request to remove like from the post
    await axios.delete(`${this.baseUrl}/${postId}/like`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Add the post to the user's favorites
  static async addFavorite(postId: number) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    // Make POST request to add post to favorites
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

  // Remove the post from the user's favorites
  static async deleteFavorite(postId: number) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    // Make DELETE request to remove post from favorites
    await axios.delete(`${this.baseUrl}/${postId}/favorite`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Fetch all of the user's favorite posts
  static async getUserFavorites(): Promise<Post[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    // Make GET request to fetch favorite posts
    const response: AxiosResponse<{ data: { favorites: Post[] } }> =
      await axios.get(`${this.baseUrl}/myFavoritePosts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    return response.data.data.favorites;
  }

  // Create a new post by submitting form data
  static async createPost(formData: FormData): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    // Make POST request to create a new post
    await axios.post(`${this.baseUrl}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Deletes a post with the given postId.
  static async deletePost(postId: number): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    // Sends a DELETE request to remove the post
    await axios.delete(`${this.baseUrl}/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Updates a post with the given postId and form data.
  static async updatePost(postId: number, formData: FormData): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    // Sends a PATCH request to update the post
    await axios.patch(`${this.baseUrl}/${postId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Creates a comment on the post with the given postId and content.
  static async createComment(postId: number, content: string) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    // Sends a POST request to create the comment
    const response = await axios.post(
      `${this.baseUrl}/${postId}/comments`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Returns the response data containing the created comment
    return response.data;
  }
}
