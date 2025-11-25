'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Breadcrumb } from '@/components/ui';
import {
  Stamp,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
  FileText,
  Package,
  Factory,
  Truck,
  Calendar,
} from 'lucide-react';

interface ApprovalTask {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  createdAt: string;
  assignedBy: string;
  assignee?: string;
  category: string;
}

interface ApprovalStats {
  pending: number;
  approved: number;
  rejected: number;
  thisWeek: number;
}

interface ApprovalTasksResponse {
  items: ApprovalTask[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Low', color: 'text-muted-foreground' },
  MEDIUM: { label: 'Medium', color: 'text-primary' },
  HIGH: { label: 'High', color: 'text-warning' },
  URGENT: { label: 'Urgent', color: 'text-destructive' },
};

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'secondary' }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  IN_PROGRESS: { label: 'In Progress', variant: 'default' },
  COMPLETED: { label: 'Approved', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'secondary' },
};

const categoryIcons: Record<string, typeof Package> = {
  purchase: Package,
  quality: AlertTriangle,
  inventory: Truck,
  production: Factory,
};

export default function ApprovalsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  // Fetch approval tasks (type=approval, status=pending)
  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['approval-tasks', page],
    queryFn: async () => {
      const response = await axios.get('/api/v1/tasks', {
        params: {
          type: 'approval',
          status: 'PENDING',
          page,
          limit: 20,
        },
      });
      return response.data.data as ApprovalTasksResponse;
    },
  });

  // Fetch approval-specific stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['approval-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/tasks/stats', {
        params: { type: 'approval' },
      });
      return response.data.data as ApprovalStats;
    },
  });

  const tasks = tasksData?.items || [];
  const stats = statsData || { pending: 0, approved: 0, rejected: 0, thisWeek: 0 };

  const handleApprove = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.post(`/api/v1/tasks/${taskId}/approve`);
      // Refetch would happen automatically with proper query invalidation
      console.log('Approved:', taskId);
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  };

  const handleReject = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.post(`/api/v1/tasks/${taskId}/reject`);
      console.log('Rejected:', taskId);
    } catch (err) {
      console.error('Failed to reject:', err);
    }
  };

  const handleTaskClick = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Approvals</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve pending requests
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats.pending}</p>
                )}
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats.approved}</p>
                )}
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                )}
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats.thisWeek}</p>
                )}
              </div>
              <Stamp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stamp className="h-5 w-5" />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Loading approvals...</p>
            </div>
          ) : tasksError ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-lg font-medium text-destructive">Failed to load approvals</p>
              <p className="text-muted-foreground">Please try again later</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-lg font-medium">All Caught Up!</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                No pending approval requests at this time. New requests will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => {
                const CategoryIcon = categoryIcons[task.category] || Package;
                const isOverdue = new Date(task.dueDate) < new Date();

                return (
                  <div
                    key={task.id}
                    className={`p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                      isOverdue ? 'border-destructive' : ''
                    }`}
                    onClick={() => handleTaskClick(task.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <CategoryIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium truncate">{task.title}</h3>
                            <Badge
                              variant={
                                task.priority === 'URGENT'
                                  ? 'destructive'
                                  : task.priority === 'HIGH'
                                  ? 'warning'
                                  : 'secondary'
                              }
                              className="text-xs"
                            >
                              {priorityConfig[task.priority]?.label || task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 capitalize">
                              <CategoryIcon className="h-3 w-3" />
                              {task.category}
                            </span>
                            <span className={`flex items-center gap-1 ${isOverdue ? 'text-destructive' : ''}`}>
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            <span>From: {task.assignedBy}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleReject(task.id, e)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => handleApprove(task.id, e)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {tasksData?.pagination && tasksData.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {tasksData.pagination.page} of {tasksData.pagination.totalPages} ({tasksData.pagination.total} total)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= (tasksData.pagination.totalPages || 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
