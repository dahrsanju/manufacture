'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { Cpu, Plus, Search, Activity, Loader2, RefreshCw, Wrench, Settings } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface WorkCenter {
  id: string;
  code: string;
  name: string;
  type: 'machine' | 'assembly' | 'inspection' | 'packaging';
  status: 'active' | 'maintenance' | 'inactive';
  capacity: number;
  utilizationPercent: number;
  efficiency: number;
  costPerHour: number;
  location: string;
  operators: string[];
  currentWorkOrders: number;
  scheduledMaintenance?: string;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary'; color: string }> = {
  active: { label: 'Active', variant: 'success', color: 'bg-green-500' },
  maintenance: { label: 'Maintenance', variant: 'warning', color: 'bg-yellow-500' },
  inactive: { label: 'Inactive', variant: 'secondary', color: 'bg-gray-400' },
};

const typeConfig: Record<string, { label: string; icon: typeof Cpu }> = {
  machine: { label: 'Machine', icon: Cpu },
  assembly: { label: 'Assembly', icon: Settings },
  inspection: { label: 'Inspection', icon: Search },
  packaging: { label: 'Packaging', icon: Cpu },
};

export default function WorkCentersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['work-centers'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/work-centers');
      return response.data.data as WorkCenter[];
    },
  });

  // Filter work centers
  const filteredWorkCenters = data?.filter((wc) => {
    const matchesSearch = !searchTerm ||
      wc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wc.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || wc.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  // Calculate stats
  const stats = {
    totalActive: data?.filter(wc => wc.status === 'active').length || 0,
    avgEfficiency: data && data.length > 0
      ? Math.round(data.reduce((sum, wc) => sum + wc.efficiency, 0) / data.length)
      : 0,
    maintenanceDue: data?.filter(wc => wc.status === 'maintenance' || wc.scheduledMaintenance).length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Work Centers</h1>
          <p className="text-muted-foreground mt-1">
            Manage production work centers and equipment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Work Center
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search work centers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-md bg-background"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Centers</p>
                <p className="text-2xl font-bold">{stats.totalActive}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                <p className="text-2xl font-bold">{stats.avgEfficiency}%</p>
              </div>
              <Cpu className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance Due</p>
                <p className="text-2xl font-bold">{stats.maintenanceDue}</p>
              </div>
              <Wrench className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Centers Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-destructive">Failed to load work centers</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : filteredWorkCenters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkCenters.map((workCenter) => (
            <Card key={workCenter.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{workCenter.name}</CardTitle>
                    <p className="text-sm font-mono text-muted-foreground">{workCenter.code}</p>
                  </div>
                  <Badge variant={statusConfig[workCenter.status]?.variant || 'secondary'}>
                    {statusConfig[workCenter.status]?.label || workCenter.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type and Location */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className="capitalize">{typeConfig[workCenter.type]?.label || workCenter.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span>{workCenter.location}</span>
                </div>

                {/* Utilization Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className="font-medium">{workCenter.utilizationPercent}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all',
                        workCenter.utilizationPercent >= 80 ? 'bg-green-500' :
                        workCenter.utilizationPercent >= 50 ? 'bg-blue-500' :
                        'bg-yellow-500'
                      )}
                      style={{ width: `${workCenter.utilizationPercent}%` }}
                    />
                  </div>
                </div>

                {/* Efficiency */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Efficiency</span>
                  <span className={cn(
                    'font-medium',
                    workCenter.efficiency >= 90 ? 'text-green-600' :
                    workCenter.efficiency >= 75 ? 'text-blue-600' :
                    'text-yellow-600'
                  )}>
                    {workCenter.efficiency}%
                  </span>
                </div>

                {/* Current Work Orders */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Work Orders</span>
                  <span className="font-medium">{workCenter.currentWorkOrders}</span>
                </div>

                {/* Cost per Hour */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cost/Hour</span>
                  <span className="font-medium">${workCenter.costPerHour.toFixed(2)}</span>
                </div>

                {/* Operators */}
                {workCenter.operators.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Operators</p>
                    <div className="flex flex-wrap gap-1">
                      {workCenter.operators.slice(0, 3).map((operator, idx) => (
                        <span key={idx} className="text-xs bg-muted px-2 py-0.5 rounded">
                          {operator}
                        </span>
                      ))}
                      {workCenter.operators.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{workCenter.operators.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Scheduled Maintenance */}
                {workCenter.scheduledMaintenance && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-xs text-warning">
                      <Wrench className="h-3 w-3" />
                      <span>
                        Maintenance: {new Date(workCenter.scheduledMaintenance).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">No Work Centers Found</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                {searchTerm || statusFilter
                  ? 'No work centers match your search criteria. Try adjusting your filters.'
                  : 'There are no work centers configured. Click "Add Work Center" to create one.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
