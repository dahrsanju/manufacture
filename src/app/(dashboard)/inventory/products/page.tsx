'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DataTable,
  Badge,
  Breadcrumb,
  type Column,
} from '@/components/ui';
import { Plus, Download, Upload, Filter } from 'lucide-react';
import { productService } from '@/services';
import type { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['products', page],
    queryFn: () => productService.getProducts({ page, limit: 20 }),
  });

  const columns: Column<Product>[] = [
    {
      key: 'sku',
      header: 'SKU',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">{String(value)}</span>
      ),
    },
    {
      key: 'name',
      header: 'Product Name',
      sortable: true,
      render: (value) => (
        <span className="font-medium">{String(value)}</span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (value) => formatCurrency(Number(value)),
      className: 'text-right',
    },
    {
      key: 'cost',
      header: 'Cost',
      sortable: true,
      render: (value) => formatCurrency(Number(value)),
      className: 'text-right',
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const status = String(value);
        const variant = status === 'active'
          ? 'success'
          : status === 'low_stock'
          ? 'warning'
          : 'destructive';
        const label = status === 'active'
          ? 'In Stock'
          : status === 'low_stock'
          ? 'Low Stock'
          : 'Out of Stock';
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      key: 'isActive',
      header: 'Active',
      render: (value) => (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      ),
    },
  ];

  const handleRowClick = (product: Product) => {
    router.push(`/inventory/products/${product.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => router.push('/inventory/products/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                All Products
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Low Stock
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Out of Stock
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data?.items || []}
            columns={columns}
            keyField="id"
            searchable
            searchPlaceholder="Search products..."
            onRowClick={handleRowClick}
            isLoading={isLoading}
            emptyMessage="No products found. Click 'Add Product' to create one."
          />

          {/* Pagination */}
          {data?.pagination && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {data.pagination.page} of {data.pagination.totalPages}
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
                  disabled={page >= (data.pagination.totalPages || 1)}
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
