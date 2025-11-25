'use client';

import { useState } from 'react';
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
  Modal,
} from '@/components/ui';
import {
  Plus,
  Search,
  Shield,
  Users,
  Edit,
  Trash2,
  Copy,
  ChevronRight,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  userCount: number;
  isSystem: boolean;
  permissions: string[];
  color: string;
}

interface RolesResponse {
  data: Role[];
  stats: {
    totalRoles: number;
    customRoles: number;
    totalUsers: number;
  };
  permissionCategories: PermissionCategory[];
}

interface PermissionCategory {
  id: string;
  name: string;
  permissions: {
    id: string;
    name: string;
  }[];
}

export default function RoleManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['security-roles'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/security/roles');
      return response.data as RolesResponse;
    },
  });

  const rolesData = data?.data || [];
  const stats = data?.stats || { totalRoles: 0, customRoles: 0, totalUsers: 0 };
  const permissionCategories = data?.permissionCategories || [];

  const filteredRoles = rolesData.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteRole = async (roleId: string) => {
    const role = rolesData.find(r => r.id === roleId);
    if (role?.isSystem) {
      toast.error('System roles cannot be deleted');
      return;
    }
    try {
      await axios.delete(`/api/v1/security/roles/${roleId}`);
      toast.success('Role deleted successfully');
      refetch();
    } catch (err) {
      toast.error('Failed to delete role');
    }
  };

  const handleDuplicateRole = async (role: Role) => {
    try {
      await axios.post('/api/v1/security/roles', {
        name: `${role.name} (Copy)`,
        code: `${role.code}_COPY`,
        description: role.description,
        permissions: role.permissions,
      });
      toast.success(`Role "${role.name}" duplicated`);
      refetch();
    } catch (err) {
      toast.error('Failed to duplicate role');
    }
  };

  const getRoleColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      destructive: 'bg-destructive/10 text-destructive',
      warning: 'bg-warning/10 text-warning',
      primary: 'bg-primary/10 text-primary',
      success: 'bg-success/10 text-success',
      secondary: 'bg-secondary/10 text-secondary-foreground',
    };
    return colorMap[color] || 'bg-primary/10 text-primary';
  };

  const getShieldColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      destructive: 'text-destructive',
      warning: 'text-warning',
      primary: 'text-primary',
      success: 'text-success',
      secondary: 'text-secondary-foreground',
    };
    return colorMap[color] || 'text-primary';
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
          <p className="text-destructive">Failed to load roles</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
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
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Define roles and manage permissions
          </p>
        </div>
        <Button onClick={() => { setSelectedRole(null); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Roles</p>
                <p className="text-2xl font-bold">{stats.totalRoles}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Custom Roles</p>
                <p className="text-2xl font-bold">{stats.customRoles}</p>
              </div>
              <Edit className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Roles List */}
      {filteredRoles.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredRoles.map((role) => (
            <Card key={role.id} className="hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getRoleColorClass(role.color)}`}>
                      <Shield className={`h-5 w-5 ${getShieldColorClass(role.color)}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{role.name}</h3>
                        {role.isSystem && (
                          <Badge variant="secondary" className="text-xs">System</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{role.code}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRole(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicateRole(role)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {!role.isSystem && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-3">{role.description}</p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {role.userCount} users
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {role.permissions.includes('all')
                      ? 'All permissions'
                      : `${role.permissions.length} permissions`}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No roles found</p>
        </div>
      )}

      {/* Permission Matrix Preview */}
      {rolesData.length > 0 && permissionCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
            <CardDescription>Overview of role permissions by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Permission</th>
                    {rolesData.slice(0, 5).map(role => (
                      <th key={role.id} className="text-center py-3 px-2 font-medium">
                        <div className="truncate max-w-[80px]" title={role.name}>
                          {role.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissionCategories.slice(0, 4).map(category => (
                    <tr key={category.id} className="border-b">
                      <td className="py-3 px-4 font-medium">{category.name}</td>
                      {rolesData.slice(0, 5).map(role => {
                        const hasFullAccess = role.permissions.includes('all') ||
                          role.permissions.some(p => p.endsWith('.full') && p.startsWith(category.id));
                        const hasPartialAccess = role.permissions.some(p => p.startsWith(category.id));

                        return (
                          <td key={role.id} className="text-center py-3 px-2">
                            {hasFullAccess ? (
                              <Check className="h-4 w-4 text-success mx-auto" />
                            ) : hasPartialAccess ? (
                              <div className="h-4 w-4 rounded-full bg-warning/50 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mx-auto" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3 text-success" /> Full access
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-warning/50" /> Partial access
              </div>
              <div className="flex items-center gap-1">
                <X className="h-3 w-3 text-muted-foreground" /> No access
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRole ? `Edit Role: ${selectedRole.name}` : 'Create New Role'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Role Name"
              placeholder="e.g., Production Manager"
              defaultValue={selectedRole?.name || ''}
            />
            <Input
              label="Role Code"
              placeholder="e.g., PROD_MANAGER"
              defaultValue={selectedRole?.code || ''}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Describe the role's purpose..."
              defaultValue={selectedRole?.description || ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Permissions</label>
            <div className="border rounded-lg max-h-[300px] overflow-y-auto">
              {permissionCategories.map(category => (
                <div key={category.id} className="border-b last:border-0">
                  <div className="p-3 bg-muted/50 font-medium text-sm">
                    {category.name}
                  </div>
                  <div className="p-3 grid gap-2">
                    {category.permissions.map(perm => (
                      <label key={perm.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-input"
                          defaultChecked={selectedRole?.permissions.includes(perm.id) ||
                            selectedRole?.permissions.includes('all')}
                        />
                        <span className="text-sm">{perm.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={async () => {
              try {
                if (selectedRole) {
                  await axios.put(`/api/v1/security/roles/${selectedRole.id}`, {
                    // Form data would be collected here
                  });
                  toast.success('Role updated');
                } else {
                  await axios.post('/api/v1/security/roles', {
                    // Form data would be collected here
                  });
                  toast.success('Role created');
                }
                setIsModalOpen(false);
                refetch();
              } catch (err) {
                toast.error(selectedRole ? 'Failed to update role' : 'Failed to create role');
              }
            }}>
              {selectedRole ? 'Save Changes' : 'Create Role'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
