'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Breadcrumb,
} from '@/components/ui';
import {
  Factory,
  Gauge,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Settings,
  TrendingUp,
  TrendingDown,
  Wrench,
  Zap,
  Timer,
  Package,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

// Mock production data
const productionLines = [
  {
    id: 'line-001',
    name: 'Assembly Line A',
    status: 'RUNNING',
    product: 'Widget Pro X100',
    progress: 78,
    target: 500,
    completed: 390,
    efficiency: 96.5,
    operator: 'John Smith',
    startTime: '06:00',
    estimatedEnd: '14:30',
  },
  {
    id: 'line-002',
    name: 'Assembly Line B',
    status: 'RUNNING',
    product: 'Assembly Kit AK-50',
    progress: 45,
    target: 300,
    completed: 135,
    efficiency: 92.3,
    operator: 'Jane Doe',
    startTime: '07:00',
    estimatedEnd: '15:00',
  },
  {
    id: 'line-003',
    name: 'Packaging Line 1',
    status: 'IDLE',
    product: '-',
    progress: 0,
    target: 0,
    completed: 0,
    efficiency: 0,
    operator: 'Unassigned',
    startTime: '-',
    estimatedEnd: '-',
  },
  {
    id: 'line-004',
    name: 'CNC Machine Center',
    status: 'MAINTENANCE',
    product: 'Component A-123',
    progress: 62,
    target: 200,
    completed: 124,
    efficiency: 88.7,
    operator: 'Bob Wilson',
    startTime: '05:30',
    estimatedEnd: '16:00',
  },
];

const machines = [
  { id: 'm-001', name: 'CNC Mill #1', status: 'RUNNING', utilization: 94, temperature: 45, runtime: '6h 23m' },
  { id: 'm-002', name: 'CNC Mill #2', status: 'RUNNING', utilization: 87, temperature: 48, runtime: '5h 45m' },
  { id: 'm-003', name: 'Lathe #1', status: 'IDLE', utilization: 0, temperature: 22, runtime: '0h 0m' },
  { id: 'm-004', name: 'Press #1', status: 'RUNNING', utilization: 91, temperature: 52, runtime: '7h 12m' },
  { id: 'm-005', name: 'Welder #1', status: 'MAINTENANCE', utilization: 0, temperature: 28, runtime: '0h 0m' },
  { id: 'm-006', name: 'Assembly Robot', status: 'RUNNING', utilization: 98, temperature: 38, runtime: '8h 0m' },
];

const hourlyOutput = [
  { hour: '6AM', actual: 45, target: 50 },
  { hour: '7AM', actual: 52, target: 50 },
  { hour: '8AM', actual: 48, target: 50 },
  { hour: '9AM', actual: 55, target: 50 },
  { hour: '10AM', actual: 51, target: 50 },
  { hour: '11AM', actual: 47, target: 50 },
  { hour: '12PM', actual: 42, target: 50 },
  { hour: '1PM', actual: 53, target: 50 },
];

const efficiencyTrend = [
  { day: 'Mon', oee: 85 },
  { day: 'Tue', oee: 88 },
  { day: 'Wed', oee: 92 },
  { day: 'Thu', oee: 89 },
  { day: 'Fri', oee: 94 },
  { day: 'Sat', oee: 91 },
  { day: 'Sun', oee: 87 },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof Play }> = {
  RUNNING: { label: 'Running', color: 'text-success', icon: Play },
  IDLE: { label: 'Idle', color: 'text-muted-foreground', icon: Pause },
  MAINTENANCE: { label: 'Maintenance', color: 'text-warning', icon: Wrench },
  ERROR: { label: 'Error', color: 'text-destructive', icon: AlertTriangle },
};

export default function ProductionDashboardPage() {
  const kpis = {
    oee: 91.2,
    oeeChange: 3.5,
    unitsProduced: 649,
    unitsTarget: 800,
    activeLines: productionLines.filter(l => l.status === 'RUNNING').length,
    totalLines: productionLines.length,
    machineUtilization: 78,
    avgCycleTime: '4.2 min',
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Production Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time manufacturing overview and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button>
            <Factory className="h-4 w-4 mr-2" />
            New Work Order
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">OEE Score</p>
                <p className="text-2xl font-bold">{kpis.oee}%</p>
              </div>
              <Gauge className="h-8 w-8 text-primary" />
            </div>
            <div className={`flex items-center mt-2 text-sm ${kpis.oeeChange >= 0 ? 'text-success' : 'text-destructive'}`}>
              {kpis.oeeChange >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(kpis.oeeChange)}% vs yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Units Produced</p>
                <p className="text-2xl font-bold">{kpis.unitsProduced}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Target: {kpis.unitsTarget}</span>
                <span>{Math.round((kpis.unitsProduced / kpis.unitsTarget) * 100)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(kpis.unitsProduced / kpis.unitsTarget) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Lines</p>
                <p className="text-2xl font-bold">{kpis.activeLines}/{kpis.totalLines}</p>
              </div>
              <Factory className="h-8 w-8 text-success" />
            </div>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 mr-1" />
              {kpis.machineUtilization}% utilization
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Cycle Time</p>
                <p className="text-2xl font-bold">{kpis.avgCycleTime}</p>
              </div>
              <Timer className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center mt-2 text-sm text-success">
              <TrendingDown className="h-4 w-4 mr-1" />
              8% faster than target
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Lines */}
      <Card>
        <CardHeader>
          <CardTitle>Production Lines</CardTitle>
          <CardDescription>Real-time status of all production lines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productionLines.map((line) => {
              const StatusIcon = statusConfig[line.status]?.icon || Factory;
              return (
                <div key={line.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${line.status === 'RUNNING' ? 'bg-success/10' : line.status === 'MAINTENANCE' ? 'bg-warning/10' : 'bg-muted'}`}>
                        <StatusIcon className={`h-5 w-5 ${statusConfig[line.status]?.color}`} />
                      </div>
                      <div>
                        <h3 className="font-medium">{line.name}</h3>
                        <p className="text-sm text-muted-foreground">{line.product}</p>
                      </div>
                    </div>
                    <Badge variant={line.status === 'RUNNING' ? 'success' : line.status === 'MAINTENANCE' ? 'warning' : 'secondary'}>
                      {statusConfig[line.status]?.label}
                    </Badge>
                  </div>

                  {line.status === 'RUNNING' && (
                    <>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{line.completed} / {line.target} units</span>
                          <span>{line.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${line.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Efficiency: {line.efficiency}%</span>
                        <span>Operator: {line.operator}</span>
                        <span>Est. completion: {line.estimatedEnd}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Hourly Output */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Output</CardTitle>
            <CardDescription>Actual vs target production</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyOutput}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="target" fill="#94a3b8" name="Target" />
                <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* OEE Trend */}
        <Card>
          <CardHeader>
            <CardTitle>OEE Trend</CardTitle>
            <CardDescription>Weekly efficiency performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={efficiencyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[70, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'OEE']} />
                <Area
                  type="monotone"
                  dataKey="oee"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Machine Status */}
      <Card>
        <CardHeader>
          <CardTitle>Machine Status</CardTitle>
          <CardDescription>Real-time machine monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {machines.map((machine) => {
              const StatusIcon = statusConfig[machine.status]?.icon || Factory;
              return (
                <div key={machine.id} className="p-4 border rounded-lg text-center">
                  <div className={`p-3 rounded-full mx-auto w-fit mb-2 ${
                    machine.status === 'RUNNING' ? 'bg-success/10' :
                    machine.status === 'MAINTENANCE' ? 'bg-warning/10' : 'bg-muted'
                  }`}>
                    <StatusIcon className={`h-6 w-6 ${statusConfig[machine.status]?.color}`} />
                  </div>
                  <h4 className="font-medium text-sm">{machine.name}</h4>
                  <p className={`text-xs ${statusConfig[machine.status]?.color}`}>
                    {statusConfig[machine.status]?.label}
                  </p>
                  {machine.status === 'RUNNING' && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Util: {machine.utilization}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {machine.runtime}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Production Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div className="flex-1">
                <p className="font-medium">CNC Machine Center - Scheduled Maintenance</p>
                <p className="text-sm text-muted-foreground">Maintenance window: 2:00 PM - 4:00 PM</p>
              </div>
              <Button variant="ghost" size="sm">
                Details <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div className="flex-1">
                <p className="font-medium">Low Material Stock Alert</p>
                <p className="text-sm text-muted-foreground">Steel Plate 10mm below minimum level for Line A</p>
              </div>
              <Button variant="ghost" size="sm">
                Reorder <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
              <CheckCircle className="h-5 w-5 text-success" />
              <div className="flex-1">
                <p className="font-medium">Assembly Line B - Target Achieved</p>
                <p className="text-sm text-muted-foreground">Daily production target reached ahead of schedule</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
