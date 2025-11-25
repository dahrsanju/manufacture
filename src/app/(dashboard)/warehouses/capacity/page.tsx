'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Gauge, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

// TypeScript interfaces
interface CapacitySummary {
  totalCapacity: number;
  totalUsed: number;
  totalAvailable: number;
  overallUtilization: number;
  alertCount: number;
}

interface WarehouseCapacity {
  warehouseId: string;
  warehouseName: string;
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
  utilizationPercent: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  alerts: {
    type: 'warning' | 'critical';
    message: string;
  }[];
  zoneBreakdown: {
    zoneId: string;
    zoneName: string;
    capacity: number;
    used: number;
    percent: number;
  }[];
}

interface CapacityResponse {
  success: boolean;
  data: {
    summary: CapacitySummary;
    warehouses: WarehouseCapacity[];
  };
}

// Fetch capacity data
const fetchCapacity = async (): Promise<CapacityResponse> => {
  const response = await axios.get('/api/v1/warehouses/capacity');
  return response.data;
};

export default function WarehouseCapacityPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['warehouses', 'capacity'],
    queryFn: fetchCapacity,
  });

  const summary = data?.data?.summary;
  const warehouses = data?.data?.warehouses || [];

  // Get all alerts from all warehouses
  const allAlerts = warehouses.flatMap(wh =>
    wh.alerts.map(alert => ({
      ...alert,
      warehouseName: wh.warehouseName,
    }))
  );

  // Get trend icon
  const getTrendIcon = (trend: WarehouseCapacity['trend']) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Get utilization color
  const getUtilizationColor = (percent: number) => {
    if (percent > 90) return 'bg-red-500';
    if (percent > 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Warehouse Capacity</h1>
        <p className="text-muted-foreground mt-1">
          Monitor storage utilization across all warehouse locations
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading capacity data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load capacity data. Please try again.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Display */}
      {!isLoading && !error && summary && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Capacity</p>
                    <p className="text-2xl font-bold">{summary.totalCapacity.toLocaleString()}</p>
                  </div>
                  <Gauge className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Used</p>
                    <p className="text-2xl font-bold">{summary.totalUsed.toLocaleString()}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {Math.round((summary.totalUsed / summary.totalCapacity) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Utilization</p>
                    <p className="text-2xl font-bold">{summary.overallUtilization}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Alerts</p>
                    <p className="text-2xl font-bold">{summary.alertCount}</p>
                  </div>
                  <AlertTriangle className={`h-8 w-8 ${summary.alertCount > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Section */}
          {allAlerts.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  Capacity Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {allAlerts.map((alert, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        alert.type === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-sm">
                        <strong>{alert.warehouseName}:</strong> {alert.message}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Warehouse Capacity List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Capacity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {warehouses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Gauge className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">No Warehouses Found</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Add warehouses to start monitoring capacity utilization.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {warehouses.map((warehouse) => (
                    <div key={warehouse.warehouseId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{warehouse.warehouseName}</h3>
                          {getTrendIcon(warehouse.trend)}
                          {warehouse.alerts.length > 0 && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              warehouse.alerts.some(a => a.type === 'critical') ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {warehouse.alerts.length} alert{warehouse.alerts.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold">{warehouse.utilizationPercent}%</span>
                          <p className="text-sm text-muted-foreground">
                            {warehouse.usedCapacity.toLocaleString()} / {warehouse.totalCapacity.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Main Progress Bar */}
                      <div className="mb-4">
                        <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getUtilizationColor(warehouse.utilizationPercent)} transition-all duration-300`}
                            style={{ width: `${warehouse.utilizationPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Zone Breakdown */}
                      {warehouse.zoneBreakdown && warehouse.zoneBreakdown.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium text-muted-foreground mb-3">Zone Breakdown</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {warehouse.zoneBreakdown.map((zone) => (
                              <div key={zone.zoneId} className="flex items-center gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="truncate">{zone.zoneName}</span>
                                    <span className="font-medium">{zone.percent}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${getUtilizationColor(zone.percent)}`}
                                      style={{ width: `${zone.percent}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Overall Status */}
          {summary.alertCount === 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">All Systems Normal</p>
                    <p className="text-sm text-green-600">
                      All warehouses are operating within normal capacity ranges.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
