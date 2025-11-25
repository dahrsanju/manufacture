'use client';

import { ReactNode } from 'react';
import { useAuthStore } from '@/stores';

interface PermissionGateProps {
  children: ReactNode;
  permissions?: string | string[];
  roles?: string | string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * PermissionGate component for role-based access control
 *
 * Usage:
 * <PermissionGate permissions="products.create">
 *   <CreateProductButton />
 * </PermissionGate>
 *
 * <PermissionGate permissions={['products.edit', 'products.delete']} requireAll>
 *   <ProductActions />
 * </PermissionGate>
 *
 * <PermissionGate roles="ADMIN" fallback={<AccessDenied />}>
 *   <AdminPanel />
 * </PermissionGate>
 */
export function PermissionGate({
  children,
  permissions,
  roles,
  requireAll = false,
  fallback = null,
}: PermissionGateProps) {
  const { permissions: userPermissions, hasRole: checkRole, companies, companyId } = useAuthStore();

  // Get current company to check role
  const currentCompany = companies.find((c) => c.companyId === companyId);
  const userRole = currentCompany?.role;

  // If no permissions or roles specified, render children
  if (!permissions && !roles) {
    return <>{children}</>;
  }

  // Check role-based access
  if (roles) {
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    if (!userRole) {
      return <>{fallback}</>;
    }

    const hasRoleAccess = requireAll
      ? requiredRoles.every(role => userRole === role)
      : requiredRoles.some(role => userRole === role);

    if (!hasRoleAccess) {
      return <>{fallback}</>;
    }
  }

  // Check permission-based access
  if (permissions) {
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];

    if (!userPermissions || userPermissions.length === 0) {
      return <>{fallback}</>;
    }

    const hasPermission = requireAll
      ? requiredPermissions.every(perm => userPermissions.includes(perm))
      : requiredPermissions.some(perm => userPermissions.includes(perm));

    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

/**
 * Hook to check permissions programmatically
 */
export function usePermissions() {
  const { permissions, companies, companyId } = useAuthStore();

  // Get current company to check role
  const currentCompany = companies.find((c) => c.companyId === companyId);
  const userRole = currentCompany?.role;

  const hasPermission = (permission: string | string[]): boolean => {
    if (!permissions || permissions.length === 0) return false;

    const requiredPermissions = Array.isArray(permission) ? permission : [permission];
    return requiredPermissions.some(perm => permissions.includes(perm));
  };

  const hasAllPermissions = (permissionList: string[]): boolean => {
    if (!permissions || permissions.length === 0) return false;
    return permissionList.every(perm => permissions.includes(perm));
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!userRole) return false;

    const requiredRoles = Array.isArray(role) ? role : [role];
    return requiredRoles.includes(userRole);
  };

  const isAdmin = (): boolean => {
    return userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
  };

  return {
    hasPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
    permissions,
    role: userRole,
  };
}

export default PermissionGate;
