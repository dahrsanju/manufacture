'use client';

import { Card, CardContent } from '@/components/ui';
import { Sparkline } from '@/components/charts';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  format?: 'number' | 'currency' | 'percentage';
  trend?: {
    change: number;
    direction: 'up' | 'down' | 'stable';
  };
  sparklineData?: number[];
  isLoading?: boolean;
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  format = 'number',
  trend,
  sparklineData,
  isLoading,
  onClick,
}: KPICardProps) {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;

    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;

    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />;
      case 'down':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';

    switch (trend.direction) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            {sparklineData && (
              <div className="h-8 w-full bg-muted rounded animate-pulse" />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Card
        className={onClick ? 'cursor-pointer hover:border-primary/50 transition-colors' : ''}
        onClick={onClick}
      >
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{title}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold">{formatValue(value)}</p>
                {trend && (
                  <span className={`flex items-center text-xs ${getTrendColor()}`}>
                    {getTrendIcon()}
                    <span className="ml-0.5">
                      {trend.change > 0 ? '+' : ''}
                      {trend.change}%
                    </span>
                  </span>
                )}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${iconBgColor}`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
          </div>

          {sparklineData && sparklineData.length > 0 && (
            <div className="mt-3 h-8">
              <Sparkline
                data={sparklineData}
                color={
                  trend?.direction === 'up'
                    ? '#22c55e'
                    : trend?.direction === 'down'
                    ? '#ef4444'
                    : '#6b7280'
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Metric card variant for percentage-based metrics
interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  positive?: boolean;
  isLoading?: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  positive = true,
  isLoading,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-8 w-16 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
          <Icon className="h-4 w-4" />
          {title}
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <span className={`text-sm ${positive ? 'text-success' : 'text-destructive'}`}>
              {change}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
