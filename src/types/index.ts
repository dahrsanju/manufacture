// Core Application Types

// ==================== USER & AUTH ====================
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLoginAt?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  sound: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  permissions: string[];
  companies: UserCompany[];
}

export interface UserCompany {
  id: string;
  companyId: string;
  companyName: string;
  companyCode: string;
  role: UserRole;
  permissions: string[];
  isDefault: boolean;
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'VIEWER';

// ==================== COMPANY ====================
export interface Company {
  id: string;
  code: string;
  name: string;
  email: string;
  phone?: string;
  logo?: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isActive: boolean;
  settings: CompanySettings;
}

export interface CompanySettings {
  features: string[];
  modules: string[];
  limits: Record<string, number>;
}

// ==================== PRODUCT & INVENTORY ====================
export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  barcode?: string;
  price: number;
  cost: number;
  currency: string;
  taxRate: number;
  unit: string;
  minStock: number;
  maxStock?: number;
  reorderPoint?: number;
  leadTime?: number;
  weight?: number;
  dimensions?: ProductDimensions;
  images: string[];
  tags: string[];
  isActive: boolean;
  isStockable: boolean;
  stockLevels?: StockLevel[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface StockLevel {
  id: string;
  productId: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reserved: number;
  available: number;
  lotNumber?: string;
  expiryDate?: string;
  location?: string;
  zone?: string;
}

export type ProductStatus = 'active' | 'low_stock' | 'out_of_stock' | 'discontinued';

// ==================== WAREHOUSE ====================
export interface Warehouse {
  id: string;
  code: string;
  name: string;
  type: WarehouseType;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  manager?: string;
  phone?: string;
  email?: string;
  capacity?: number;
  usedSpace?: number;
  isActive: boolean;
}

export type WarehouseType = 'MAIN' | 'BRANCH' | 'TRANSIT' | 'QUARANTINE';

// ==================== NOTIFICATIONS ====================
export interface Notification {
  id: string;
  type: 'alert' | 'task' | 'info' | 'success' | 'warning' | 'error';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

// ==================== WORKFLOW ====================
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'draft';
  instances: number;
  completedToday: number;
  avgDuration: string;
  steps: string[];
}

export interface WorkflowTask {
  id: string;
  workflowId: string;
  workflowName: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  assigneeId: string;
  assigneeName: string;
  dueDate?: string;
  slaDeadline?: string;
  createdAt: string;
  completedAt?: string;
}

// ==================== API RESPONSE ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}
