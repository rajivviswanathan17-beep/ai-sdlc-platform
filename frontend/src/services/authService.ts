import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    token: string;
  };
}

interface ProfileResponse {
  success: boolean;
  data: {
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      createdAt: string;
    };
  };
}

interface TokenResponse {
  success: boolean;
  data: {
    token: string;
  };
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse['data']> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse['data']> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, userData);
    return response.data.data;
  }

  async getProfile(): Promise<ProfileResponse['data']> {
    const token = localStorage.getItem('token');
    const response = await axios.get<ProfileResponse>(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async refreshToken(): Promise<TokenResponse['data']> {
    const token = localStorage.getItem('token');
    const response = await axios.post<TokenResponse>(
      `${API_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();