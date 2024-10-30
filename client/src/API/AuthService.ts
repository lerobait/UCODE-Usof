import axios, { AxiosResponse } from 'axios';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    login: string;
    email: string;
  };
}

interface LoginRequest {
  login: string;
  email: string;
  password: string;
}

interface ForgotPasswordRequest {
  email: string;
}

export default class PostAuth {
  static async login(
    data: LoginRequest,
  ): Promise<AxiosResponse<LoginResponse>> {
    const response = await axios.post<LoginResponse>(
      'http://localhost:3000/api/auth/login',
      data,
    );
    return response;
  }

  static async forgotPassword(
    data: ForgotPasswordRequest,
  ): Promise<AxiosResponse<void>> {
    const response = await axios.post<void>(
      'http://localhost:3000/api/auth/password-reset',
      data,
    );
    return response;
  }
}
