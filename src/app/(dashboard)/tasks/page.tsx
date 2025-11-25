'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Breadcrumb,
} from '@/components/ui';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Package,
  Factory,
  Truck,
  Filter,
  Loader2,
} from 'lucide-react';

interface Task {
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

interface TaskStats {
  pending: number;
  inProgress: number;
  overdue: number;
  completedToday: number;
}

interface TasksResponse {
  items: Task[];
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
  COMPLETED: { label: 'Completed', variant: 'success' },
};

const typeIcons: Record<string, typeof FileText> = {
  APPROVAL: CheckCircle2,
  REVIEW: FileText,
  ACTION: Clock,
};

const categoryIcons: Record<string, typeof Package> = {
  purchase: Package,
  quality: AlertTriangle,
  inventory: Truck,
  production: Factory,
};

export default function TasksPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  // Fetch tasks with filters
  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['tasks', page, statusFilter, categoryFilter, priorityFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '20');
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('module', categoryFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);

      const response = await axios.get(`/api/v1/tasks?${params.toString()}`);
      return response.data.data as TasksResponse;
    },
  });

  // Fetch task stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['tasks-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/tasks/stats');
      return response.data.data as TaskStats;
    },
  });

  const tasks = tasksData?.items || [];
  const stats = statsData || { pending: 0, inProgress: 0, overdue: 0, completedToday: 0 };

  const handleApprove = (taskId: string) => {
    // Handle approval logic
    console.log('Approved:', taskId);
  };

  const handleReject = (taskId: string) => {
    // Handle rejection logic
    console.log('Rejected:', taskId);
  };

  const handleTaskClick = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Task Inbox</h1>
        <p className="text-muted-foreground">
          Manage your pending tasks and approvals
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                )}
              </div>
              <Factory className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats.overdue}</p>
                )}
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats.completedToday}</p>
                )}
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {['PENDING', 'IN_PROGRESS', 'COMPLETED', 'all'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'All' : statusConfig[status]?.label || status}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Filter className="h-4 w-4 mt-2 text-muted-foreground" />
          {['all', 'purchase', 'quality', 'inventory', 'production'].map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          {['all', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((priority) => (
            <Button
              key={priority}
              variant={priorityFilter === priority ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setPriorityFilter(priority)}
            >
              {priority === 'all' ? 'All Priorities' : priorityConfig[priority]?.label || priority}
            </Button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasksLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading tasks...</p>
            </CardContent>
          </Card>
        ) : tasksError ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <p className="text-lg font-medium text-destructive">Failed to load tasks</p>
              <p className="text-muted-foreground">Please try again later</p>
            </CardContent>
          </Card>
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-success" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-muted-foreground">No tasks matching your filters</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => {
            const TypeIcon = typeIcons[task.type] || FileText;
            const CategoryIcon = categoryIcons[task.category] || Package;
            const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

            return (
              <Card
                key={task.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${isOverdue ? 'border-destructive' : ''}`}
                onClick={() => handleTaskClick(task.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      task.status === 'COMPLETED' ? 'bg-success/10' : 'bg-primary/10'
                    }`}>
                      <TypeIcon className={`h-5 w-5 ${
                        task.status === 'COMPLETED' ? 'text-success' : 'text-primary'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        </div>
                        <Badge variant={statusConfig[task.status]?.variant || 'default'}>
                          {statusConfig[task.status]?.label || task.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1">
                          <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize">{task.category}</span>
                        </div>
                        <span className={priorityConfig[task.priority]?.color || 'text-muted-foreground'}>
                          {priorityConfig[task.priority]?.label || task.priority}
                        </span>
                        <span className={`text-muted-foreground ${isOverdue ? 'text-destructive' : ''}`}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        {task.assignee && (
                          <span className="text-muted-foreground">
                            Assignee: {task.assignee}
                          </span>
                        )}
                        <span className="text-muted-foreground">
                          From: {task.assignedBy}
                        </span>
                      </div>
                      {task.status === 'PENDING' && task.type === 'APPROVAL' && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(task.id);
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(task.id);
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {tasksData?.pagination && tasksData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Page {tasksData.pagination.page} of {tasksData.pagination.totalPages} ({tasksData.pagination.total} total tasks)
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
    </div>
  );
}
