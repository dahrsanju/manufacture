// Service Switcher
// Routes API calls to mock or live services based on API_MODE

import { isMockMode } from '@/lib/demo-mode';

// Import mock services
import * as mockAuthService from './mock/auth';
import * as mockProductService from './mock/products';
import * as mockNotificationService from './mock/notifications';

// Import live services (Phase 2)
import * as liveAuthService from './live/auth';
import * as liveProductService from './live/products';
import * as liveNotificationService from './live/notifications';

// Service factory function
function getService<T>(mockService: T, liveService: T): T {
  return isMockMode() ? mockService : liveService;
}

// Export unified services
export const authService = getService(mockAuthService, liveAuthService);
export const productService = getService(mockProductService, liveProductService);
export const notificationService = getService(mockNotificationService, liveNotificationService);

// Re-export service types
export type { AuthService } from './mock/auth';
export type { ProductService } from './mock/products';
export type { NotificationService } from './mock/notifications';
