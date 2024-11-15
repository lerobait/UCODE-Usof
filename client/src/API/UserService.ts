import axios, { AxiosResponse } from 'axios';

interface User {
  id: number;
  login: string;
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
}
