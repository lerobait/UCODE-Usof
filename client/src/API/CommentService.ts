import axios from 'axios';

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
}
