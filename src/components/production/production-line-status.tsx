'use client';

import { Card, CardContent, Badge } from '@/components/ui';
import { Activity, AlertTriangle, CheckCircle, Pause, Play, Clock } from 'lucide-react';

interface ProductionLine {
  id: string;
  name: string;
  status: 'running' | 'idle' | 'maintenance' | 'error';
  efficiency: number;
  currentProduct: string;
  completedUnits: number;
  targetUnits: number;
  operator: string;
  lastUpdate: string;
}

interface ProductionLineStatusProps {
  lines: ProductionLine[];
  onLineClick?: (line: ProductionLine) => void;
}

const mockLines: ProductionLine[] = [
  { id: 'pl-1', name: 'Assembly Line 1', status: 'running', efficiency: 94, currentProduct: 'Widget Pro X100', completedUnits: 450, targetUnits: 500, operator: 'John Smith', lastUpdate: '2 min ago' },
  { id: 'pl-2', name: 'Assembly Line 2', status: 'running', efficiency: 87, currentProduct: 'Component B-200', completedUnits: 280, targetUnits: 350, operator: 'Sarah Johnson', lastUpdate: '1 min ago' },
  { id: 'pl-3', name: 'Packaging Line', status: 'idle', efficiency: 0, currentProduct: '-', completedUnits: 0, targetUnits: 0, operator: '-', lastUpdate: '15 min ago' },
  { id: 'pl-4', name: 'Quality Check', status: 'running', efficiency: 98, currentProduct: 'Batch B-089', completedUnits: 120, targetUnits: 125, operator: 'Mike Wilson', lastUpdate: '30 sec ago' },
  { id: 'pl-5', name: 'CNC Machine 1', status: 'maintenance', efficiency: 0, currentProduct: '-', completedUnits: 0, targetUnits: 0, operator: 'Tech Team', lastUpdate: '1 hour ago' },
  { id: 'pl-6', name: 'CNC Machine 2', status: 'error', efficiency: 0, currentProduct: 'Part C-300', completedUnits: 45, targetUnits: 100, operator: 'Emily Davis', lastUpdate: '5 min ago' },
];

const statusConfig = {
  running: { icon: Play, color: 'text-success', bg: 'bg-success/10', label: 'Running' },
  idle: { icon: Pause, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Idle' },
  maintenance: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Maintenance' },
  error: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Error' },
};

export function ProductionLineStatus({
  lines = mockLines,
  onLineClick,
}: ProductionLineStatusProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lines.map((line) => {
        const config = statusConfig[line.status];
        const Icon = config.icon;
        const progress = line.targetUnits > 0 ? (line.completedUnits / line.targetUnits) * 100 : 0;

        return (
          <Card
            key={line.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onLineClick?.(line)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium">{line.name}</h3>
                  <p className="text-sm text-muted-foreground">{line.currentProduct}</p>
                </div>
                <div className={`p-2 rounded-full ${config.bg}`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
              </div>

              {line.status === 'running' && (
                <>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{line.completedUnits}/{line.targetUnits}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Efficiency</span>
                    <span className={line.efficiency >= 90 ? 'text-success' : line.efficiency >= 70 ? 'text-warning' : 'text-destructive'}>
                      {line.efficiency}%
                    </span>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t text-sm">
                <span className="text-muted-foreground">{line.operator}</span>
                <span className="text-xs text-muted-foreground">{line.lastUpdate}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
