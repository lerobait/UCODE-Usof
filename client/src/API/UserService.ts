import axios, { AxiosResponse } from 'axios';
import useAuthStore from '../hooks/useAuthStore';

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

  // Fetches the current authenticated user
  static async getCurrentUser(): Promise<User> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('User is not authenticated');

      // Sends a GET request to retrieve the current user data
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

  // Fetches a user by their unique ID
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

  // Fetches a user by their login
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

  // Fetches a list of all users
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

  // Changes the avatar of the current user
  static async changeAvatar(
    formData: FormData,
  ): Promise<{ newAvatarUrl: string }> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('User is not authenticated');

      // Sends a PATCH request to update the avatar
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

  // Updates the current user's profile information
  static async updateCurrentUser(data: {
    login: string;
    full_name: string;
  }): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('User is not authenticated');

      // Sends a PATCH request to update the user's details
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

  // Updates the current user's password
  static async updateMyPassword(data: {
    currentPassword: string;
    newPassword: string;
    passwordConfirmation: string;
  }): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('User is not authenticated');

    try {
      // Sends a PATCH request to update the password
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

      // Sends a DELETE request to delete the current user
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

  static async updateUserRole(userId: number, role: string): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('User is not authenticated');

    // Sends a PATCH request to update the role of a user
    await axios.patch(
      `${this.baseUrl}/admin/${userId}`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  static async getUserByAdmin(userId: number): Promise<User> {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('User is not authenticated');

    // Checks if the current user is an admin before proceeding
    const currentUser = useAuthStore.getState().user;
    if (currentUser?.role !== 'admin') {
      throw new Error('Only admins can access this information');
    }

    // Sends a GET request to fetch a user by ID, accessible only by admins
    const response = await axios.get(`${this.baseUrl}/admin/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data.user;
  }

  static async deleteUser(userId: number): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('User is not authenticated');

      // Sends a DELETE request to delete a user by ID
      await axios.delete(`${this.baseUrl}/admin/${userId}`, {
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
