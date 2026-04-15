import axios from "axios";

const API = axios.create({

  baseURL: "http://192.168.100.66:3000",

});

export interface LoginRequest {
  email: string;
  password: string;
  role?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'FARMER' | 'AGRONOMIST';
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await API.post("/auth/login", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Login failed"
      );
    }
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await API.post("/auth/register", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Registration failed"
      );
    }
  },
};