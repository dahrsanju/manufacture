'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Breadcrumb,
  Select,
} from '@/components/ui';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Package,
  Factory,
  DollarSign,
  Users,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Loader2,
  RefreshCw,
  Play,
  Eye,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: string;
  lastGenerated: string | null;
  format: string[];
}

interface RecentReport {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  generatedBy: string;
  status: 'completed' | 'processing' | 'failed';
  fileSize: string;
  downloadUrl: string;
}

interface ScheduledReport {
  id: string;
  name: string;
  type: string;
  frequency: string;
  nextRun: string;
  recipients: string[];
  enabled: boolean;
}

interface ReportKPI {
  id: string;
  label: string;
  value: string;
  unit: string;
  change: number;
  icon: string;
}

interface ChartData {
  production: Array<{ month: string; planned: number; actual: number }>;
  inventory: Array<{ week: string; value: number }>;
  quality: Array<{ name: string; value: number; color: string }>;
}

interface TopProduct {
  name: string;
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

interface ReportsData {
  kpis: ReportKPI[];
  reportTypes: ReportType[];
  recentReports: RecentReport[];
  scheduledReports: ScheduledReport[];
  charts: ChartData;
  topProducts: TopProduct[];
  alerts: Alert[];
}

const periods = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
];

// Icon mapping helper
const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ElementType> = {
    Factory: Factory,
    Package: Package,
    CheckCircle: CheckCircle,
    DollarSign: DollarSign,
    Users: Users,
    FileText: FileText,
    Clock: Clock,
  };
  return icons[iconName] || FileText;
};

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['reports', selectedPeriod],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/reports?period=${selectedPeriod}`);
      return response.data.data as ReportsData;
    },
    refetchInterval: 60000,
  });

  // Mutation for generating a report
  const generateReportMutation = useMutation({
    mutationFn: async (reportTypeId: string) => {
      const response = await axios.post('/api/v1/reports/generate', {
        reportTypeId,
        period: selectedPeriod,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

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

  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'processing':
        return <Badge variant="warning">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Loading reports data...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p className="mt-4 text-destructive font-medium">Failed to load reports</p>
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
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Business intelligence and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            options={periods}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-40"
          />
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Custom Range
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {(data?.kpis ?? []).map((kpi) => {
          const Icon = getIconComponent(kpi.icon);
          const isPositive = kpi.change >= 0;
          return (
            <Card key={kpi.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl font-bold">
                      {kpi.value}
                      {kpi.unit && <span className="text-sm font-normal ml-1">{kpi.unit}</span>}
                    </p>
                  </div>
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(kpi.change)}% vs last period
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Production Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Production Performance</CardTitle>
            <CardDescription>Planned vs actual output by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.charts.production || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="planned" fill="#94a3b8" name="Planned" />
                <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Value Trend</CardTitle>
            <CardDescription>Weekly inventory valuation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.charts.inventory || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Value']} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quality & Top Products */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Quality Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Overview</CardTitle>
            <CardDescription>Inspection results breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data?.charts.quality || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {(data?.charts.quality || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {(data?.charts.quality || []).map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(data?.topProducts ?? []).map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.units} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.revenue.toLocaleString()}</p>
                    <p className={`text-sm ${product.growth >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {product.growth >= 0 ? '+' : ''}{product.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Generate and download detailed reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(data?.reportTypes ?? []).map((report) => {
              const Icon = getIconComponent(report.icon);
              return (
                <div
                  key={report.id}
                  className="p-4 border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => generateReportMutation.mutate(report.id)}
                      disabled={generateReportMutation.isPending}
                    >
                      {generateReportMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <h3 className="font-medium mt-3">{report.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                  {report.lastGenerated && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex gap-1 mt-2">
                    {(report.format ?? []).map((fmt) => (
                      <Badge key={fmt} variant="secondary" className="text-xs">
                        {fmt}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Recently generated reports available for download</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Report Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Generated</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">By</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Size</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentReports ?? []).map((report) => (
                  <tr key={report.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{report.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{report.type}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(report.generatedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{report.generatedBy}</td>
                    <td className="py-3 px-4 text-center">{getStatusBadge(report.status)}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{report.fileSize}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Download"
                          disabled={report.status !== 'completed'}
                          onClick={() => window.open(report.downloadUrl, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!data?.recentReports || data.recentReports.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent reports available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>Automated report generation schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Report Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Frequency</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Next Run</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Recipients</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {(data?.scheduledReports ?? []).map((report) => (
                  <tr key={report.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{report.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{report.type}</td>
                    <td className="py-3 px-4 text-muted-foreground capitalize">{report.frequency}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(report.nextRun).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(report.recipients ?? []).slice(0, 2).map((recipient) => (
                          <Badge key={recipient} variant="secondary" className="text-xs">
                            {recipient}
                          </Badge>
                        ))}
                        {(report.recipients ?? []).length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{(report.recipients ?? []).length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {report.enabled ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Paused</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!data?.scheduledReports || data.scheduledReports.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No scheduled reports configured
            </p>
          )}
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Alerts & Insights</CardTitle>
          <CardDescription>AI-generated recommendations and warnings</CardDescription>
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
