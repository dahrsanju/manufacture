// Mock Notifications Service
// Uses MSW handlers for API interception

import axios from 'axios';
import type { Notification } from '@/types';

const API_BASE = '/api/v1/notifications';

export interface NotificationService {
  getNotifications: () => Promise<Notification[]>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await axios.get(API_BASE);
  return response.data.data;
};

export const markAsRead = async (id: string): Promise<void> => {
  await axios.patch(`${API_BASE}/${id}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await axios.patch(`${API_BASE}/read-all`);
};

export const deleteNotification = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`);
};
