'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { FileWarning, Plus, Search, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface NCR {
  id: string;
  ncrNumber: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'under_investigation' | 'pending_disposition' | 'closed' | 'voided';
  disposition?: string;
  createdDate: string;
  description: string;
  affectedProduct?: string;
  quantity?: number;
  assignedTo?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
}

interface NCRsResponse {
  items: NCR[];
  total: number;
  open: number;
  underInvestigation: number;
  closed: number;
}

export default function NCRPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['quality-ncrs'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/quality/ncrs');
      return response.data.data as NCRsResponse;
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'under_investigation':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'pending_disposition':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'closed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'voided':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Non-Conformance Reports</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track non-conformance reports (NCRs)
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create NCR
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search NCRs..."
            className="w-full pl-9 pr-4 py-2 border rounded-md bg-background"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total NCRs</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '--' : data?.total || 0}
                </p>
              </div>
              <FileWarning className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '--' : data?.open || 0}
                </p>
              </div>
              <FileWarning className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Under Investigation</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '--' : data?.underInvestigation || 0}
                </p>
              </div>
              <FileWarning className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NCR Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileWarning className="h-5 w-5" />
            NCR List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-destructive">Failed to load NCRs</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please try again later
              </p>
            </div>
          ) : data?.items && data.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">NCR #</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Priority</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Disposition</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.items ?? []).map((ncr) => (
                    <tr key={ncr.id} className="border-b hover:bg-muted/50 cursor-pointer">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{ncr.ncrNumber}</span>
                      </td>
                      <td className="py-3 px-4">{ncr.type}</td>
                      <td className="py-3 px-4">
                        <span className={cn('text-xs px-2 py-1 rounded-full capitalize', getPriorityColor(ncr.priority))}>
                          {ncr.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('text-xs px-2 py-1 rounded-full', getStatusColor(ncr.status))}>
                          {formatStatus(ncr.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {ncr.disposition || <span className="text-muted-foreground">--</span>}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {formatDate(ncr.createdDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileWarning className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">No NCRs Found</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                No non-conformance reports have been created yet. Click &quot;Create NCR&quot; to log a new report.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
