import axios, { AxiosResponse } from 'axios';
interface RegisterRequest {
  login: string;
  email: string;
  password: string;
  full_name: string;
  password_confirm: string;
}

interface RegisterResponse {
  message: string;
}

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

  static async register(
    data: RegisterRequest,
  ): Promise<AxiosResponse<RegisterResponse>> {
    const response = await axios.post<RegisterResponse>(
      'http://localhost:3000/api/auth/register',
      data,
    );
    return response;
  }

  static async resetPassword(data: {
    new_password: string;
    confirm_password: string;
    token: string;
  }): Promise<AxiosResponse<void>> {
    const response = await axios.post<void>(
      `http://localhost:3000/api/auth/password-reset/${data.token}`,
      {
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      },
    );
    return response;
  }
}
