'use client';

import { Card, CardContent, Badge } from '@/components/ui';
import { Cpu, Thermometer, Gauge, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Machine {
  id: string;
  name: string;
  type: string;
  status: 'operational' | 'warning' | 'critical' | 'offline';
  temperature: number;
  pressure: number;
  rpm: number;
  uptime: number;
  nextMaintenance: string;
  alerts: string[];
}

interface MachineStatusCardsProps {
  machines: Machine[];
  onMachineClick?: (machine: Machine) => void;
}

const mockMachines: Machine[] = [
  { id: 'm-1', name: 'CNC Mill #1', type: 'CNC Machine', status: 'operational', temperature: 45, pressure: 85, rpm: 3500, uptime: 99.2, nextMaintenance: '15 days', alerts: [] },
  { id: 'm-2', name: 'CNC Mill #2', type: 'CNC Machine', status: 'warning', temperature: 68, pressure: 92, rpm: 3200, uptime: 95.8, nextMaintenance: '3 days', alerts: ['High temperature warning'] },
  { id: 'm-3', name: 'Lathe #1', type: 'Lathe', status: 'operational', temperature: 42, pressure: 78, rpm: 2800, uptime: 98.5, nextMaintenance: '22 days', alerts: [] },
  { id: 'm-4', name: 'Press #1', type: 'Hydraulic Press', status: 'critical', temperature: 82, pressure: 105, rpm: 0, uptime: 87.3, nextMaintenance: 'Overdue', alerts: ['Critical temperature', 'Pressure exceeds limit'] },
  { id: 'm-5', name: 'Welder #1', type: 'Welding Robot', status: 'operational', temperature: 55, pressure: 0, rpm: 0, uptime: 97.1, nextMaintenance: '8 days', alerts: [] },
  { id: 'm-6', name: 'Conveyor A', type: 'Conveyor', status: 'offline', temperature: 25, pressure: 0, rpm: 0, uptime: 0, nextMaintenance: 'In maintenance', alerts: ['Scheduled maintenance'] },
];

const statusConfig = {
  operational: { color: 'bg-success', text: 'text-success', label: 'Operational' },
  warning: { color: 'bg-warning', text: 'text-warning', label: 'Warning' },
  critical: { color: 'bg-destructive', text: 'text-destructive', label: 'Critical' },
  offline: { color: 'bg-muted', text: 'text-muted-foreground', label: 'Offline' },
};

export function MachineStatusCards({
  machines = mockMachines,
  onMachineClick,
}: MachineStatusCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {machines.map((machine) => {
        const config = statusConfig[machine.status];

        return (
          <Card
            key={machine.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              machine.status === 'critical' ? 'border-destructive' : ''
            }`}
            onClick={() => onMachineClick?.(machine)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium">{machine.name}</h3>
                  <p className="text-sm text-muted-foreground">{machine.type}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${config.color}`} />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <Thermometer className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className={`text-sm font-medium ${machine.temperature > 70 ? 'text-destructive' : machine.temperature > 60 ? 'text-warning' : ''}`}>
                    {machine.temperature}°C
                  </p>
                </div>
                <div className="text-center">
                  <Gauge className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className={`text-sm font-medium ${machine.pressure > 100 ? 'text-destructive' : ''}`}>
                    {machine.pressure} PSI
                  </p>
                </div>
                <div className="text-center">
                  <Cpu className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{machine.rpm}</p>
                </div>
              </div>

              {/* Uptime & Maintenance */}
              <div className="flex justify-between text-sm mb-3">
                <span className="text-muted-foreground">Uptime</span>
                <span className={machine.uptime >= 95 ? 'text-success' : machine.uptime >= 85 ? 'text-warning' : 'text-destructive'}>
                  {machine.uptime}%
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next Maintenance</span>
                <span className={machine.nextMaintenance === 'Overdue' ? 'text-destructive' : ''}>
                  {machine.nextMaintenance}
                </span>
              </div>

              {/* Alerts */}
              {machine.alerts.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  {machine.alerts.map((alert, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-destructive">
                      <AlertTriangle className="h-3 w-3" />
                      {alert}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
