'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { CalendarCog, ChevronLeft, ChevronRight, Plus, Loader2, RefreshCw, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ProductionScheduleItem {
  id: string;
  workOrderId: string;
  workOrderNumber: string;
  productName: string;
  workCenterId: string;
  workCenterName: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  quantity?: number;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  scheduled: { label: 'Scheduled', variant: 'secondary' },
  in_progress: { label: 'In Progress', variant: 'default' },
  completed: { label: 'Completed', variant: 'success' },
  delayed: { label: 'Delayed', variant: 'destructive' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-muted-foreground' },
  medium: { label: 'Medium', color: 'text-primary' },
  high: { label: 'High', color: 'text-warning' },
  urgent: { label: 'Urgent', color: 'text-destructive' },
};

export default function ProductionSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['production-schedule'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/production/schedule');
      return response.data.data as ProductionScheduleItem[];
    },
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === 'day') {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
      } else if (viewMode === 'week') {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      } else {
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      }
      return newDate;
    });
  };

  // Group schedule items by date
  const groupedSchedule = data?.reduce((acc, item) => {
    const date = new Date(item.startTime).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ProductionScheduleItem[]>) || {};

  // Sort dates
  const sortedDates = Object.keys(groupedSchedule).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Calculate stats
  const stats = {
    total: data?.length || 0,
    scheduled: data?.filter(item => item.status === 'scheduled').length || 0,
    inProgress: data?.filter(item => item.status === 'in_progress').length || 0,
    delayed: data?.filter(item => item.status === 'delayed').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Production Schedule</h1>
          <p className="text-muted-foreground mt-1">
            Plan and manage production scheduling
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Job
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Scheduled</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <CalendarCog className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <CalendarCog className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delayed</p>
                <p className="text-2xl font-bold">{stats.delayed}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="font-medium ml-2">{formatDate(currentDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'day' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('day')}
          >
            Day
          </Button>
          <Button
            variant={viewMode === 'week' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
          <Button
            variant={viewMode === 'month' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
        </div>
      </div>

      {/* Schedule Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCog className="h-5 w-5" />
            Schedule Calendar
            {data && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({data.length} items)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-destructive">Failed to load production schedule</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : data && data.length > 0 ? (
            <div className="space-y-6">
              {sortedDates.map((dateString) => (
                <div key={dateString}>
                  <h3 className="font-medium text-sm text-muted-foreground mb-3">
                    {new Date(dateString).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h3>
                  <div className="space-y-3">
                    {groupedSchedule[dateString].map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            'w-1 h-12 rounded-full',
                            item.status === 'completed' ? 'bg-green-500' :
                            item.status === 'in_progress' ? 'bg-blue-500' :
                            item.status === 'delayed' ? 'bg-red-500' :
                            'bg-gray-300'
                          )} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{item.workOrderNumber}</span>
                              <Badge variant={statusConfig[item.status]?.variant || 'secondary'}>
                                {statusConfig[item.status]?.label || item.status}
                              </Badge>
                            </div>
                            <p className="font-medium mt-1">{item.productName}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>{item.workCenterName}</span>
                              <span>
                                {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={cn('text-sm font-medium', priorityConfig[item.priority]?.color)}>
                            {priorityConfig[item.priority]?.label || item.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CalendarCog className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">No Scheduled Items</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                There are no production items scheduled. Click "Schedule Job" to create a new schedule entry.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
