'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface QualityMetricsChartsProps {
  period?: 'week' | 'month' | 'quarter';
}

const defectTrendData = [
  { date: 'Mon', defects: 12, target: 10 },
  { date: 'Tue', defects: 8, target: 10 },
  { date: 'Wed', defects: 15, target: 10 },
  { date: 'Thu', defects: 9, target: 10 },
  { date: 'Fri', defects: 11, target: 10 },
  { date: 'Sat', defects: 6, target: 10 },
  { date: 'Sun', defects: 4, target: 10 },
];

const defectByTypeData = [
  { name: 'Dimensional', value: 35, color: '#3b82f6' },
  { name: 'Surface', value: 25, color: '#10b981' },
  { name: 'Material', value: 20, color: '#f59e0b' },
  { name: 'Assembly', value: 12, color: '#8b5cf6' },
  { name: 'Other', value: 8, color: '#6b7280' },
];

const firstPassYieldData = [
  { month: 'Jan', yield: 94.5 },
  { month: 'Feb', yield: 95.2 },
  { month: 'Mar', yield: 93.8 },
  { month: 'Apr', yield: 96.1 },
  { month: 'May', yield: 95.8 },
  { month: 'Jun', yield: 97.2 },
];

const defectBySeverityData = [
  { name: 'Critical', count: 5, color: '#ef4444' },
  { name: 'Major', count: 18, color: '#f59e0b' },
  { name: 'Minor', count: 42, color: '#6b7280' },
];

export function QualityMetricsCharts({ period = 'week' }: QualityMetricsChartsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Defect Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Defect Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={defectTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
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
                  dataKey="defects"
                  name="Defects"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--destructive))' }}
                />
                <ReferenceLine
                  y={10}
                  stroke="hsl(var(--warning))"
                  strokeDasharray="5 5"
                  label={{ value: 'Target', position: 'right' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Defects by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Defects by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defectByTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {defectByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* First Pass Yield */}
      <Card>
        <CardHeader>
          <CardTitle>First Pass Yield (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={firstPassYieldData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis domain={[90, 100]} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="yield" name="FPY" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                <ReferenceLine
                  y={95}
                  stroke="hsl(var(--primary))"
                  strokeDasharray="5 5"
                  label={{ value: 'Target 95%', position: 'right' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Defects by Severity */}
      <Card>
        <CardHeader>
          <CardTitle>Defects by Severity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defectBySeverityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" className="text-xs" width={60} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
                  {defectBySeverityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
