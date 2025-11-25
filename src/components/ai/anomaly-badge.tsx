'use client';

import { useState } from 'react';
import { AlertTriangle, Zap, Info, TrendingUp, TrendingDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AnomalyBadgeProps {
  score: number; // 0-100, higher = more anomalous
  label?: string;
  type?: 'consumption' | 'quality' | 'delivery' | 'cost' | 'performance';
  explanation?: string;
  trend?: 'up' | 'down' | 'stable';
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function AnomalyBadge({
  score,
  label,
  type = 'consumption',
  explanation,
  trend,
  onClick,
  size = 'sm',
  showTooltip = true,
}: AnomalyBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getColor = () => {
    if (score >= 80) return 'bg-destructive text-destructive-foreground';
    if (score >= 60) return 'bg-warning text-warning-foreground';
    if (score >= 40) return 'bg-yellow-500 text-white';
    return 'bg-muted text-muted-foreground';
  };

  const getBorderColor = () => {
    if (score >= 80) return 'border-destructive';
    if (score >= 60) return 'border-warning';
    if (score >= 40) return 'border-yellow-500';
    return 'border-muted';
  };

  const getIcon = () => {
    if (score >= 60) return <AlertTriangle className={iconSize} />;
    if (score >= 40) return <Zap className={iconSize} />;
    return <Info className={iconSize} />;
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === 'up') return <TrendingUp className={iconSize} />;
    if (trend === 'down') return <TrendingDown className={iconSize} />;
    return null;
  };

  const getTypeLabel = () => {
    const labels = {
      consumption: 'Consumption',
      quality: 'Quality',
      delivery: 'Delivery',
      cost: 'Cost',
      performance: 'Performance',
    };
    return labels[type];
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-sm',
  };

  const iconSize = size === 'lg' ? 'h-4 w-4' : 'h-3 w-3';

  return (
    <div className="relative inline-block">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'inline-flex items-center gap-1 rounded font-medium transition-all',
          getColor(),
          sizeClasses[size],
          onClick && 'cursor-pointer hover:opacity-90',
          score >= 60 && 'animate-pulse'
        )}
      >
        {getIcon()}
        {label || `${score}%`}
        {getTrendIcon()}
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && isHovered && explanation && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className={cn(
              'absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2',
              'w-64 p-3 rounded-lg shadow-lg border bg-popover'
            )}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {getTypeLabel()} Anomaly
                </span>
                <span className={cn('text-xs font-bold', getBorderColor())}>
                  {score}%
                </span>
              </div>
              <p className="text-sm">{explanation}</p>
              {trend && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {getTrendIcon()}
                  <span>
                    {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
                  </span>
                </div>
              )}
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="border-8 border-transparent border-t-popover" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Anomaly Indicator for tables/lists
interface AnomalyIndicatorProps {
  score: number;
  showLabel?: boolean;
}

export function AnomalyIndicator({ score, showLabel = false }: AnomalyIndicatorProps) {
  const getColor = () => {
    if (score >= 80) return 'bg-destructive';
    if (score >= 60) return 'bg-warning';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-success';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn('w-2 h-2 rounded-full', getColor())} />
      {showLabel && (
        <span className="text-xs text-muted-foreground">
          {score >= 80 ? 'Critical' : score >= 60 ? 'High' : score >= 40 ? 'Medium' : 'Normal'}
        </span>
      )}
    </div>
  );
}

// Anomaly Summary Card
interface AnomalySummaryProps {
  anomalies: Array<{
    id: string;
    score: number;
    type: string;
    description: string;
  }>;
  onViewAll?: () => void;
  onDismiss?: (id: string) => void;
}

export function AnomalySummary({ anomalies, onViewAll, onDismiss }: AnomalySummaryProps) {
  if (anomalies.length === 0) return null;

  const critical = anomalies.filter((a) => a.score >= 80).length;
  const high = anomalies.filter((a) => a.score >= 60 && a.score < 80).length;

  return (
    <div className="p-4 rounded-lg border border-warning bg-warning/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <span className="font-medium">Anomalies Detected</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {critical > 0 && (
            <span className="text-destructive font-medium">{critical} Critical</span>
          )}
          {high > 0 && <span className="text-warning font-medium">{high} High</span>}
        </div>
      </div>

      <div className="space-y-2">
        {anomalies.slice(0, 3).map((anomaly) => (
          <div
            key={anomaly.id}
            className="flex items-center justify-between p-2 bg-background rounded"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <AnomalyIndicator score={anomaly.score} />
              <span className="text-sm truncate">{anomaly.description}</span>
            </div>
            {onDismiss && (
              <button
                onClick={() => onDismiss(anomaly.id)}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {anomalies.length > 3 && onViewAll && (
        <button
          onClick={onViewAll}
          className="mt-3 text-sm text-primary hover:underline"
        >
          View all {anomalies.length} anomalies
        </button>
      )}
    </div>
  );
}

export default AnomalyBadge;
