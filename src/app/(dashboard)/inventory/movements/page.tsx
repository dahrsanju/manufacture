'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { MoveRight, Download, Filter, Calendar, ArrowUpRight, ArrowDownRight, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StockMovement {
  id: string;
  movementNumber: string;
  type: 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'return';
  status: 'pending' | 'completed' | 'cancelled';
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  direction: 'in' | 'out';
  fromWarehouse?: string;
  toWarehouse?: string;
  reference: string;
  reason?: string;
  user: string;
  timestamp: string;
  notes?: string;
}

const typeColors: Record<string, string> = {
  receipt: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  issue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  transfer: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  adjustment: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  return: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export default function StockMovementsPage() {
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['stock-movements', page, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      if (typeFilter) params.append('type', typeFilter);

      const response = await axios.get(`/api/v1/inventory/movements?${params}`);
      return response.data.data as {
        items: StockMovement[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      };
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Stock Movements</h1>
          <p className="text-muted-foreground mt-1">
            Track all inventory movements across warehouses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Date Range
        </Button>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="">All Types</option>
          <option value="receipt">Receipt</option>
          <option value="issue">Issue</option>
          <option value="transfer">Transfer</option>
          <option value="adjustment">Adjustment</option>
          <option value="return">Return</option>
        </select>
      </div>

      {/* Movements Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MoveRight className="h-5 w-5" />
            Movement History
            {data && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({data.pagination.total} total)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-destructive">Failed to load movements</p>
            </div>
          ) : data && data.items.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Movement #</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Quantity</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Warehouse</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.items ?? []).map((movement) => (
                      <tr key={movement.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-sm">{movement.movementNumber}</td>
                        <td className="py-3 px-4">
                          <span className={cn('text-xs px-2 py-1 rounded-full capitalize', typeColors[movement.type])}>
                            {movement.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{movement.productName}</div>
                            <div className="text-xs text-muted-foreground">{movement.sku}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {movement.direction === 'in' ? (
                              <ArrowDownRight className="h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-red-500" />
                            )}
                            <span className={movement.direction === 'in' ? 'text-green-600' : 'text-red-600'}>
                              {movement.direction === 'in' ? '+' : '-'}{movement.quantity}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {movement.fromWarehouse && movement.toWarehouse ? (
                            <span>{movement.fromWarehouse} → {movement.toWarehouse}</span>
                          ) : (
                            <span>{movement.fromWarehouse || movement.toWarehouse || '-'}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn('text-xs px-2 py-1 rounded-full capitalize', statusColors[movement.status])}>
                            {movement.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{movement.user}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(movement.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <span className="text-sm text-muted-foreground">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                      disabled={page === data.pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No movements found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
