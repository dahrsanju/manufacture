'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  DataTable,
} from '@/components/ui';
import {
  Plus,
  Search,
  Download,
  Users,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  TrendingUp,
  Star,
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  country: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
  totalOrders: number;
  totalSpend: number;
  lastOrder: string;
}

// Mock customers
const customers: Customer[] = [
  {
    id: 'cust-001',
    name: 'John Anderson',
    email: 'john@abcmfg.com',
    phone: '+1 (555) 123-4567',
    company: 'ABC Manufacturing',
    city: 'New York',
    country: 'USA',
    status: 'ACTIVE',
    totalOrders: 45,
    totalSpend: 125000,
    lastOrder: '2024-11-20',
  },
  {
    id: 'cust-002',
    name: 'Sarah Chen',
    email: 'sarah@xyzcorp.com',
    phone: '+1 (555) 234-5678',
    company: 'XYZ Corp',
    city: 'Los Angeles',
    country: 'USA',
    status: 'ACTIVE',
    totalOrders: 32,
    totalSpend: 89500,
    lastOrder: '2024-11-18',
  },
  {
    id: 'cust-003',
    name: 'Michael Brown',
    email: 'michael@globalind.com',
    phone: '+1 (555) 345-6789',
    company: 'Global Industries',
    city: 'Chicago',
    country: 'USA',
    status: 'ACTIVE',
    totalOrders: 28,
    totalSpend: 156000,
    lastOrder: '2024-11-15',
  },
  {
    id: 'cust-004',
    name: 'Emily Davis',
    email: 'emily@techsol.com',
    phone: '+1 (555) 456-7890',
    company: 'Tech Solutions',
    city: 'Austin',
    country: 'USA',
    status: 'PROSPECT',
    totalOrders: 0,
    totalSpend: 0,
    lastOrder: '',
  },
  {
    id: 'cust-005',
    name: 'Robert Wilson',
    email: 'robert@primesup.com',
    phone: '+1 (555) 567-8901',
    company: 'Prime Supplies',
    city: 'Seattle',
    country: 'USA',
    status: 'INACTIVE',
    totalOrders: 12,
    totalSpend: 34500,
    lastOrder: '2024-08-10',
  },
];

const statusConfig: Record<string, { variant: 'success' | 'secondary' | 'warning' }> = {
  ACTIVE: { variant: 'success' },
  INACTIVE: { variant: 'secondary' },
  PROSPECT: { variant: 'warning' },
};

export default function CustomersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'ACTIVE').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpend, 0);
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0;

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      render: (value: unknown, row: Customer) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-medium text-primary">
              {(value as string).charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium">{value as string}</p>
            <p className="text-sm text-muted-foreground">{row.company}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      render: (value: unknown, row: Customer) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-muted-foreground" />
            {value as string}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Phone className="h-3 w-3" />
            {row.phone}
          </div>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'Location',
      render: (value: unknown, row: Customer) => (
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          {value as string}, {row.country}
        </div>
      ),
    },
    {
      key: 'totalOrders',
      header: 'Orders',
      render: (value: unknown) => (
        <span className="font-medium">{value as number}</span>
      ),
    },
    {
      key: 'totalSpend',
      header: 'Total Spend',
      render: (value: unknown) => (
        <span className="font-medium">${(value as number).toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: unknown) => (
        <Badge variant={statusConfig[value as string].variant}>
          {value as string}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push('/sales/customers/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCustomers}</p>
                <p className="text-sm text-muted-foreground">Total Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Star className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCustomers}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">${avgOrderValue.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
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
              {Object.keys(statusConfig).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            {filteredCustomers.length} customers found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredCustomers}
            columns={columns}
            keyField="id"
            onRowClick={(row) => router.push(`/sales/customers/${row.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
