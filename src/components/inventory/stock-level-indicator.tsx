'use client';

import { Badge } from '@/components/ui';
import { AlertTriangle, CheckCircle, XCircle, TrendingDown } from 'lucide-react';

interface StockLevelIndicatorProps {
  current: number;
  minimum: number;
  maximum?: number;
  reorderPoint?: number;
  unit?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StockLevelIndicator({
  current,
  minimum,
  maximum,
  reorderPoint,
  unit = 'units',
  showLabel = true,
  size = 'md',
}: StockLevelIndicatorProps) {
  const getStatus = () => {
    if (current === 0) return 'out_of_stock';
    if (current <= minimum) return 'critical';
    if (reorderPoint && current <= reorderPoint) return 'low';
    if (maximum && current >= maximum) return 'overstock';
    return 'normal';
  };

  const status = getStatus();

  const statusConfig = {
    out_of_stock: {
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      barColor: 'bg-destructive',
      label: 'Out of Stock',
      variant: 'secondary' as const,
    },
    critical: {
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      barColor: 'bg-destructive',
      label: 'Critical',
      variant: 'secondary' as const,
    },
    low: {
      icon: TrendingDown,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      barColor: 'bg-warning',
      label: 'Low Stock',
      variant: 'warning' as const,
    },
    overstock: {
      icon: AlertTriangle,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      barColor: 'bg-primary',
      label: 'Overstock',
      variant: 'default' as const,
    },
    normal: {
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      barColor: 'bg-success',
      label: 'In Stock',
      variant: 'success' as const,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  // Calculate percentage for bar
  const maxValue = maximum || Math.max(current * 2, minimum * 3);
  const percentage = Math.min((current / maxValue) * 100, 100);

  const sizeClasses = {
    sm: { bar: 'h-1', text: 'text-xs', icon: 'h-3 w-3' },
    md: { bar: 'h-2', text: 'text-sm', icon: 'h-4 w-4' },
    lg: { bar: 'h-3', text: 'text-base', icon: 'h-5 w-5' },
  };

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Icon className={`${sizeClasses[size].icon} ${config.color}`} />
            <span className={`font-medium ${sizeClasses[size].text}`}>
              {current.toLocaleString()} {unit}
            </span>
          </div>
          <Badge variant={config.variant} className={sizeClasses[size].text}>
            {config.label}
          </Badge>
        </div>
      )}
      <div className={`w-full ${config.bgColor} rounded-full overflow-hidden ${sizeClasses[size].bar}`}>
        <div
          className={`${sizeClasses[size].bar} ${config.barColor} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {(reorderPoint || minimum) && (
        <div className={`flex justify-between ${sizeClasses[size].text} text-muted-foreground`}>
          <span>Min: {minimum}</span>
          {reorderPoint && <span>Reorder: {reorderPoint}</span>}
          {maximum && <span>Max: {maximum}</span>}
        </div>
      )}
    </div>
  );
}

// Compact badge version
interface StockBadgeProps {
  current: number;
  minimum: number;
  reorderPoint?: number;
}

export function StockBadge({ current, minimum, reorderPoint }: StockBadgeProps) {
  const getVariant = () => {
    if (current === 0) return 'secondary';
    if (current <= minimum) return 'secondary';
    if (reorderPoint && current <= reorderPoint) return 'warning';
    return 'success';
  };

  const getLabel = () => {
    if (current === 0) return 'Out';
    if (current <= minimum) return 'Critical';
    if (reorderPoint && current <= reorderPoint) return 'Low';
    return 'OK';
  };

  return (
    <Badge variant={getVariant()}>
      {current} ({getLabel()})
    </Badge>
  );
}

export default StockLevelIndicator;
