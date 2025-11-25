'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { Activity, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';

interface ProductionMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface RealtimeProductionTrackerProps {
  refreshInterval?: number;
  onRefresh?: () => void;
}

const generateMockMetrics = (): ProductionMetric[] => [
  {
    id: 'm-1',
    name: 'Units Produced',
    value: Math.floor(Math.random() * 100) + 450,
    unit: 'units/hr',
    change: Math.random() * 10 - 5,
    trend: Math.random() > 0.5 ? 'up' : 'down',
    status: 'good',
  },
  {
    id: 'm-2',
    name: 'Cycle Time',
    value: Math.floor(Math.random() * 10) + 45,
    unit: 'seconds',
    change: Math.random() * 5 - 2.5,
    trend: Math.random() > 0.5 ? 'up' : 'down',
    status: Math.random() > 0.7 ? 'warning' : 'good',
  },
  {
    id: 'm-3',
    name: 'Defect Rate',
    value: Math.random() * 3 + 0.5,
    unit: '%',
    change: Math.random() * 1 - 0.5,
    trend: Math.random() > 0.5 ? 'up' : 'down',
    status: Math.random() > 0.8 ? 'critical' : 'good',
  },
  {
    id: 'm-4',
    name: 'Machine Utilization',
    value: Math.floor(Math.random() * 15) + 80,
    unit: '%',
    change: Math.random() * 5 - 2.5,
    trend: 'stable',
    status: 'good',
  },
  {
    id: 'm-5',
    name: 'Energy Consumption',
    value: Math.floor(Math.random() * 50) + 200,
    unit: 'kWh',
    change: Math.random() * 10 - 5,
    trend: Math.random() > 0.5 ? 'up' : 'down',
    status: Math.random() > 0.7 ? 'warning' : 'good',
  },
  {
    id: 'm-6',
    name: 'Throughput',
    value: Math.floor(Math.random() * 20) + 90,
    unit: '%',
    change: Math.random() * 5 - 2.5,
    trend: 'up',
    status: 'good',
  },
];

const statusColors = {
  good: 'text-success',
  warning: 'text-warning',
  critical: 'text-destructive',
};

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-success" />;
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-destructive" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

export function RealtimeProductionTracker({
  refreshInterval = 5000,
  onRefresh,
}: RealtimeProductionTrackerProps) {
  const [metrics, setMetrics] = useState<ProductionMetric[]>(generateMockMetrics());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateMockMetrics());
      setLastUpdate(new Date());
      onRefresh?.();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, onRefresh]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMetrics(generateMockMetrics());
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            <CardTitle>Real-time Production</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdate.toLocaleTimeString()}
            </span>
            <button
              onClick={handleManualRefresh}
              className="p-1 hover:bg-muted rounded"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{metric.name}</span>
                <TrendIcon trend={metric.trend} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${statusColors[metric.status]}`}>
                  {metric.name === 'Defect Rate' ? metric.value.toFixed(2) : metric.value}
                </span>
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>
              <div className="mt-2 text-xs">
                <span className={metric.change >= 0 ? 'text-success' : 'text-destructive'}>
                  {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}%
                </span>
                <span className="text-muted-foreground"> vs last hour</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
