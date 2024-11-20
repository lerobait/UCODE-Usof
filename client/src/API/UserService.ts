import axios, { AxiosResponse } from 'axios';

interface User {
  id: number;
  login: string;
  role: string;
  full_name: string;
  email: string;
  profile_picture: string;
  rating: number;
  email_verified: boolean;
}

export default class UserService {
  private static baseUrl = 'http://localhost:3000/api/users';

  static async getCurrentUser(): Promise<User> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('User is not authenticated');

      const response: AxiosResponse<{ data: { user: User } }> = await axios.get(
        `${this.baseUrl}/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.data.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw new Error('Error fetching current user');
    }
  }

  static async getUserById(id: number): Promise<User> {
    try {
      const response: AxiosResponse<{ data: { user: User } }> = await axios.get(
        `${this.baseUrl}/${id}`,
      );

      return response.data.data.user;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw new Error('Error fetching user');
    }
  }

  static async getUserByLogin(login: string): Promise<User> {
    try {
      const response: AxiosResponse<{ data: { user: User } }> = await axios.get(
        `${this.baseUrl}/login/${login}`,
      );

      return response.data.data.user;
    } catch (error) {
      console.error(`Error fetching user with login ${login}:`, error);
      throw new Error('Error fetching user');
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const response: AxiosResponse<{ data: { users: User[] } }> =
        await axios.get(this.baseUrl);
      return response.data.data.users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Error fetching users');
    }
  }

  static async changeAvatar(
    formData: FormData,
  ): Promise<{ newAvatarUrl: string }> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('User is not authenticated');

      const response: AxiosResponse<{ newAvatarUrl: string }> =
        await axios.patch(`${this.baseUrl}/avatar`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

      return response.data;
    } catch (error) {
      console.error('Error changing avatar:', error);
      throw new Error('Error changing avatar');
    }
  }

  static async updateCurrentUser(data: {
    login: string;
    full_name: string;
  }): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('User is not authenticated');

      await axios.patch(`${this.baseUrl}/updateMe`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Error updating user');
    }
  }

  static async updateMyPassword(data: {
    currentPassword: string;
    newPassword: string;
    passwordConfirmation: string;
  }): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('User is not authenticated');

    try {
      await axios.patch(`${this.baseUrl}/updateMyPassword`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  static async deleteCurrentUser(): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('User is not authenticated');

      await axios.delete(`${this.baseUrl}/deleteMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Error deleting user');
    }
  }
}
