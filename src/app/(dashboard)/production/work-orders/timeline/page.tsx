'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Input,
  Breadcrumb,
} from '@/components/ui';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  ZoomIn,
  ZoomOut,
  Clock,
  User,
  Package,
} from 'lucide-react';

// Mock work orders for timeline
const workOrders = [
  {
    id: 'wo-001',
    number: 'WO-2024-0123',
    product: 'Assembly Unit A',
    quantity: 100,
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignee: 'John Smith',
    startDate: '2024-11-20',
    endDate: '2024-11-25',
    progress: 65,
  },
  {
    id: 'wo-002',
    number: 'WO-2024-0124',
    product: 'Component X',
    quantity: 500,
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    assignee: 'Sarah Johnson',
    startDate: '2024-11-18',
    endDate: '2024-11-28',
    progress: 40,
  },
  {
    id: 'wo-003',
    number: 'WO-2024-0125',
    product: 'Widget Pro',
    quantity: 200,
    status: 'PENDING',
    priority: 'HIGH',
    assignee: 'Mike Wilson',
    startDate: '2024-11-25',
    endDate: '2024-11-30',
    progress: 0,
  },
  {
    id: 'wo-004',
    number: 'WO-2024-0126',
    product: 'Gadget Base',
    quantity: 150,
    status: 'COMPLETED',
    priority: 'LOW',
    assignee: 'Emily Davis',
    startDate: '2024-11-10',
    endDate: '2024-11-18',
    progress: 100,
  },
  {
    id: 'wo-005',
    number: 'WO-2024-0127',
    product: 'Motor Assembly',
    quantity: 75,
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    assignee: 'Robert Brown',
    startDate: '2024-11-22',
    endDate: '2024-11-26',
    progress: 30,
  },
  {
    id: 'wo-006',
    number: 'WO-2024-0128',
    product: 'Control Panel',
    quantity: 50,
    status: 'PENDING',
    priority: 'MEDIUM',
    assignee: 'Lisa Chen',
    startDate: '2024-11-27',
    endDate: '2024-12-05',
    progress: 0,
  },
  {
    id: 'wo-007',
    number: 'WO-2024-0129',
    product: 'Sensor Kit',
    quantity: 300,
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignee: 'Tom Anderson',
    startDate: '2024-11-15',
    endDate: '2024-11-29',
    progress: 55,
  },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-warning',
  IN_PROGRESS: 'bg-primary',
  COMPLETED: 'bg-success',
  CANCELLED: 'bg-destructive',
};

const priorityColors: Record<string, string> = {
  LOW: 'border-muted-foreground',
  MEDIUM: 'border-primary',
  HIGH: 'border-warning',
  URGENT: 'border-destructive',
};

export default function WorkOrderTimelinePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = day view, 0.5 = week view, 2 = hour view
  const [currentDate, setCurrentDate] = useState(new Date('2024-11-20'));

  // Calculate date range for timeline
  const daysToShow = Math.round(14 / zoomLevel);
  const startDate = new Date(currentDate);
  startDate.setDate(startDate.getDate() - Math.floor(daysToShow / 2));

  const dates: Date[] = [];
  for (let i = 0; i < daysToShow; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  const filteredWorkOrders = workOrders.filter(
    (wo) =>
      wo.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBarPosition = (woStart: string, woEnd: string) => {
    const start = new Date(woStart);
    const end = new Date(woEnd);
    const timelineStart = dates[0];
    const timelineEnd = dates[dates.length - 1];

    const totalDays = (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);

    const startOffset = Math.max(
      0,
      (start.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const duration = Math.min(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1,
      totalDays - startOffset
    );

    const leftPercent = (startOffset / totalDays) * 100;
    const widthPercent = (duration / totalDays) * 100;

    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 2)}%`,
    };
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date('2024-11-24'); // Mock today
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date: Date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Work Order Timeline</h1>
            <p className="text-muted-foreground">
              Gantt chart view of all work orders
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/production/work-orders')}>
            List View
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search work orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.5))}
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.5))}
                disabled={zoomLevel >= 2}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <div className="h-6 w-px bg-border mx-2" />
              <Button variant="outline" size="icon" onClick={() => navigateDate(-7)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date('2024-11-24'))}
              >
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateDate(7)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline
          </CardTitle>
          <CardDescription>
            Showing {dates[0]?.toLocaleDateString()} -{' '}
            {dates[dates.length - 1]?.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {/* Date Headers */}
            <div className="flex border-b mb-2">
              <div className="w-64 flex-shrink-0 px-4 py-2 font-medium">
                Work Order
              </div>
              <div className="flex-1 flex">
                {dates.map((date, index) => (
                  <div
                    key={index}
                    className={`flex-1 text-center py-2 text-xs border-l ${
                      isToday(date)
                        ? 'bg-primary/10 font-bold'
                        : isWeekend(date)
                        ? 'bg-muted/50'
                        : ''
                    }`}
                  >
                    <div className="font-medium">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-muted-foreground">
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Order Rows */}
            <div className="space-y-2">
              {filteredWorkOrders.map((wo) => {
                const barPosition = getBarPosition(wo.startDate, wo.endDate);
                return (
                  <div key={wo.id} className="flex group">
                    {/* Work Order Info */}
                    <div
                      className="w-64 flex-shrink-0 px-4 py-3 border-r cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/production/work-orders/${wo.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{wo.number}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {wo.product}
                          </p>
                        </div>
                        <Badge
                          variant={
                            wo.status === 'COMPLETED'
                              ? 'success'
                              : wo.status === 'IN_PROGRESS'
                              ? 'default'
                              : 'warning'
                          }
                          className="text-xs"
                        >
                          {wo.progress}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="truncate">{wo.assignee}</span>
                      </div>
                    </div>

                    {/* Timeline Bar */}
                    <div className="flex-1 relative py-3">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex">
                        {dates.map((date, index) => (
                          <div
                            key={index}
                            className={`flex-1 border-l ${
                              isToday(date)
                                ? 'bg-primary/5'
                                : isWeekend(date)
                                ? 'bg-muted/30'
                                : ''
                            }`}
                          />
                        ))}
                      </div>

                      {/* Progress Bar */}
                      <div
                        className={`absolute top-3 h-8 rounded ${
                          statusColors[wo.status]
                        } border-l-4 ${priorityColors[wo.priority]} cursor-pointer transition-transform hover:scale-y-110`}
                        style={barPosition}
                        onClick={() => router.push(`/production/work-orders/${wo.id}`)}
                      >
                        {/* Progress fill */}
                        <div
                          className="h-full bg-black/20 rounded-r"
                          style={{ width: `${wo.progress}%` }}
                        />
                        {/* Label */}
                        <div className="absolute inset-0 flex items-center px-2">
                          <span className="text-xs text-white font-medium truncate">
                            {wo.quantity} units
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredWorkOrders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No work orders found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <span className="font-medium">Status:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success" />
              <span>Completed</span>
            </div>
            <div className="h-4 w-px bg-border mx-2" />
            <span className="font-medium">Priority:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-l-4 border-destructive bg-muted" />
              <span>Urgent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-l-4 border-warning bg-muted" />
              <span>High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-l-4 border-primary bg-muted" />
              <span>Medium</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
