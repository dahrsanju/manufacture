import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

interface QueuedRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: QueuedRequest[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private processQueue(error: Error | null, token: string | null = null) {
    this.failedQueue.forEach((request) => {
      if (error) {
        request.reject(error);
      } else if (token) {
        request.config.headers.Authorization = `Bearer ${token}`;
        request.resolve(this.client(request.config));
      }
    });

    this.failedQueue = [];
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        const companyId = localStorage.getItem('company_id');
        if (companyId) {
          config.headers['X-Company-Id'] = companyId;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor with token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request while refreshing
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject, config: originalRequest });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              localStorage.setItem('access_token', newToken);
              this.processQueue(null, newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.processQueue(refreshError as Error, null);
            // Clear auth and redirect to login
            this.clearAuthAndRedirect();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        if (error.response?.status === 403) {
          toast.error('You do not have permission to perform this action');
        } else if (error.response?.status === 404) {
          toast.error('Resource not found');
        } else if (error.response?.status && error.response.status >= 500) {
          toast.error('Server error. Please try again later.');
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return null;
    }

    try {
      // In demo mode, simulate token refresh
      if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return 'demo-refreshed-access-token-' + Date.now();
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      if (newRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken);
      }

      return accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  private clearAuthAndRedirect() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('company_id');
    localStorage.removeItem('auth-storage');

    // Only redirect if we're in a browser context
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Public methods
  public get<T = unknown>(...args: Parameters<AxiosInstance['get']>) {
    return this.client.get<T>(...args);
  }

  public post<T = unknown>(...args: Parameters<AxiosInstance['post']>) {
    return this.client.post<T>(...args);
  }

  public put<T = unknown>(...args: Parameters<AxiosInstance['put']>) {
    return this.client.put<T>(...args);
  }

  public patch<T = unknown>(...args: Parameters<AxiosInstance['patch']>) {
    return this.client.patch<T>(...args);
  }

  public delete<T = unknown>(...args: Parameters<AxiosInstance['delete']>) {
    return this.client.delete<T>(...args);
  }

  // Get the underlying axios instance
  public getInstance() {
    return this.client;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
