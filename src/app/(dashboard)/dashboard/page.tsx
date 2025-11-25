'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, Skeleton, Button, DateRangePicker } from '@/components/ui';
import { useAuthStore, useWidgetStore } from '@/stores';
import { KPICard, MetricCard, WidgetCustomizer } from '@/components/widgets';
import { brand } from '@/config/brand';
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  Factory,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Truck,
  Settings2,
  RefreshCw,
  Plus,
  ClipboardCheck,
  ArrowRightLeft,
} from 'lucide-react';
import axios from 'axios';
import { LineChartWidget, BarChartWidget, PieChartWidget } from '@/components/charts';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

interface TrendData {
  change: number;
  direction: 'up' | 'down' | 'stable';
}

interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  pendingOrders: number;
  activeWorkOrders: number;
  todayRevenue: number;
  monthlyGrowth: number;
  qualityScore: number;
  onTimeDelivery: number;
  trends: {
    products: TrendData;
    lowStock: TrendData;
    orders: TrendData;
    workOrders: TrendData;
  };
  sparklines: {
    products: number[];
    lowStock: number[];
    orders: number[];
    workOrders: number[];
    revenue: number[];
  };
  charts: {
    revenue: Array<{ name: string; revenue: number; orders: number }>;
    production: Array<{ name: string; units: number }>;
    inventory: Array<{ name: string; value: number }>;
  };
}

interface Activity {
  id: string;
  action: string;
  item: string;
  itemId: string;
  type: 'create' | 'update' | 'complete' | 'success' | 'alert' | 'error';
  user: string;
  timestamp: string;
  module: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { widgets, isEditMode } = useWidgetStore();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Fetch dashboard stats
  const { data: stats, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/dashboard/stats');
      return response.data.data as DashboardStats;
    },
    refetchInterval: 60000, // Auto-refresh every 60 seconds
  });

  // Fetch activity feed
  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/dashboard/activity?limit=10');
      return response.data.data.items as Activity[];
    },
    refetchInterval: 30000, // Refresh activity every 30 seconds
  });

  // Helper to check if a widget is visible
  const isWidgetVisible = (widgetId: string) => {
    const widget = widgets.find((w) => w.id === widgetId);
    return widget?.visible ?? true;
  };

  // Get activity type color
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'create':
        return 'bg-primary';
      case 'update':
        return 'bg-accent';
      case 'complete':
      case 'success':
        return 'bg-success';
      case 'alert':
        return 'bg-warning';
      case 'error':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-product':
        router.push('/inventory/products/new');
        break;
      case 'work-order':
        router.push('/production/work-orders/new');
        break;
      case 'qc-inspection':
        router.push('/quality/inspections/new');
        break;
      case 'stock-transfer':
        router.push('/warehouses/transfers/new');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{brand.name} Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to {brand.name}, {user?.name || 'Demo User'}! {brand.tagline}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker />
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" onClick={() => setIsCustomizerOpen(true)}>
            <Settings2 className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>

      {/* KPI Cards with Trends & Sparklines */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-tour="kpi-cards">
        {isWidgetVisible('kpi-products') && (
          <KPICard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon={Package}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
            trend={stats?.trends.products}
            sparklineData={stats?.sparklines.products}
            isLoading={isLoading}
            onClick={() => router.push('/inventory/products')}
          />
        )}
        {isWidgetVisible('kpi-lowstock') && (
          <KPICard
            title="Low Stock Items"
            value={stats?.lowStockItems || 0}
            icon={AlertTriangle}
            iconColor="text-warning"
            iconBgColor="bg-warning/10"
            trend={stats?.trends.lowStock}
            sparklineData={stats?.sparklines.lowStock}
            isLoading={isLoading}
            onClick={() => router.push('/inventory/products?filter=low-stock')}
          />
        )}
        {isWidgetVisible('kpi-orders') && (
          <KPICard
            title="Pending Orders"
            value={stats?.pendingOrders || 0}
            icon={ShoppingCart}
            iconColor="text-accent"
            iconBgColor="bg-accent/10"
            trend={stats?.trends.orders}
            sparklineData={stats?.sparklines.orders}
            isLoading={isLoading}
            onClick={() => router.push('/sales/orders?status=pending')}
          />
        )}
        {isWidgetVisible('kpi-workorders') && (
          <KPICard
            title="Active Work Orders"
            value={stats?.activeWorkOrders || 0}
            icon={Factory}
            iconColor="text-secondary"
            iconBgColor="bg-secondary/10"
            trend={stats?.trends.workOrders}
            sparklineData={stats?.sparklines.workOrders}
            isLoading={isLoading}
            onClick={() => router.push('/production/work-orders?status=active')}
          />
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Today's Revenue"
          value={`$${(stats?.todayRevenue || 0).toLocaleString()}`}
          change={`+${stats?.monthlyGrowth || 0}%`}
          icon={DollarSign}
          positive={true}
          isLoading={isLoading}
        />
        <MetricCard
          title="Monthly Growth"
          value={`${stats?.monthlyGrowth || 0}%`}
          icon={TrendingUp}
          positive={true}
          isLoading={isLoading}
        />
        <MetricCard
          title="Quality Score"
          value={`${stats?.qualityScore || 0}%`}
          icon={CheckCircle2}
          positive={true}
          isLoading={isLoading}
        />
        <MetricCard
          title="On-Time Delivery"
          value={`${stats?.onTimeDelivery || 0}%`}
          icon={Truck}
          positive={true}
          isLoading={isLoading}
        />
      </div>

      {/* Quick Actions */}
      {isWidgetVisible('quick-actions') && (
        <Card data-tour="quick-actions">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <button
                onClick={() => handleQuickAction('add-product')}
                className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <Plus className="h-8 w-8 mb-2 text-primary" />
                <p className="font-medium">Add Product</p>
                <p className="text-sm text-muted-foreground">Create new item</p>
              </button>
              <button
                onClick={() => handleQuickAction('work-order')}
                className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <Factory className="h-8 w-8 mb-2 text-primary" />
                <p className="font-medium">Work Order</p>
                <p className="text-sm text-muted-foreground">Start production</p>
              </button>
              <button
                onClick={() => handleQuickAction('qc-inspection')}
                className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <ClipboardCheck className="h-8 w-8 mb-2 text-primary" />
                <p className="font-medium">QC Inspection</p>
                <p className="text-sm text-muted-foreground">Run quality check</p>
              </button>
              <button
                onClick={() => handleQuickAction('stock-transfer')}
                className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <ArrowRightLeft className="h-8 w-8 mb-2 text-primary" />
                <p className="font-medium">Stock Transfer</p>
                <p className="text-sm text-muted-foreground">Move inventory</p>
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {isWidgetVisible('chart-revenue') && (
          <LineChartWidget
            title="Revenue & Orders Trend"
            data={stats?.charts.revenue || []}
            dataKeys={[
              { key: 'revenue', color: '#2563eb', name: 'Revenue ($)' },
              { key: 'orders', color: '#22c55e', name: 'Orders' },
            ]}
          />
        )}
        {isWidgetVisible('chart-production') && (
          <BarChartWidget
            title="Weekly Production"
            data={stats?.charts.production || []}
            dataKey="units"
            color="#06b6d4"
          />
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {isWidgetVisible('chart-inventory') && (
          <PieChartWidget
            title="Inventory by Category"
            data={stats?.charts.inventory || []}
          />
        )}
        {isWidgetVisible('activity-feed') && (
          <Card className="md:col-span-2" data-tour="activity-feed">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <Skeleton className="w-2 h-2 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))
                ) : activityData && activityData.length > 0 ? (
                  activityData.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.item}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Widget Customizer Panel */}
      <WidgetCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />
    </div>
  );
}
