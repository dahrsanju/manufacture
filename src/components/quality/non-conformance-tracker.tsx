'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Input, Button, DataTable } from '@/components/ui';
import { Search, Plus, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface NonConformance {
  id: string;
  number: string;
  title: string;
  type: 'internal' | 'supplier' | 'customer';
  severity: 'minor' | 'major' | 'critical';
  status: 'open' | 'investigating' | 'corrective-action' | 'closed' | 'verified';
  product: string;
  quantity: number;
  reportedBy: string;
  assignedTo: string;
  createdAt: string;
  dueDate: string;
}

interface NonConformanceTrackerProps {
  nonConformances?: NonConformance[];
  onItemClick?: (nc: NonConformance) => void;
  onAdd?: () => void;
}

const mockData: NonConformance[] = [
  { id: 'nc-1', number: 'NC-2024-0045', title: 'Dimensional variance in Widget Pro', type: 'internal', severity: 'major', status: 'corrective-action', product: 'Widget Pro X100', quantity: 15, reportedBy: 'Emily Davis', assignedTo: 'John Smith', createdAt: '2024-11-20', dueDate: '2024-11-27' },
  { id: 'nc-2', number: 'NC-2024-0044', title: 'Surface defects on Component B', type: 'supplier', severity: 'minor', status: 'investigating', product: 'Component B-200', quantity: 8, reportedBy: 'Mike Wilson', assignedTo: 'Sarah Johnson', createdAt: '2024-11-18', dueDate: '2024-11-25' },
  { id: 'nc-3', number: 'NC-2024-0043', title: 'Material contamination detected', type: 'internal', severity: 'critical', status: 'open', product: 'Raw Material X', quantity: 500, reportedBy: 'Robert Brown', assignedTo: 'Emily Davis', createdAt: '2024-11-15', dueDate: '2024-11-22' },
  { id: 'nc-4', number: 'NC-2024-0042', title: 'Customer complaint - functional issue', type: 'customer', severity: 'major', status: 'closed', product: 'Widget Standard', quantity: 3, reportedBy: 'Customer Support', assignedTo: 'John Smith', createdAt: '2024-11-10', dueDate: '2024-11-17' },
  { id: 'nc-5', number: 'NC-2024-0041', title: 'Packaging damage during shipping', type: 'internal', severity: 'minor', status: 'verified', product: 'Assembly Unit A', quantity: 2, reportedBy: 'Shipping Dept', assignedTo: 'Mike Wilson', createdAt: '2024-11-08', dueDate: '2024-11-15' },
];

const statusConfig = {
  open: { icon: AlertTriangle, color: 'destructive', label: 'Open' },
  investigating: { icon: Search, color: 'warning', label: 'Investigating' },
  'corrective-action': { icon: Clock, color: 'default', label: 'Corrective Action' },
  closed: { icon: CheckCircle, color: 'secondary', label: 'Closed' },
  verified: { icon: CheckCircle, color: 'success', label: 'Verified' },
};

const severityConfig = {
  minor: { color: 'secondary' },
  major: { color: 'warning' },
  critical: { color: 'destructive' },
};

export function NonConformanceTracker({
  nonConformances = mockData,
  onItemClick,
  onAdd,
}: NonConformanceTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredData = nonConformances.filter((nc) => {
    const matchesSearch =
      nc.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nc.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || nc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const openCount = nonConformances.filter((nc) => nc.status === 'open').length;
  const criticalCount = nonConformances.filter((nc) => nc.severity === 'critical' && nc.status !== 'verified').length;
  const overdueCount = nonConformances.filter((nc) => new Date(nc.dueDate) < new Date() && nc.status !== 'verified').length;

  const columns = [
    {
      key: 'number',
      header: 'NC #',
      render: (value: unknown) => <span className="font-mono">{value as string}</span>,
    },
    {
      key: 'title',
      header: 'Description',
      render: (value: unknown, row: NonConformance) => (
        <div>
          <p className="font-medium truncate max-w-[200px]">{value as string}</p>
          <p className="text-xs text-muted-foreground">{row.product}</p>
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (value: unknown) => (
        <Badge variant={severityConfig[(value as string) as keyof typeof severityConfig].color as any}>
          {value as string}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: unknown) => {
        const config = statusConfig[(value as string) as keyof typeof statusConfig];
        const Icon = config.icon;
        return (
          <Badge variant={config.color as any} className="gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (value: unknown, row: NonConformance) => {
        const dateValue = value as string;
        const isOverdue = new Date(dateValue) < new Date() && row.status !== 'verified';
        return (
          <span className={isOverdue ? 'text-destructive font-medium' : ''}>
            {new Date(dateValue).toLocaleDateString()}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{openCount}</p>
                <p className="text-sm text-muted-foreground">Open Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <XCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{criticalCount}</p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overdueCount}</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search non-conformances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === null ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(null)}
              >
                All
              </Button>
              {Object.entries(statusConfig).map(([status, config]) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {config.label}
                </Button>
              ))}
            </div>
            <Button onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              New NC
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Non-Conformance Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredData}
            columns={columns}
            keyField="id"
            onRowClick={onItemClick}
          />
        </CardContent>
      </Card>
    </div>
  );
}
