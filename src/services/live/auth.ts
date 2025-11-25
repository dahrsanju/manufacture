// Live Authentication Service
// Connects to actual backend API (Phase 2)
// For now, re-export mock service - will be replaced with actual API calls

export * from '../mock/auth';

// TODO: Phase 2 - Replace with actual backend API calls
// import { apiClient } from '@/lib/api-client';
//
// export const sendOtp = async (email: string) => {
//   const response = await apiClient.post('/auth/send-otp', { email });
//   return response.data.data;
// };
