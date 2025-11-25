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
  Input,
  Badge,
  Breadcrumb,
  DataTable,
} from '@/components/ui';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  User,
  Clock,
  Activity,
  FileText,
  Package,
  Settings,
  Shield,
  Trash2,
  Edit,
  Plus,
  Eye,
  LogIn,
  LogOut,
  Loader2,
  Calendar,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

interface AuditLogsResponse {
  data: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    modules: string[];
    actions: string[];
  };
}

const actionConfig: Record<string, { icon: typeof Plus; color: string; variant: 'default' | 'success' | 'warning' | 'secondary' }> = {
  CREATE: { icon: Plus, color: 'text-success', variant: 'success' },
  UPDATE: { icon: Edit, color: 'text-primary', variant: 'default' },
  DELETE: { icon: Trash2, color: 'text-destructive', variant: 'secondary' },
  APPROVE: { icon: Shield, color: 'text-success', variant: 'success' },
  LOGIN: { icon: LogIn, color: 'text-primary', variant: 'default' },
  LOGOUT: { icon: LogOut, color: 'text-muted-foreground', variant: 'secondary' },
  EXPORT: { icon: Download, color: 'text-primary', variant: 'default' },
  VIEW: { icon: Eye, color: 'text-muted-foreground', variant: 'secondary' },
};

const moduleIcons: Record<string, typeof Package> = {
  inventory: Package,
  production: Activity,
  procurement: FileText,
  quality: Shield,
  reports: FileText,
  settings: Settings,
  auth: User,
};

export default function ActivityLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['audit-logs', page, selectedModule, selectedAction, dateFrom, dateTo, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (selectedModule) params.append('module', selectedModule);
      if (selectedAction) params.append('action', selectedAction);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      if (searchTerm) params.append('search', searchTerm);

      const response = await axios.get(`/api/v1/security/audit-logs?${params.toString()}`);
      return response.data as AuditLogsResponse;
    },
  });

  const activityLogs = data?.data || [];
  const modules = data?.filters?.modules || [];
  const actions = data?.filters?.actions || [];
  const pagination = data?.pagination;

  const columns = [
    {
      key: 'timestamp',
      header: 'Time',
      render: (value: unknown) => (
        <div className="text-sm">
          <p>{new Date(value as string).toLocaleTimeString()}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(value as string), { addSuffix: true })}
          </p>
        </div>
      ),
    },
    {
      key: 'userName',
      header: 'User',
      render: (value: unknown, row: ActivityLog) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">
              {(value as string).charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-sm">{value as string}</p>
            <p className="text-xs text-muted-foreground">{row.ipAddress}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (value: unknown) => {
        const config = actionConfig[value as string] || actionConfig.VIEW;
        const Icon = config.icon;
        return (
          <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {value as string}
          </Badge>
        );
      },
    },
    {
      key: 'module',
      header: 'Module',
      render: (value: unknown) => {
        const Icon = moduleIcons[value as string] || Activity;
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{value as string}</span>
          </div>
        );
      },
    },
    {
      key: 'details',
      header: 'Details',
      render: (value: unknown, row: ActivityLog) => (
        <div>
          <p className="text-sm">{value as string}</p>
          <p className="text-xs text-muted-foreground font-mono">
            {row.entityType}: {row.entityId}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-muted-foreground">
            View all system activity and audit trail
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, details, or entity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              className="px-3 py-2 border rounded-md text-sm bg-background"
              value={selectedModule || ''}
              onChange={(e) => setSelectedModule(e.target.value || null)}
            >
              <option value="">All Modules</option>
              {modules.map((m) => (
                <option key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 border rounded-md text-sm bg-background"
              value={selectedAction || ''}
              onChange={(e) => setSelectedAction(e.target.value || null)}
            >
              <option value="">All Actions</option>
              {actions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-36"
                placeholder="From"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-36"
                placeholder="To"
              />
            </div>
            {(selectedModule || selectedAction || searchTerm || dateFrom || dateTo) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedModule(null);
                  setSelectedAction(null);
                  setDateFrom('');
                  setDateTo('');
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity History
          </CardTitle>
          <CardDescription>
            {pagination
              ? `Showing ${activityLogs.length} of ${pagination.total} entries (Page ${pagination.page} of ${pagination.totalPages})`
              : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-destructive">Failed to load activity logs</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : activityLogs.length > 0 ? (
            <>
              <DataTable
                data={activityLogs}
                columns={columns}
                keyField="id"
              />
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No activity logs found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
