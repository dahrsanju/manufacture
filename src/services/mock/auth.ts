// Mock Authentication Service
// Uses MSW handlers for API interception

import axios from 'axios';
import type { AuthResponse } from '@/types';

const API_BASE = '/api/v1/auth';

export interface AuthService {
  sendOtp: (email: string) => Promise<{ message: string; expiresIn: number }>;
  verifyOtp: (email: string, otp: string) => Promise<AuthResponse>;
  refreshToken: (refreshToken: string) => Promise<{ accessToken: string; refreshToken: string }>;
  logout: () => Promise<void>;
  getMe: () => Promise<AuthResponse>;
}

export const sendOtp = async (email: string) => {
  const response = await axios.post(`${API_BASE}/send-otp`, { email });
  return response.data.data;
};

export const verifyOtp = async (email: string, otp: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_BASE}/verify-otp`, { email, otp });
  return response.data.data;
};

export const refreshToken = async (token: string) => {
  const response = await axios.post(`${API_BASE}/refresh`, { refreshToken: token });
  return response.data.data;
};

export const logout = async () => {
  await axios.post(`${API_BASE}/logout`);
};

export const getMe = async (): Promise<AuthResponse> => {
  const response = await axios.get(`${API_BASE}/me`);
  return response.data.data;
};
