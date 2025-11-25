'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Legend,
} from 'recharts';
import { TrendingUp, Calendar, Target } from 'lucide-react';

interface ForecastDataPoint {
  date: string;
  actual?: number;
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

interface ForecastingChartProps {
  data: ForecastDataPoint[];
  title?: string;
  metric?: string;
  confidence?: number;
  modelVersion?: string;
}

export function ForecastingChart({
  data,
  title = 'Demand Forecast',
  metric = 'Units',
  confidence = 85,
  modelVersion = 'v2.1',
}: ForecastingChartProps) {
  // Find where prediction starts (first point without actual)
  const predictionStartIndex = data.findIndex((d) => d.actual === undefined);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <Target className="h-3 w-3 mr-1" />
              {confidence}% confidence
            </Badge>
            <Badge variant="outline">Model {modelVersion}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ fontWeight: 'bold' }}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    actual: 'Actual',
                    predicted: 'Predicted',
                    upperBound: 'Upper Bound',
                    lowerBound: 'Lower Bound',
                  };
                  return [value.toFixed(0), labels[name] || name];
                }}
              />
              <Legend />

              {/* Confidence interval area */}
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="none"
                fill="url(#confidenceGradient)"
                fillOpacity={1}
                name="Upper Bound"
              />
              <Area
                type="monotone"
                dataKey="lowerBound"
                stroke="none"
                fill="hsl(var(--background))"
                fillOpacity={1}
                name="Lower Bound"
              />

              {/* Actual values line */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--foreground))', r: 4 }}
                activeDot={{ r: 6 }}
                name="Actual"
                connectNulls={false}
              />

              {/* Predicted values line */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                strokeDasharray={predictionStartIndex > 0 ? '5 5' : '0'}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                activeDot={{ r: 6 }}
                name="Predicted"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Avg Forecast</p>
            <p className="text-lg font-bold">
              {Math.round(
                data
                  .filter((d) => d.actual === undefined)
                  .reduce((sum, d) => sum + d.predicted, 0) /
                  data.filter((d) => d.actual === undefined).length || 0
              )}{' '}
              {metric}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Peak Demand</p>
            <p className="text-lg font-bold">
              {Math.max(...data.map((d) => d.predicted))} {metric}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Forecast Period</p>
            <p className="text-lg font-bold">
              {data.filter((d) => d.actual === undefined).length} days
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Sample data generator for demo
export function generateForecastData(days: number = 30): ForecastDataPoint[] {
  const data: ForecastDataPoint[] = [];
  const today = new Date();
  const historicalDays = Math.floor(days / 2);

  for (let i = -historicalDays; i < days - historicalDays; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const baseValue = 100 + Math.sin(i / 7) * 20;
    const noise = Math.random() * 10 - 5;
    const trend = i * 0.5;

    const predicted = baseValue + trend + noise;
    const variance = 15 + Math.abs(i) * 0.5;

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      actual: i < 0 ? predicted + (Math.random() * 10 - 5) : undefined,
      predicted: Math.round(predicted),
      lowerBound: Math.round(predicted - variance),
      upperBound: Math.round(predicted + variance),
    });
  }

  return data;
}

export default ForecastingChart;
