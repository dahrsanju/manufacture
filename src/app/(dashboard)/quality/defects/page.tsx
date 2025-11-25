'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { TriangleAlert, Plus, Search, Filter, Loader2, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Defect {
  id: string;
  defectNumber: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  product: string;
  productId: string;
  status: 'open' | 'investigating' | 'in_progress' | 'resolved' | 'closed';
  reportedDate: string;
  assignedTo: string;
  description: string;
  rootCause?: string;
  correctiveAction?: string;
}

interface DefectsResponse {
  items: Defect[];
  total: number;
  open: number;
  critical: number;
  resolutionRate: number;
}

export default function DefectsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['quality-defects'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/quality/defects');
      return response.data.data as DefectsResponse;
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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
      case 'investigating':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'resolved':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'closed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Defect Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Log and track product defects and quality issues
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Report Defect
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search defects..."
            className="w-full pl-9 pr-4 py-2 border rounded-md bg-background"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Defects</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '--' : data?.total || 0}
                </p>
              </div>
              <TriangleAlert className="h-8 w-8 text-primary" />
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
              <TriangleAlert className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '--' : data?.critical || 0}
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '--' : `${data?.resolutionRate || 0}%`}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Defects Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TriangleAlert className="h-5 w-5" />
            Defect Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-destructive">Failed to load defects</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please try again later
              </p>
            </div>
          ) : data?.items && data.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Defect #</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Severity</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Reported Date</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.items ?? []).map((defect) => (
                    <tr key={defect.id} className="border-b hover:bg-muted/50 cursor-pointer">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{defect.defectNumber}</span>
                      </td>
                      <td className="py-3 px-4">{defect.type}</td>
                      <td className="py-3 px-4">
                        <span className={cn('text-xs px-2 py-1 rounded-full capitalize', getSeverityColor(defect.severity))}>
                          {defect.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4">{defect.product}</td>
                      <td className="py-3 px-4">
                        <span className={cn('text-xs px-2 py-1 rounded-full capitalize', getStatusColor(defect.status))}>
                          {defect.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {formatDate(defect.reportedDate)}
                      </td>
                      <td className="py-3 px-4">{defect.assignedTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TriangleAlert className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">No Defects Found</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                No defects have been reported yet. Click &quot;Report Defect&quot; to log a new issue.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
