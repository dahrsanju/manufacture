'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  Activity,
  PieChart,
  DollarSign,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface KPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changeDirection: 'up' | 'down' | 'stable';
  trend: number[];
}

interface TopProduct {
  id: string;
  name: string;
  sku: string;
  units: number;
  revenue: number;
  growth: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  action?: string;
}

interface ChartData {
  revenue: Array<{ name: string; revenue: number; orders: number }>;
  production: Array<{ name: string; planned: number; actual: number }>;
  inventory: Array<{ name: string; value: number }>;
  quality: Array<{ name: string; value: number; color: string }>;
  deliveryPerformance: Array<{ name: string; onTime: number; late: number }>;
}

interface AnalyticsData {
  kpis: KPI[];
  charts: ChartData;
  topProducts: TopProduct[];
  alerts: Alert[];
}

export default function AnalyticsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/analytics');
      return response.data.data as AnalyticsData;
    },
    refetchInterval: 60000,
  });

  // Helper to get KPI icon
  const getKPIIcon = (id: string) => {
    switch (id) {
      case 'revenue':
        return DollarSign;
      case 'orders':
        return BarChart2;
      case 'production':
        return Activity;
      case 'quality':
        return CheckCircle;
      case 'inventory':
        return Package;
      case 'delivery':
        return Clock;
      default:
        return TrendingUp;
    }
  };

  // Helper to get KPI icon color
  const getKPIIconColor = (id: string) => {
    switch (id) {
      case 'revenue':
        return 'text-green-500';
      case 'orders':
        return 'text-primary';
      case 'production':
        return 'text-blue-500';
      case 'quality':
        return 'text-purple-500';
      case 'inventory':
        return 'text-orange-500';
      case 'delivery':
        return 'text-cyan-500';
      default:
        return 'text-primary';
    }
  };

  // Helper to format value with unit
  const formatValue = (value: number, unit: string) => {
    if (unit === '$') {
      return `$${value.toLocaleString()}`;
    } else if (unit === '%') {
      return `${value}%`;
    } else if (unit) {
      return `${value.toLocaleString()} ${unit}`;
    }
    return value.toLocaleString();
  };

  // Helper to get alert styles
  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-warning/10 border-warning/20',
          icon: AlertTriangle,
          iconColor: 'text-warning',
        };
      case 'success':
        return {
          bg: 'bg-success/10 border-success/20',
          icon: CheckCircle,
          iconColor: 'text-success',
        };
      case 'info':
      default:
        return {
          bg: 'bg-primary/10 border-primary/20',
          icon: TrendingUp,
          iconColor: 'text-primary',
        };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Loading analytics data...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p className="mt-4 text-destructive font-medium">Failed to load analytics</p>
        <p className="text-sm text-muted-foreground mt-1">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Business intelligence and data analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline">
            Customize Dashboard
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {(data?.kpis ?? []).map((kpi) => {
          const Icon = getKPIIcon(kpi.id);
          const iconColor = getKPIIconColor(kpi.id);
          const isPositive = kpi.changeDirection === 'up';
          const isNegative = kpi.changeDirection === 'down';

          return (
            <Card key={kpi.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground truncate">{kpi.name}</p>
                    <p className="text-2xl font-bold">{formatValue(kpi.value, kpi.unit)}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${iconColor} flex-shrink-0`} />
                </div>
                <div className={`flex items-center mt-2 text-sm ${
                  isPositive ? 'text-success' : isNegative ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : isNegative ? (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  ) : null}
                  {kpi.change !== 0 && (
                    <span>{isPositive ? '+' : ''}{kpi.change}% vs last period</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.charts.revenue || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'revenue' ? `$${Number(value).toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Orders',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Production Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Production Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.charts.production || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="planned" fill="#94a3b8" name="Planned" />
                <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Top Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rank</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">SKU</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Units Sold</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Growth</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topProducts ?? []).map((product, index) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{product.sku}</td>
                    <td className="py-3 px-4 text-right">{product.units.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${product.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center ${
                        product.growth >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {product.growth >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {product.growth >= 0 ? '+' : ''}{product.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alerts & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(data?.alerts ?? []).map((alert) => {
              const styles = getAlertStyles(alert.type);
              const Icon = styles.icon;
              return (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${styles.bg}`}
                >
                  <Icon className={`h-5 w-5 ${styles.iconColor} mt-0.5`} />
                  <div className="flex-1">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                  {alert.action && (
                    <Button variant="ghost" size="sm">
                      {alert.action} <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              );
            })}
            {(!data?.alerts || data.alerts.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No alerts at this time
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
