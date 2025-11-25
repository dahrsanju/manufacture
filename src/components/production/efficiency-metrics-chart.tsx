'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

interface EfficiencyData {
  date: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  target: number;
}

interface EfficiencyMetricsChartProps {
  data: EfficiencyData[];
  chartType?: 'line' | 'bar';
  showTarget?: boolean;
}

const mockData: EfficiencyData[] = [
  { date: 'Mon', oee: 85, availability: 92, performance: 88, quality: 98, target: 85 },
  { date: 'Tue', oee: 82, availability: 89, performance: 85, quality: 97, target: 85 },
  { date: 'Wed', oee: 88, availability: 94, performance: 90, quality: 98, target: 85 },
  { date: 'Thu', oee: 86, availability: 91, performance: 89, quality: 99, target: 85 },
  { date: 'Fri', oee: 90, availability: 95, performance: 92, quality: 98, target: 85 },
  { date: 'Sat', oee: 84, availability: 90, performance: 87, quality: 97, target: 85 },
  { date: 'Sun', oee: 78, availability: 85, performance: 82, quality: 96, target: 85 },
];

export function EfficiencyMetricsChart({
  data = mockData,
  chartType = 'line',
  showTarget = true,
}: EfficiencyMetricsChartProps) {
  const averageOEE = data.reduce((sum, d) => sum + d.oee, 0) / data.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Efficiency Metrics (OEE)</CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold">{averageOEE.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Average OEE</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis domain={[0, 100]} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="oee"
                  name="OEE"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
                <Line
                  type="monotone"
                  dataKey="availability"
                  name="Availability"
                  stroke="hsl(var(--success))"
                  strokeWidth={1}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="performance"
                  name="Performance"
                  stroke="hsl(var(--warning))"
                  strokeWidth={1}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="quality"
                  name="Quality"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={1}
                  dot={false}
                />
                {showTarget && (
                  <ReferenceLine
                    y={85}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="5 5"
                    label={{ value: 'Target', position: 'right' }}
                  />
                )}
              </LineChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis domain={[0, 100]} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="availability" name="Availability" fill="hsl(var(--success))" />
                <Bar dataKey="performance" name="Performance" fill="hsl(var(--warning))" />
                <Bar dataKey="quality" name="Quality" fill="hsl(var(--secondary))" />
                {showTarget && (
                  <ReferenceLine
                    y={85}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="5 5"
                  />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{(data.reduce((s, d) => s + d.oee, 0) / data.length).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Avg OEE</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-success">{(data.reduce((s, d) => s + d.availability, 0) / data.length).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Availability</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-warning">{(data.reduce((s, d) => s + d.performance, 0) / data.length).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Performance</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-secondary">{(data.reduce((s, d) => s + d.quality, 0) / data.length).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Quality</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
