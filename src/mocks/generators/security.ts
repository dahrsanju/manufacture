import { faker } from '@faker-js/faker';

// Role & Permission Types
export interface Role {
  id: string;
  name: string;
  description: string;
  type: 'system' | 'custom';
  permissions: Permission[];
  userCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  module: string;
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'admin';
  granted: boolean;
}

export interface PermissionModule {
  id: string;
  name: string;
  code: string;
  actions: string[];
}

// Audit Log Types
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  changes?: AuditChange[];
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure';
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

// Session Types
export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  isCurrent: boolean;
  isActive: boolean;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
}

// Security Settings Types
export interface SecuritySettings {
  userId: string;
  twoFactor: {
    enabled: boolean;
    method?: 'authenticator' | 'sms' | 'email';
    verifiedAt?: string;
    backupCodes?: number;
  };
  passwordless: {
    enabled: boolean;
    method: 'email' | 'magic_link';
  };
  loginAlerts: {
    enabled: boolean;
    email: boolean;
    push: boolean;
  };
  sessionManagement: {
    maxSessions: number;
    sessionTimeout: number;
    rememberMe: boolean;
  };
  activityMonitoring: {
    enabled: boolean;
    logLevel: 'basic' | 'detailed' | 'verbose';
  };
}

// Two-Factor Setup Types
export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

// Generators
export const generateMockRoles = (): Role[] => {
  const systemRoles = [
    {
      name: 'Administrator',
      description: 'Full system access with all permissions',
      type: 'system' as const,
      userCount: faker.number.int({ min: 1, max: 5 }),
    },
    {
      name: 'Manager',
      description: 'Department manager with approval rights',
      type: 'system' as const,
      userCount: faker.number.int({ min: 5, max: 20 }),
    },
    {
      name: 'Supervisor',
      description: 'Team supervisor with limited admin rights',
      type: 'system' as const,
      userCount: faker.number.int({ min: 10, max: 30 }),
    },
    {
      name: 'Operator',
      description: 'Standard user with basic CRUD operations',
      type: 'system' as const,
      userCount: faker.number.int({ min: 20, max: 100 }),
    },
    {
      name: 'Viewer',
      description: 'Read-only access to data',
      type: 'system' as const,
      userCount: faker.number.int({ min: 5, max: 30 }),
    },
  ];

  const customRoles = [
    {
      name: 'Quality Inspector',
      description: 'Quality module specialist',
      type: 'custom' as const,
      userCount: faker.number.int({ min: 3, max: 15 }),
    },
    {
      name: 'Purchasing Agent',
      description: 'Purchasing and supplier management',
      type: 'custom' as const,
      userCount: faker.number.int({ min: 2, max: 10 }),
    },
    {
      name: 'Warehouse Clerk',
      description: 'Inventory and warehouse operations',
      type: 'custom' as const,
      userCount: faker.number.int({ min: 5, max: 25 }),
    },
  ];

  return [...systemRoles, ...customRoles].map((role) => ({
    id: faker.string.uuid(),
    name: role.name,
    description: role.description,
    type: role.type,
    permissions: generateMockPermissions(role.name),
    userCount: role.userCount,
    isActive: true,
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
  }));
};

export const generateMockPermissions = (roleName: string): Permission[] => {
  const modules = ['inventory', 'manufacturing', 'quality', 'purchasing', 'finance', 'hr', 'settings'];
  const actions: Permission['action'][] = ['view', 'create', 'edit', 'delete', 'approve', 'export', 'admin'];

  const permissions: Permission[] = [];

  modules.forEach((module) => {
    actions.forEach((action) => {
      let granted = false;

      if (roleName === 'Administrator') {
        granted = true;
      } else if (roleName === 'Manager') {
        granted = action !== 'admin';
      } else if (roleName === 'Supervisor') {
        granted = ['view', 'create', 'edit', 'approve'].includes(action);
      } else if (roleName === 'Operator') {
        granted = ['view', 'create', 'edit'].includes(action);
      } else if (roleName === 'Viewer') {
        granted = action === 'view';
      } else {
        granted = faker.datatype.boolean({ probability: 0.5 });
      }

      permissions.push({
        id: faker.string.uuid(),
        module,
        action,
        granted,
      });
    });
  });

  return permissions;
};

export const generateMockPermissionModules = (): PermissionModule[] => {
  return [
    { id: '1', name: 'Inventory', code: 'inventory', actions: ['view', 'create', 'edit', 'delete', 'export'] },
    { id: '2', name: 'Manufacturing', code: 'manufacturing', actions: ['view', 'create', 'edit', 'delete', 'approve'] },
    { id: '3', name: 'Quality', code: 'quality', actions: ['view', 'create', 'edit', 'delete', 'approve', 'export'] },
    { id: '4', name: 'Purchasing', code: 'purchasing', actions: ['view', 'create', 'edit', 'delete', 'approve'] },
    { id: '5', name: 'Finance', code: 'finance', actions: ['view', 'create', 'edit', 'delete', 'approve', 'export'] },
    { id: '6', name: 'HR', code: 'hr', actions: ['view', 'create', 'edit', 'delete', 'approve'] },
    { id: '7', name: 'Settings', code: 'settings', actions: ['view', 'edit', 'admin'] },
    { id: '8', name: 'Reports', code: 'reports', actions: ['view', 'create', 'export'] },
    { id: '9', name: 'Workflows', code: 'workflows', actions: ['view', 'create', 'edit', 'delete', 'admin'] },
  ];
};

export const generateMockAuditLogs = (count: number = 50): AuditLog[] => {
  const actions = [
    'login', 'logout', 'create', 'update', 'delete', 'view', 'export', 'approve', 'reject',
    'assign', 'delegate', 'comment', 'upload', 'download', 'share', 'revoke',
  ];

  const modules = ['auth', 'inventory', 'manufacturing', 'quality', 'purchasing', 'finance', 'settings', 'users'];

  const entityTypes = {
    auth: 'Session',
    inventory: 'Product',
    manufacturing: 'Work Order',
    quality: 'Inspection',
    purchasing: 'Purchase Order',
    finance: 'Invoice',
    settings: 'Configuration',
    users: 'User',
  };

  return Array.from({ length: count }, (_, i) => {
    const auditModule = faker.helpers.arrayElement(modules);
    const action = faker.helpers.arrayElement(actions);
    const status = faker.helpers.weightedArrayElement([
      { value: 'success' as const, weight: 0.95 },
      { value: 'failure' as const, weight: 0.05 },
    ]);

    return {
      id: faker.string.uuid(),
      timestamp: new Date(Date.now() - i * faker.number.int({ min: 5, max: 30 }) * 60000).toISOString(),
      userId: faker.string.uuid(),
      userName: faker.person.fullName(),
      userEmail: faker.internet.email(),
      action,
      module: auditModule,
      entityType: entityTypes[auditModule as keyof typeof entityTypes],
      entityId: faker.string.uuid(),
      entityName: `${entityTypes[auditModule as keyof typeof entityTypes]}-${faker.string.numeric(5)}`,
      changes: ['create', 'update'].includes(action)
        ? [
            { field: 'status', oldValue: 'draft', newValue: 'active' },
            { field: 'quantity', oldValue: 10, newValue: 25 },
          ]
        : undefined,
      ipAddress: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      status,
      errorMessage: status === 'failure' ? faker.lorem.sentence() : undefined,
      metadata: faker.datatype.boolean({ probability: 0.3 })
        ? { browser: 'Chrome', os: 'macOS' }
        : undefined,
    };
  });
};

export const generateMockSessions = (userId?: string): UserSession[] => {
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const oses = ['macOS', 'Windows 11', 'Ubuntu', 'iOS', 'Android'];
  const devices = ['Desktop', 'Laptop', 'Mobile', 'Tablet'];
  const locations = ['New York, US', 'London, UK', 'Tokyo, JP', 'Sydney, AU', 'Berlin, DE'];

  return Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, (_, i) => ({
    id: faker.string.uuid(),
    userId: userId || faker.string.uuid(),
    userName: faker.person.fullName(),
    userEmail: faker.internet.email(),
    device: faker.helpers.arrayElement(devices),
    browser: faker.helpers.arrayElement(browsers),
    os: faker.helpers.arrayElement(oses),
    ipAddress: faker.internet.ip(),
    location: faker.helpers.arrayElement(locations),
    isCurrent: i === 0,
    isActive: i < 2,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
    lastActivityAt: i === 0
      ? new Date().toISOString()
      : faker.date.recent({ days: 7 }).toISOString(),
    expiresAt: faker.date.future({ years: 1 }).toISOString(),
  }));
};

export const generateMockSecuritySettings = (userId?: string): SecuritySettings => {
  return {
    userId: userId || faker.string.uuid(),
    twoFactor: {
      enabled: faker.datatype.boolean({ probability: 0.4 }),
      method: faker.helpers.arrayElement(['authenticator', 'sms', 'email']),
      verifiedAt: faker.datatype.boolean({ probability: 0.4 }) ? faker.date.recent({ days: 90 }).toISOString() : undefined,
      backupCodes: faker.datatype.boolean({ probability: 0.4 }) ? faker.number.int({ min: 0, max: 10 }) : undefined,
    },
    passwordless: {
      enabled: true,
      method: 'email',
    },
    loginAlerts: {
      enabled: faker.datatype.boolean({ probability: 0.7 }),
      email: true,
      push: faker.datatype.boolean({ probability: 0.5 }),
    },
    sessionManagement: {
      maxSessions: faker.number.int({ min: 1, max: 10 }),
      sessionTimeout: faker.helpers.arrayElement([30, 60, 120, 480, 1440]),
      rememberMe: faker.datatype.boolean({ probability: 0.6 }),
    },
    activityMonitoring: {
      enabled: true,
      logLevel: faker.helpers.arrayElement(['basic', 'detailed', 'verbose']),
    },
  };
};

export const generateMockTwoFactorSetup = (): TwoFactorSetup => {
  return {
    secret: faker.string.alphanumeric(32).toUpperCase(),
    qrCode: `data:image/png;base64,${faker.string.alphanumeric(100)}`,
    backupCodes: Array.from({ length: 10 }, () =>
      `${faker.string.alphanumeric(4)}-${faker.string.alphanumeric(4)}`.toUpperCase()
    ),
  };
};

// Security Stats
export interface SecurityStats {
  totalUsers: number;
  activeUsers: number;
  activeSessions: number;
  failedLogins24h: number;
  twoFactorEnabled: number;
  recentAuditEvents: number;
}

export const generateMockSecurityStats = (): SecurityStats => {
  const totalUsers = faker.number.int({ min: 50, max: 500 });

  return {
    totalUsers,
    activeUsers: faker.number.int({ min: Math.floor(totalUsers * 0.6), max: totalUsers }),
    activeSessions: faker.number.int({ min: 10, max: 100 }),
    failedLogins24h: faker.number.int({ min: 0, max: 20 }),
    twoFactorEnabled: faker.number.int({ min: Math.floor(totalUsers * 0.2), max: Math.floor(totalUsers * 0.6) }),
    recentAuditEvents: faker.number.int({ min: 100, max: 1000 }),
  };
};

// User for role management
export interface RoleUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  lastLogin?: string;
}

export const generateMockRoleUsers = (roleId: string, count: number = 10): RoleUser[] => {
  const departments = ['Engineering', 'Production', 'Quality', 'Purchasing', 'Finance', 'HR', 'Operations'];

  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.datatype.boolean({ probability: 0.6 }) ? faker.image.avatar() : undefined,
    department: faker.helpers.arrayElement(departments),
    roleId,
    roleName: faker.helpers.arrayElement(['Administrator', 'Manager', 'Operator', 'Viewer']),
    isActive: faker.datatype.boolean({ probability: 0.9 }),
    lastLogin: faker.datatype.boolean({ probability: 0.8 }) ? faker.date.recent({ days: 30 }).toISOString() : undefined,
  }));
};
