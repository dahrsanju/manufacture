'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Input,
  Breadcrumb,
} from '@/components/ui';
import {
  ArrowLeft,
  Save,
  Search,
  Check,
  X,
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Module {
  id: string;
  name: string;
  description: string;
  actions: string[];
}

interface Role {
  id: string;
  name: string;
  code: string;
  color: string;
  permissions: Record<string, string[]>;
}

interface ModulesResponse {
  data: Module[];
  actions: string[];
}

interface RolesResponse {
  data: Role[];
}

export default function PermissionsPage() {
  const router = useRouter();
  const [permissions, setPermissions] = useState<Record<string, Record<string, string[]>>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch modules and permissions
  const { data: modulesData, isLoading: modulesLoading, error: modulesError } = useQuery({
    queryKey: ['permission-modules'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/security/permissions/modules');
      return response.data as ModulesResponse;
    },
  });

  // Fetch roles
  const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useQuery({
    queryKey: ['security-roles'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/security/roles');
      return response.data as RolesResponse;
    },
  });

  // Initialize permissions from roles data when rolesData is available
  useEffect(() => {
    if (rolesData?.data) {
      const initialPerms: Record<string, Record<string, string[]>> = {};
      rolesData.data.forEach((role) => {
        initialPerms[role.id] = role.permissions || {};
      });
      setPermissions(initialPerms);
    }
  }, [rolesData]);

  const modules = modulesData?.data || [];
  const actions = modulesData?.actions || ['view', 'create', 'edit', 'delete', 'export', 'approve'];
  const roles = rolesData?.data || [];

  const isLoading = modulesLoading || rolesLoading;
  const error = modulesError || rolesError;

  const filteredModules = modules.filter(
    (module) =>
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePermission = (roleId: string, moduleId: string, action: string) => {
    setPermissions((prev) => {
      const rolePerms = prev[roleId] || {};
      const modulePerms = rolePerms[moduleId] || [];

      const newModulePerms = modulePerms.includes(action)
        ? modulePerms.filter((a) => a !== action)
        : [...modulePerms, action];

      return {
        ...prev,
        [roleId]: {
          ...rolePerms,
          [moduleId]: newModulePerms,
        },
      };
    });
    setHasChanges(true);
  };

  const hasPermission = (roleId: string, moduleId: string, action: string) => {
    return permissions[roleId]?.[moduleId]?.includes(action) || false;
  };

  const grantAllForModule = (moduleId: string, roleId: string) => {
    setPermissions((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [moduleId]: [...actions],
      },
    }));
    setHasChanges(true);
  };

  const revokeAllForModule = (moduleId: string, roleId: string) => {
    setPermissions((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [moduleId]: [],
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/v1/security/permissions', { permissions });
      toast.success('Permissions saved successfully');
      setHasChanges(false);
    } catch (err) {
      toast.error('Failed to save permissions');
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'view':
        return <Eye className="h-3 w-3" />;
      case 'create':
        return <Plus className="h-3 w-3" />;
      case 'edit':
        return <Edit className="h-3 w-3" />;
      case 'delete':
        return <Trash2 className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: Role) => {
    const colorMap: Record<string, string> = {
      destructive: 'bg-destructive',
      primary: 'bg-primary',
      warning: 'bg-warning',
      success: 'bg-success',
      secondary: 'bg-secondary',
    };
    return colorMap[role.color] || 'bg-primary';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-destructive">Failed to load permissions data</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Permission Matrix</h1>
            <p className="text-muted-foreground">
              Manage role permissions across all modules
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Badge variant="warning" className="mr-2">
              Unsaved changes
            </Badge>
          )}
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedRole === null ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedRole(null)}
              >
                All Roles
              </Button>
              {roles.map((role) => (
                <Button
                  key={role.id}
                  variant={selectedRole === role.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRole(role.id)}
                >
                  {role.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permission Matrix
          </CardTitle>
          <CardDescription>
            Click on cells to toggle permissions. Use module actions to bulk
            grant/revoke.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Module</th>
                  <th className="text-left py-3 px-4 font-medium">Action</th>
                  {(selectedRole ? roles.filter((r) => r.id === selectedRole) : roles).map(
                    (role) => (
                      <th key={role.id} className="text-center py-3 px-4">
                        <Badge className={`${getRoleColor(role)} text-white`}>{role.name}</Badge>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredModules.map((module) => (
                  <>
                    {actions.map((action, actionIndex) => (
                      <tr
                        key={`${module.id}-${action}`}
                        className={`border-b ${actionIndex === 0 ? 'bg-muted/30' : ''}`}
                      >
                        {actionIndex === 0 && (
                          <td
                            rowSpan={actions.length}
                            className="py-3 px-4 border-r bg-muted/50"
                          >
                            <div className="font-medium">{module.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {module.description}
                            </div>
                            <div className="mt-2 flex gap-1">
                              {(selectedRole
                                ? roles.filter((r) => r.id === selectedRole)
                                : roles
                              ).map((role) => (
                                <div key={role.id} className="flex gap-1">
                                  <button
                                    onClick={() => grantAllForModule(module.id, role.id)}
                                    className="text-xs text-success hover:underline"
                                    title={`Grant all to ${role.name}`}
                                  >
                                    <Check className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => revokeAllForModule(module.id, role.id)}
                                    className="text-xs text-destructive hover:underline"
                                    title={`Revoke all from ${role.name}`}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </td>
                        )}
                        <td className="py-2 px-4 capitalize flex items-center gap-2">
                          {getActionIcon(action)}
                          {action}
                        </td>
                        {(selectedRole
                          ? roles.filter((r) => r.id === selectedRole)
                          : roles
                        ).map((role) => (
                          <td key={role.id} className="py-2 px-4 text-center">
                            <button
                              onClick={() => togglePermission(role.id, module.id, action)}
                              className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                                hasPermission(role.id, module.id, action)
                                  ? 'bg-success text-white'
                                  : 'bg-muted hover:bg-muted-foreground/20'
                              }`}
                            >
                              {hasPermission(role.id, module.id, action) && (
                                <Check className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-muted-foreground">Legend:</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-success flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span>Granted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-muted" />
              <span>Not Granted</span>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>View</span>
              </div>
              <div className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Create</span>
              </div>
              <div className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </div>
              <div className="flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
