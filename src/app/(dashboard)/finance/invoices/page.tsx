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
  Filter,
  Download,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  items: number;
}

// Mock invoices
const invoices: Invoice[] = [
  {
    id: 'inv-001',
    number: 'INV-2024-0123',
    customer: 'ABC Manufacturing',
    date: '2024-11-20',
    dueDate: '2024-12-20',
    amount: 15750.00,
    status: 'SENT',
    items: 5,
  },
  {
    id: 'inv-002',
    number: 'INV-2024-0122',
    customer: 'XYZ Corp',
    date: '2024-11-18',
    dueDate: '2024-12-18',
    amount: 8500.00,
    status: 'PAID',
    items: 3,
  },
  {
    id: 'inv-003',
    number: 'INV-2024-0121',
    customer: 'Global Industries',
    date: '2024-11-15',
    dueDate: '2024-11-30',
    amount: 32000.00,
    status: 'OVERDUE',
    items: 8,
  },
  {
    id: 'inv-004',
    number: 'INV-2024-0120',
    customer: 'Tech Solutions',
    date: '2024-11-10',
    dueDate: '2024-12-10',
    amount: 4250.00,
    status: 'DRAFT',
    items: 2,
  },
  {
    id: 'inv-005',
    number: 'INV-2024-0119',
    customer: 'Prime Supplies',
    date: '2024-11-05',
    dueDate: '2024-12-05',
    amount: 18900.00,
    status: 'PAID',
    items: 6,
  },
];

const statusConfig: Record<string, { variant: 'default' | 'success' | 'warning' | 'secondary'; icon: typeof CheckCircle }> = {
  DRAFT: { variant: 'secondary', icon: FileText },
  SENT: { variant: 'default', icon: Send },
  PAID: { variant: 'success', icon: CheckCircle },
  OVERDUE: { variant: 'warning', icon: AlertTriangle },
  CANCELLED: { variant: 'secondary', icon: FileText },
};

export default function InvoicesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices
    .filter((inv) => inv.status === 'OVERDUE')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === 'SENT')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const columns = [
    {
      key: 'number',
      header: 'Invoice #',
      render: (value: unknown) => (
        <span className="font-mono font-medium">{value as string}</span>
      ),
    },
    { key: 'customer', header: 'Customer' },
    {
      key: 'date',
      header: 'Date',
      render: (value: unknown) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (value: unknown, row: Invoice) => {
        const isOverdue = new Date(value as string) < new Date() && row.status !== 'PAID';
        return (
          <span className={isOverdue ? 'text-destructive font-medium' : ''}>
            {new Date(value as string).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (value: unknown) => (
        <span className="font-medium">${(value as number).toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: unknown) => {
        const config = statusConfig[value as string];
        const Icon = config.icon;
        return (
          <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {value as string}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage customer invoices and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push('/finance/invoices/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Invoiced</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">${paidAmount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">${pendingAmount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">${overdueAmount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
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
                placeholder="Search invoices..."
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

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>
            {filteredInvoices.length} invoices found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredInvoices}
            columns={columns}
            keyField="id"
            onRowClick={(row) => router.push(`/finance/invoices/${row.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
