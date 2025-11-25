'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Brain,
  AlertTriangle,
  TrendingUp,
  Package,
  Factory,
  Lightbulb,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';

interface AIInsight {
  id: string;
  type: 'anomaly' | 'optimization' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  actionable: boolean;
  timestamp: string;
  relatedEntity?: {
    type: string;
    id: string;
    name: string;
  };
}

// Mock AI insights
const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'anomaly',
    title: 'Unusual stock movement detected',
    description: 'Product SKU-001 shows 340% higher consumption than forecast. Review inventory levels.',
    severity: 'high',
    confidence: 92,
    actionable: true,
    timestamp: '5 mins ago',
    relatedEntity: { type: 'product', id: 'prod-001', name: 'Widget Pro X100' },
  },
  {
    id: '2',
    type: 'optimization',
    title: 'Reorder point adjustment',
    description: 'Based on lead time analysis, consider increasing reorder point for Component A-123 from 50 to 75 units.',
    severity: 'medium',
    confidence: 87,
    actionable: true,
    timestamp: '1 hour ago',
    relatedEntity: { type: 'product', id: 'prod-002', name: 'Component A-123' },
  },
  {
    id: '3',
    type: 'prediction',
    title: 'Quality risk forecast',
    description: 'Batch B-789 shows 15% higher defect probability based on supplier history and environmental conditions.',
    severity: 'medium',
    confidence: 78,
    actionable: true,
    timestamp: '2 hours ago',
    relatedEntity: { type: 'batch', id: 'batch-789', name: 'Batch B-789' },
  },
  {
    id: '4',
    type: 'recommendation',
    title: 'Production scheduling',
    description: 'Optimize work order sequence for 12% efficiency gain. Prioritize WO-2024-0892 before WO-2024-0893.',
    severity: 'low',
    confidence: 85,
    actionable: true,
    timestamp: '3 hours ago',
  },
  {
    id: '5',
    type: 'anomaly',
    title: 'Supplier delivery delay pattern',
    description: 'Supplier SUP-003 shows increasing delivery delays. Average delay increased from 1.2 to 3.5 days.',
    severity: 'medium',
    confidence: 94,
    actionable: false,
    timestamp: '5 hours ago',
    relatedEntity: { type: 'supplier', id: 'sup-003', name: 'Global Parts Inc.' },
  },
];

const typeIcons = {
  anomaly: AlertTriangle,
  optimization: TrendingUp,
  prediction: Brain,
  recommendation: Lightbulb,
};

const typeLabels = {
  anomaly: 'Anomaly',
  optimization: 'Optimization',
  prediction: 'Prediction',
  recommendation: 'Recommendation',
};

const severityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-destructive/10 text-destructive',
  critical: 'bg-destructive text-destructive-foreground',
};

interface AIInspectorPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIInspectorPanel({ isOpen, onClose }: AIInspectorPanelProps) {
  const [insights] = useState<AIInsight[]>(mockInsights);
  const [filter, setFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredInsights = filter === 'all'
    ? insights
    : insights.filter(i => i.type === filter);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 75) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">AI Inspector</h2>
                  <p className="text-xs text-muted-foreground">
                    {insights.length} insights available
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b">
              <div className="flex gap-2 flex-wrap">
                {['all', 'anomaly', 'optimization', 'prediction', 'recommendation'].map((type) => (
                  <Button
                    key={type}
                    variant={filter === type ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(type)}
                    className="text-xs"
                  >
                    {type === 'all' ? 'All' : typeLabels[type as keyof typeof typeLabels]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Insights List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredInsights.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No insights available</p>
                  <p className="text-sm">Check back later for AI recommendations</p>
                </div>
              ) : (
                filteredInsights.map((insight) => {
                  const Icon = typeIcons[insight.type];
                  return (
                    <Card
                      key={insight.id}
                      className="p-4 hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <div className={`p-1.5 rounded ${severityColors[insight.severity]}`}>
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm leading-tight">
                                {insight.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" size="sm" className="text-xs">
                                  {typeLabels[insight.type]}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {insight.timestamp}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground">
                          {insight.description}
                        </p>

                        {/* Related Entity */}
                        {insight.relatedEntity && (
                          <div className="flex items-center gap-2 text-xs">
                            {insight.relatedEntity.type === 'product' && <Package className="h-3 w-3" />}
                            {insight.relatedEntity.type === 'batch' && <Factory className="h-3 w-3" />}
                            <span className="text-muted-foreground">
                              {insight.relatedEntity.name}
                            </span>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                              {insight.confidence}% confidence
                            </span>
                          </div>
                          {insight.actionable && (
                            <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                              Take action
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-muted/30">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  <span>AI analysis is up to date</span>
                </div>
                <span>Last updated: just now</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AIInspectorPanel;
