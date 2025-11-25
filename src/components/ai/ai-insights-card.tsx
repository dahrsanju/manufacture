'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
} from '@/components/ui';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'prediction' | 'trend' | 'recommendation' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionLabel?: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

interface AIInsightsCardProps {
  insights: AIInsight[];
  title?: string;
  onActionClick?: (insight: AIInsight) => void;
}

const typeConfig = {
  prediction: {
    icon: Target,
    color: 'bg-primary',
    label: 'Prediction',
  },
  trend: {
    icon: TrendingUp,
    color: 'bg-success',
    label: 'Trend',
  },
  recommendation: {
    icon: Lightbulb,
    color: 'bg-warning',
    label: 'Recommendation',
  },
  risk: {
    icon: AlertTriangle,
    color: 'bg-destructive',
    label: 'Risk',
  },
};

const impactColors = {
  high: 'text-destructive',
  medium: 'text-warning',
  low: 'text-muted-foreground',
};

export function AIInsightsCard({
  insights,
  title = 'AI Insights',
  onActionClick,
}: AIInsightsCardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {title}
          <Badge variant="secondary" className="ml-auto">
            {insights.length} insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No insights available
          </p>
        ) : (
          insights.map((insight) => {
            const config = typeConfig[insight.type];
            const Icon = config.icon;
            const isExpanded = expandedId === insight.id;

            return (
              <div
                key={insight.id}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : insight.id)}
                >
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{insight.title}</p>
                      <Badge variant="secondary" className="text-xs">
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {insight.description}
                    </p>
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Confidence</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${insight.confidence}%` }}
                              />
                            </div>
                            <span className="font-medium">{insight.confidence}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Impact</span>
                          <span className={`font-medium capitalize ${impactColors[insight.impact]}`}>
                            {insight.impact}
                          </span>
                        </div>
                        {insight.actionLabel && (
                          <Button
                            size="sm"
                            className="w-full mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              onActionClick?.(insight);
                            }}
                          >
                            {insight.actionLabel}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

// Anomaly Detection Badge Component
interface AnomalyBadgeProps {
  score: number; // 0-100, higher = more anomalous
  label?: string;
  tooltip?: string;
  onClick?: () => void;
}

export function AnomalyBadge({ score, label, tooltip, onClick }: AnomalyBadgeProps) {
  const getColor = () => {
    if (score >= 80) return 'bg-destructive text-white';
    if (score >= 60) return 'bg-warning text-white';
    if (score >= 40) return 'bg-yellow-500 text-white';
    return 'bg-muted text-muted-foreground';
  };

  const getIcon = () => {
    if (score >= 60) return <AlertTriangle className="h-3 w-3" />;
    if (score >= 40) return <Zap className="h-3 w-3" />;
    return null;
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getColor()}`}
      title={tooltip || `Anomaly score: ${score}%`}
    >
      {getIcon()}
      {label || `${score}%`}
    </button>
  );
}

export default AIInsightsCard;
