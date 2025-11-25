'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Breadcrumb,
  DataTable,
  type Column,
} from '@/components/ui';
import { Plus, Factory, Clock, CheckCircle2, AlertTriangle, Pause } from 'lucide-react';

// Mock work order data
const workOrders = [
  {
    id: 'wo-001',
    orderNumber: 'WO-2024-0891',
    productName: 'Widget Pro X100',
    productSku: 'SKU-001',
    quantity: 500,
    completedQty: 350,
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    startDate: '2024-11-20',
    dueDate: '2024-11-25',
    assignee: 'John Smith',
    warehouse: 'Main Warehouse',
  },
  {
    id: 'wo-002',
    orderNumber: 'WO-2024-0892',
    productName: 'Component A-123',
    productSku: 'SKU-002',
    quantity: 1000,
    completedQty: 1000,
    status: 'COMPLETED',
    priority: 'MEDIUM',
    startDate: '2024-11-18',
    dueDate: '2024-11-22',
    assignee: 'Jane Doe',
    warehouse: 'Main Warehouse',
  },
  {
    id: 'wo-003',
    orderNumber: 'WO-2024-0893',
    productName: 'Assembly Kit AK-50',
    productSku: 'SKU-003',
    quantity: 200,
    completedQty: 0,
    status: 'PENDING',
    priority: 'LOW',
    startDate: '2024-11-26',
    dueDate: '2024-11-30',
    assignee: 'Bob Wilson',
    warehouse: 'Secondary Warehouse',
  },
  {
    id: 'wo-004',
    orderNumber: 'WO-2024-0894',
    productName: 'Finished Product FP-01',
    productSku: 'SKU-004',
    quantity: 300,
    completedQty: 150,
    status: 'ON_HOLD',
    priority: 'HIGH',
    startDate: '2024-11-19',
    dueDate: '2024-11-24',
    assignee: 'Alice Brown',
    warehouse: 'Main Warehouse',
  },
  {
    id: 'wo-005',
    orderNumber: 'WO-2024-0895',
    productName: 'Custom Order CO-100',
    productSku: 'SKU-005',
    quantity: 50,
    completedQty: 50,
    status: 'COMPLETED',
    priority: 'URGENT',
    startDate: '2024-11-15',
    dueDate: '2024-11-20',
    assignee: 'John Smith',
    warehouse: 'Main Warehouse',
  },
];

type WorkOrder = typeof workOrders[0];

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary'; icon: typeof Factory }> = {
  PENDING: { label: 'Pending', variant: 'secondary', icon: Clock },
  IN_PROGRESS: { label: 'In Progress', variant: 'default', icon: Factory },
  ON_HOLD: { label: 'On Hold', variant: 'warning', icon: Pause },
  COMPLETED: { label: 'Completed', variant: 'success', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', variant: 'destructive', icon: AlertTriangle },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Low', color: 'text-muted-foreground' },
  MEDIUM: { label: 'Medium', color: 'text-primary' },
  HIGH: { label: 'High', color: 'text-warning' },
  URGENT: { label: 'Urgent', color: 'text-destructive' },
};

export default function WorkOrdersPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = statusFilter === 'all'
    ? workOrders
    : workOrders.filter(wo => wo.status === statusFilter);

  const columns: Column<WorkOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order #',
      sortable: true,
      render: (_, row) => (
        <span className="font-mono font-medium">{row.orderNumber}</span>
      ),
    },
    {
      key: 'productName',
      header: 'Product',
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-medium">{row.productName}</p>
          <p className="text-xs text-muted-foreground font-mono">{row.productSku}</p>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Progress',
      render: (_, row) => {
        const pct = Math.round((row.completedQty / row.quantity) * 100);
        return (
          <div className="w-32">
            <div className="flex justify-between text-xs mb-1">
              <span>{row.completedQty} / {row.quantity}</span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  pct === 100 ? 'bg-success' : pct > 50 ? 'bg-primary' : 'bg-warning'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (_, row) => {
        const config = statusConfig[row.status];
        return (
          <Badge variant={config.variant}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (_, row) => {
        const config = priorityConfig[row.priority];
        return (
          <span className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (_, row) => {
        const isOverdue = new Date(row.dueDate) < new Date() && row.status !== 'COMPLETED';
        return (
          <span className={isOverdue ? 'text-destructive' : ''}>
            {new Date(row.dueDate).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      key: 'assignee',
      header: 'Assignee',
      sortable: true,
    },
  ];

  // Calculate stats
  const stats = {
    total: workOrders.length,
    inProgress: workOrders.filter(wo => wo.status === 'IN_PROGRESS').length,
    completed: workOrders.filter(wo => wo.status === 'COMPLETED').length,
    onHold: workOrders.filter(wo => wo.status === 'ON_HOLD').length,
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <p className="text-muted-foreground">
            Manage production and manufacturing work orders
          </p>
        </div>
        <Button onClick={() => router.push('/production/work-orders/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Work Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Factory className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Hold</p>
                <p className="text-2xl font-bold">{stats.onHold}</p>
              </div>
              <Pause className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'PENDING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED'].map((status) => (
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

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredOrders}
            keyField="id"
            searchable
            searchPlaceholder="Search work orders..."
            onRowClick={(row) => router.push(`/production/work-orders/${row.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
