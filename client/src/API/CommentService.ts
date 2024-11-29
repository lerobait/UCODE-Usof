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
  static baseUrl = 'http://localhost:3000/api/comments';

  static async getLikesForComment(commentId: number) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const response = await axios.get(`${this.baseUrl}/${commentId}/like`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async getRepliesForComment(
    commentId: number,
    sortBy?: 'likes' | 'date',
    order?: 'ASC' | 'DESC',
    status?: 'active' | 'inactive',
  ): Promise<CommentReply[]> {
    const params: {
      sortBy?: 'likes' | 'date';
      order?: 'ASC' | 'DESC';
      status?: 'active' | 'inactive';
    } = {};

    if (sortBy && sortBy !== 'likes') params.sortBy = sortBy;
    if (order && order !== 'DESC') params.order = order;
    if (status) params.status = status;

    const response: AxiosResponse<{ data: { replies: CommentReply[] } }> =
      await axios.get(`${this.baseUrl}/${commentId}/replies`, {
        params,
      });

    return response.data.data.replies;
  }

  static async createReply(
    postId: number,
    parentId: number,
    content: string,
  ): Promise<CommentReply> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const response: AxiosResponse<CommentReply> = await axios.post(
      `${this.baseUrl}/${postId}/replies/${parentId}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  }

  static async createLike(commentId: number, likeStatus: 'like' | 'dislike') {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const response = await axios.post(
      `${this.baseUrl}/${commentId}/like`,
      { type: likeStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

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

  static async updateComment(
    commentId: number,
    data: { content: string; status: string },
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
    return response.data;
  }
}
