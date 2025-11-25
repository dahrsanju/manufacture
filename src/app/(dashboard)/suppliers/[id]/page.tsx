'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Breadcrumb,
  DataTable,
} from '@/components/ui';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Edit,
  FileText,
  Package,
  DollarSign,
  Clock,
  Star,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

// Mock supplier detail
const supplierDetail = {
  id: 'supplier-001',
  name: 'Steel Corp International',
  code: 'SCI-001',
  status: 'ACTIVE',
  rating: 4.5,
  category: 'Raw Materials',
  contact: {
    name: 'Michael Chen',
    email: 'michael.chen@steelcorp.com',
    phone: '+1 (555) 123-4567',
    position: 'Account Manager',
  },
  address: {
    street: '123 Industrial Blvd',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    country: 'United States',
  },
  website: 'https://steelcorp.com',
  taxId: 'XX-XXXXXXX',
  paymentTerms: 'Net 30',
  currency: 'USD',
  leadTime: '5-7 days',
  minOrderValue: 1000,
  createdAt: '2023-01-15',
  stats: {
    totalOrders: 156,
    totalSpend: 2450000,
    avgOrderValue: 15705,
    onTimeDelivery: 94,
    qualityScore: 98,
    lastOrderDate: '2024-11-18',
  },
};

// Mock purchase orders
const recentOrders = [
  {
    id: 'po-001',
    number: 'PO-2024-0567',
    date: '2024-11-18',
    items: 12,
    total: 45000,
    status: 'PENDING',
  },
  {
    id: 'po-002',
    number: 'PO-2024-0523',
    date: '2024-11-05',
    items: 8,
    total: 28500,
    status: 'DELIVERED',
  },
  {
    id: 'po-003',
    number: 'PO-2024-0489',
    date: '2024-10-22',
    items: 15,
    total: 52000,
    status: 'DELIVERED',
  },
  {
    id: 'po-004',
    number: 'PO-2024-0445',
    date: '2024-10-08',
    items: 6,
    total: 18750,
    status: 'DELIVERED',
  },
];

// Mock products from supplier
const supplierProducts = [
  {
    id: 'prod-001',
    sku: 'STL-PLATE-10',
    name: 'Steel Plate 10mm',
    unitPrice: 125.00,
    unit: 'sheet',
    lastPurchased: '2024-11-18',
  },
  {
    id: 'prod-002',
    sku: 'ALU-ROD-25',
    name: 'Aluminum Rod 25mm',
    unitPrice: 45.50,
    unit: 'piece',
    lastPurchased: '2024-11-05',
  },
  {
    id: 'prod-003',
    sku: 'STL-BEAM-H',
    name: 'Steel H-Beam',
    unitPrice: 320.00,
    unit: 'meter',
    lastPurchased: '2024-10-22',
  },
  {
    id: 'prod-004',
    sku: 'COP-WIRE-2',
    name: 'Copper Wire 2mm',
    unitPrice: 8.75,
    unit: 'meter',
    lastPurchased: '2024-10-08',
  },
];

const statusVariants: Record<string, 'success' | 'warning' | 'default' | 'secondary'> = {
  ACTIVE: 'success',
  PENDING: 'warning',
  DELIVERED: 'success',
  INACTIVE: 'secondary',
};

export default function SupplierDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products'>('overview');

  const orderColumns = [
    {
      key: 'number',
      header: 'PO Number',
      render: (value: unknown) => (
        <span className="font-mono font-medium">{value as string}</span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (value: unknown) => new Date(value as string).toLocaleDateString(),
    },
    { key: 'items', header: 'Items' },
    {
      key: 'total',
      header: 'Total',
      render: (value: unknown) => `$${(value as number).toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: unknown) => (
        <Badge variant={statusVariants[value as string]}>
          {value as string}
        </Badge>
      ),
    },
  ];

  const productColumns = [
    {
      key: 'sku',
      header: 'SKU',
      render: (value: unknown) => (
        <span className="font-mono text-sm">{value as string}</span>
      ),
    },
    { key: 'name', header: 'Product Name' },
    {
      key: 'unitPrice',
      header: 'Unit Price',
      render: (value: unknown) => `$${(value as number).toFixed(2)}`,
    },
    { key: 'unit', header: 'Unit' },
    {
      key: 'lastPurchased',
      header: 'Last Purchased',
      render: (value: unknown) => new Date(value as string).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{supplierDetail.name}</h1>
              <Badge variant={statusVariants[supplierDetail.status]}>
                {supplierDetail.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span>Code: {supplierDetail.code}</span>
              <span>•</span>
              <span>{supplierDetail.category}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span>{supplierDetail.rating}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            New PO
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{supplierDetail.stats.totalOrders}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ${(supplierDetail.stats.totalSpend / 1000000).toFixed(2)}M
                </p>
                <p className="text-sm text-muted-foreground">Total Spend</p>
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
                <p className="text-2xl font-bold">{supplierDetail.stats.onTimeDelivery}%</p>
                <p className="text-sm text-muted-foreground">On-Time Delivery</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{supplierDetail.stats.qualityScore}%</p>
                <p className="text-sm text-muted-foreground">Quality Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Purchase Orders
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Products
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-medium text-primary">
                    {supplierDetail.contact.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{supplierDetail.contact.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {supplierDetail.contact.position}
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-3 border-t">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${supplierDetail.contact.email}`}
                    className="text-sm hover:underline"
                  >
                    {supplierDetail.contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{supplierDetail.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={supplierDetail.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    {supplierDetail.website}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p>{supplierDetail.address.street}</p>
                    <p>
                      {supplierDetail.address.city}, {supplierDetail.address.state}{' '}
                      {supplierDetail.address.zip}
                    </p>
                    <p>{supplierDetail.address.country}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax ID</span>
                  <span className="font-medium">{supplierDetail.taxId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Terms</span>
                  <span className="font-medium">{supplierDetail.paymentTerms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency</span>
                  <span className="font-medium">{supplierDetail.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lead Time</span>
                  <span className="font-medium">{supplierDetail.leadTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min Order Value</span>
                  <span className="font-medium">
                    ${supplierDetail.minOrderValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Order Value</span>
                  <span className="font-medium">
                    ${supplierDetail.stats.avgOrderValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Order</span>
                  <span className="font-medium">
                    {new Date(supplierDetail.stats.lastOrderDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supplier Since</span>
                  <span className="font-medium">
                    {new Date(supplierDetail.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'orders' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
            <CardDescription>
              View all purchase orders with this supplier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={recentOrders}
              columns={orderColumns}
              keyField="id"
              onRowClick={(row) => router.push(`/procurement/purchase-orders/${row.id}`)}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === 'products' && (
        <Card>
          <CardHeader>
            <CardTitle>Products from Supplier</CardTitle>
            <CardDescription>
              Products available from this supplier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={supplierProducts}
              columns={productColumns}
              keyField="id"
              onRowClick={(row) => router.push(`/inventory/products/${row.id}`)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
