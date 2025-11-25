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
  Input,
  Breadcrumb,
  DataTable,
} from '@/components/ui';
import {
  Plus,
  Search,
  Package,
  Layers,
  Copy,
  Eye,
  Edit,
  MoreHorizontal,
} from 'lucide-react';

// Mock BOM data
const bomData = [
  {
    id: 'bom-001',
    name: 'Widget Pro X100 Assembly',
    productSku: 'SKU-001',
    productName: 'Widget Pro X100',
    version: '2.1',
    status: 'ACTIVE',
    components: 12,
    totalCost: 45.50,
    lastModified: '2024-11-20',
    createdBy: 'John Smith',
  },
  {
    id: 'bom-002',
    name: 'Assembly Kit AK-50',
    productSku: 'SKU-003',
    productName: 'Assembly Kit AK-50',
    version: '1.3',
    status: 'ACTIVE',
    components: 8,
    totalCost: 125.00,
    lastModified: '2024-11-18',
    createdBy: 'Jane Doe',
  },
  {
    id: 'bom-003',
    name: 'Finished Product FP-01',
    productSku: 'SKU-004',
    productName: 'Finished Product FP-01',
    version: '3.0',
    status: 'ACTIVE',
    components: 15,
    totalCost: 89.75,
    lastModified: '2024-11-15',
    createdBy: 'Bob Wilson',
  },
  {
    id: 'bom-004',
    name: 'Widget Pro X100 (Legacy)',
    productSku: 'SKU-001',
    productName: 'Widget Pro X100',
    version: '1.5',
    status: 'ARCHIVED',
    components: 10,
    totalCost: 42.00,
    lastModified: '2024-10-01',
    createdBy: 'John Smith',
  },
  {
    id: 'bom-005',
    name: 'Custom Assembly CA-100',
    productSku: 'SKU-005',
    productName: 'Custom Assembly CA-100',
    version: '1.0',
    status: 'DRAFT',
    components: 6,
    totalCost: 67.25,
    lastModified: '2024-11-22',
    createdBy: 'Alice Brown',
  },
];

type BOM = typeof bomData[0];

const statusConfig: Record<string, { label: string; variant: 'success' | 'secondary' | 'warning' }> = {
  ACTIVE: { label: 'Active', variant: 'success' },
  DRAFT: { label: 'Draft', variant: 'warning' },
  ARCHIVED: { label: 'Archived', variant: 'secondary' },
};

export default function BOMListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBOMs = bomData.filter(bom => {
    if (statusFilter !== 'all' && bom.status !== statusFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        bom.name.toLowerCase().includes(search) ||
        bom.productSku.toLowerCase().includes(search) ||
        bom.productName.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const columns = [
    {
      key: 'name',
      header: 'BOM Name',
      render: (_: unknown, row: BOM) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-sm text-muted-foreground">v{row.version}</p>
        </div>
      ),
    },
    {
      key: 'productName',
      header: 'Product',
      render: (_: unknown, row: BOM) => (
        <div>
          <p>{row.productName}</p>
          <p className="text-sm text-muted-foreground">{row.productSku}</p>
        </div>
      ),
    },
    {
      key: 'components',
      header: 'Components',
      render: (value: unknown) => (
        <div className="flex items-center gap-1">
          <Layers className="h-4 w-4 text-muted-foreground" />
          {value as number}
        </div>
      ),
    },
    {
      key: 'totalCost',
      header: 'Total Cost',
      render: (value: unknown) => (
        <span className="font-medium">${(value as number).toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: unknown) => (
        <Badge variant={statusConfig[value as string]?.variant || 'secondary'}>
          {statusConfig[value as string]?.label || (value as string)}
        </Badge>
      ),
    },
    {
      key: 'lastModified',
      header: 'Last Modified',
      render: (value: unknown) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: '',
      render: (_: unknown, row: BOM) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/production/bom/${row.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const stats = {
    total: bomData.length,
    active: bomData.filter(b => b.status === 'ACTIVE').length,
    draft: bomData.filter(b => b.status === 'DRAFT').length,
    archived: bomData.filter(b => b.status === 'ARCHIVED').length,
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bill of Materials</h1>
          <p className="text-muted-foreground">
            Manage product compositions and component lists
          </p>
        </div>
        <Button onClick={() => router.push('/production/bom/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create BOM
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total BOMs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold">{stats.draft}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Archived</p>
                <p className="text-2xl font-bold">{stats.archived}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search BOMs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'ACTIVE', 'DRAFT', 'ARCHIVED'].map((status) => (
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
      </div>

      {/* BOM Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={filteredBOMs}
            columns={columns}
            keyField="id"
            emptyMessage="No bills of materials found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
