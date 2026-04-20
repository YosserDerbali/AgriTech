import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export interface GoogleSignInRequest {
  email: string;
  name: string;
  photo?: string;
  firebaseUid: string;
  role: 'FARMER' | 'AGRONOMIST';
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    photo?: string;
  };
}

export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await API.post("/auth/login", data);
      const { token, user } = response.data;
      
      if (token) {
        await AsyncStorage.setItem('authToken', token);
      }
      
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
      const { token, user } = response.data;
      
      if (token) {
        await AsyncStorage.setItem('authToken', token);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Registration failed"
      );
    }
  },

  googleSignIn: async (data: GoogleSignInRequest): Promise<AuthResponse> => {
    try {
      const response = await API.post("/auth/google-signin", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Google sign-in failed"
      );
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('authToken');
  },
};