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
  Building2,
  Phone,
  Mail,
  MapPin,
  Star,
  StarHalf,
  Eye,
  Edit,
  MoreHorizontal,
  TrendingUp,
  Package,
  Clock,
  DollarSign,
} from 'lucide-react';

// Mock supplier data
const suppliersData = [
  {
    id: 'sup-001',
    name: 'Steel Corp International',
    code: 'SCI-001',
    category: 'Raw Materials',
    contact: 'Michael Johnson',
    email: 'mjohnson@steelcorp.com',
    phone: '+1 (555) 123-4567',
    location: 'Pittsburgh, PA',
    rating: 4.5,
    status: 'ACTIVE',
    totalOrders: 156,
    onTimeDelivery: 96,
    qualityScore: 98,
    avgLeadTime: 5,
    ytdSpend: 125000,
  },
  {
    id: 'sup-002',
    name: 'Metal Supplies Inc',
    code: 'MSI-002',
    category: 'Raw Materials',
    contact: 'Sarah Williams',
    email: 'swilliams@metalsupplies.com',
    phone: '+1 (555) 234-5678',
    location: 'Cleveland, OH',
    rating: 4.8,
    status: 'ACTIVE',
    totalOrders: 89,
    onTimeDelivery: 98,
    qualityScore: 99,
    avgLeadTime: 3,
    ytdSpend: 87500,
  },
  {
    id: 'sup-003',
    name: 'Precision Parts Co',
    code: 'PPC-003',
    category: 'Components',
    contact: 'David Chen',
    email: 'dchen@precisionparts.com',
    phone: '+1 (555) 345-6789',
    location: 'Detroit, MI',
    rating: 4.2,
    status: 'ACTIVE',
    totalOrders: 234,
    onTimeDelivery: 92,
    qualityScore: 95,
    avgLeadTime: 7,
    ytdSpend: 198000,
  },
  {
    id: 'sup-004',
    name: 'Electronics Pro',
    code: 'EP-004',
    category: 'Electronics',
    contact: 'Jennifer Lee',
    email: 'jlee@electronicspro.com',
    phone: '+1 (555) 456-7890',
    location: 'San Jose, CA',
    rating: 4.6,
    status: 'ACTIVE',
    totalOrders: 67,
    onTimeDelivery: 94,
    qualityScore: 97,
    avgLeadTime: 10,
    ytdSpend: 156000,
  },
  {
    id: 'sup-005',
    name: 'Hardware World',
    code: 'HW-005',
    category: 'Consumables',
    contact: 'Robert Brown',
    email: 'rbrown@hardwareworld.com',
    phone: '+1 (555) 567-8901',
    location: 'Chicago, IL',
    rating: 3.9,
    status: 'ACTIVE',
    totalOrders: 312,
    onTimeDelivery: 88,
    qualityScore: 90,
    avgLeadTime: 2,
    ytdSpend: 45000,
  },
  {
    id: 'sup-006',
    name: 'Chemical Supplies Ltd',
    code: 'CSL-006',
    category: 'Chemicals',
    contact: 'Amanda White',
    email: 'awhite@chemsupplies.com',
    phone: '+1 (555) 678-9012',
    location: 'Houston, TX',
    rating: 4.0,
    status: 'INACTIVE',
    totalOrders: 45,
    onTimeDelivery: 85,
    qualityScore: 92,
    avgLeadTime: 8,
    ytdSpend: 32000,
  },
];

type Supplier = typeof suppliersData[0];

const statusConfig: Record<string, { label: string; variant: 'success' | 'secondary' }> = {
  ACTIVE: { label: 'Active', variant: 'success' },
  INACTIVE: { label: 'Inactive', variant: 'secondary' },
};

const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-warning text-warning" />
      ))}
      {hasHalfStar && <StarHalf className="h-4 w-4 fill-warning text-warning" />}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

export default function SuppliersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const categories = [...new Set(suppliersData.map(s => s.category))];

  const filteredSuppliers = suppliersData.filter(supplier => {
    if (statusFilter !== 'all' && supplier.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && supplier.category !== categoryFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        supplier.name.toLowerCase().includes(search) ||
        supplier.code.toLowerCase().includes(search) ||
        supplier.contact.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const columns = [
    {
      key: 'name',
      header: 'Supplier',
      render: (_: unknown, row: Supplier) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-sm text-muted-foreground">{row.code}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (value: unknown) => (
        <Badge variant="secondary">{value as string}</Badge>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (_: unknown, row: Supplier) => (
        <div className="text-sm">
          <p className="font-medium">{row.contact}</p>
          <p className="text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (value: unknown) => <RatingStars rating={value as number} />,
    },
    {
      key: 'onTimeDelivery',
      header: 'On-Time',
      render: (value: unknown) => (
        <span className={`font-medium ${(value as number) >= 95 ? 'text-success' : (value as number) >= 90 ? 'text-warning' : 'text-destructive'}`}>
          {value as number}%
        </span>
      ),
    },
    {
      key: 'ytdSpend',
      header: 'YTD Spend',
      render: (value: unknown) => (
        <span className="font-medium">${((value as number) / 1000).toFixed(0)}K</span>
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
      key: 'actions',
      header: '',
      render: (_: unknown, row: Supplier) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const stats = {
    total: suppliersData.length,
    active: suppliersData.filter(s => s.status === 'ACTIVE').length,
    avgRating: (suppliersData.reduce((sum, s) => sum + s.rating, 0) / suppliersData.length).toFixed(1),
    totalSpend: suppliersData.reduce((sum, s) => sum + s.ytdSpend, 0),
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage vendors and supplier relationships
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Suppliers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
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
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.avgRating}</p>
              </div>
              <Star className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">YTD Spend</p>
                <p className="text-2xl font-bold">${(stats.totalSpend / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-background"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <Button
            variant={statusFilter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'ACTIVE' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('ACTIVE')}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === 'INACTIVE' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('INACTIVE')}
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={filteredSuppliers}
            columns={columns}
            keyField="id"
            emptyMessage="No suppliers found"
          />
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {suppliersData
              .filter(s => s.status === 'ACTIVE')
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 3)
              .map((supplier, index) => (
                <div key={supplier.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={index === 0 ? 'default' : 'secondary'}>
                      #{index + 1}
                    </Badge>
                    <RatingStars rating={supplier.rating} />
                  </div>
                  <h3 className="font-medium">{supplier.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{supplier.category}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">On-Time</p>
                      <p className="font-medium">{supplier.onTimeDelivery}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quality</p>
                      <p className="font-medium">{supplier.qualityScore}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lead Time</p>
                      <p className="font-medium">{supplier.avgLeadTime} days</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Orders</p>
                      <p className="font-medium">{supplier.totalOrders}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
