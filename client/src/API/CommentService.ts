import axios, { AxiosResponse } from 'axios';

export interface CommentReply {
  id: number;
  content: string;
  author_id: number;
  publish_date: string;
  status: 'active' | 'inactive';
  likes_count: number;
  replies_count: number;
}

export default class CommentService {
  // Base URL for comment-related API endpoints
  static baseUrl = 'http://localhost:3000/api/comments';

  // Fetches likes for a specific comment
  static async getLikesForComment(commentId: number) {
    const token = localStorage.getItem('authToken'); // Retrieve the authentication token
    if (!token) {
      throw new Error('User is not authenticated'); // Handle unauthenticated access
    }
    const response = await axios.get(`${this.baseUrl}/${commentId}/like`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include authorization header
      },
    });
    return response.data; // Returns the data for the comment's likes
  }

  // Fetches replies for a specific comment with optional sorting and filtering
  static async getRepliesForComment(
    commentId: number,
    sortBy?: 'likes' | 'date', // Optional sort criterion
    order?: 'ASC' | 'DESC', // Optional sort order
    status?: 'active' | 'inactive', // Optional status filter
  ): Promise<CommentReply[]> {
    const params: {
      sortBy?: 'likes' | 'date';
      order?: 'ASC' | 'DESC';
      status?: 'active' | 'inactive';
    } = {};

    // Add optional parameters only when conditions are met
    if (sortBy && sortBy !== 'likes') params.sortBy = sortBy;
    if (order && order !== 'DESC') params.order = order;
    if (status) params.status = status;

    const response: AxiosResponse<{ data: { replies: CommentReply[] } }> =
      await axios.get(`${this.baseUrl}/${commentId}/replies`, { params });

    return response.data.data.replies; // Returns a list of replies
  }

  // Creates a reply to a specific comment
  static async createReply(
    postId: number, // ID of the post to which the comment belongs
    parentId: number, // ID of the parent comment
    content: string, // Content of the reply
  ): Promise<CommentReply> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const response: AxiosResponse<CommentReply> = await axios.post(
      `${this.baseUrl}/${postId}/replies/${parentId}`,
      { content }, // Reply content payload
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Specify content type
        },
      },
    );
    return response.data; // Returns the created reply
  }

  // Creates a like or dislike for a specific comment
  static async createLike(commentId: number, likeStatus: 'like' | 'dislike') {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const response = await axios.post(
      `${this.baseUrl}/${commentId}/like`,
      { type: likeStatus }, // Specify like or dislike
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data; // Returns the like/dislike status
  }

  // Deletes a like from a specific comment
  static async deleteLike(commentId: number): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    await axios.delete(`${this.baseUrl}/${commentId}/like`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Deletes a specific comment
  static async deleteComment(commentId: number) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    return axios.delete(`${this.baseUrl}/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Updates the content or status of a specific comment
  static async updateComment(
    commentId: number, // ID of the comment to update
    data: { content: string; status: string }, // New content and status
  ) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const response = await axios.patch(`${this.baseUrl}/${commentId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Returns the updated comment data
  }
}
