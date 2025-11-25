'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { format, addDays, startOfWeek, eachDayOfInterval } from 'date-fns';

interface WorkOrderSchedule {
  id: string;
  number: string;
  product: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed';
  assignee: string;
}

interface WorkOrderGanttProps {
  workOrders: WorkOrderSchedule[];
  onWorkOrderClick?: (workOrder: WorkOrderSchedule) => void;
}

const mockWorkOrders: WorkOrderSchedule[] = [
  { id: 'wo-1', number: 'WO-2024-0891', product: 'Widget Pro X100', startDate: '2024-11-24', endDate: '2024-11-26', progress: 65, status: 'in-progress', assignee: 'John Smith' },
  { id: 'wo-2', number: 'WO-2024-0892', product: 'Component B-200', startDate: '2024-11-25', endDate: '2024-11-28', progress: 0, status: 'scheduled', assignee: 'Sarah Johnson' },
  { id: 'wo-3', number: 'WO-2024-0893', product: 'Assembly Unit A', startDate: '2024-11-26', endDate: '2024-11-29', progress: 0, status: 'scheduled', assignee: 'Mike Wilson' },
  { id: 'wo-4', number: 'WO-2024-0890', product: 'Part C-300', startDate: '2024-11-22', endDate: '2024-11-24', progress: 100, status: 'completed', assignee: 'Emily Davis' },
  { id: 'wo-5', number: 'WO-2024-0889', product: 'Widget Standard', startDate: '2024-11-23', endDate: '2024-11-27', progress: 40, status: 'delayed', assignee: 'Robert Brown' },
];

const statusColors = {
  scheduled: 'bg-secondary',
  'in-progress': 'bg-primary',
  completed: 'bg-success',
  delayed: 'bg-destructive',
};

export function WorkOrderGantt({
  workOrders = mockWorkOrders,
  onWorkOrderClick,
}: WorkOrderGanttProps) {
  const [startDate, setStartDate] = useState(startOfWeek(new Date()));
  const [daysToShow, setDaysToShow] = useState(14);

  const days = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, daysToShow - 1),
  });

  const handlePrev = () => setStartDate(addDays(startDate, -7));
  const handleNext = () => setStartDate(addDays(startDate, 7));
  const handleZoomIn = () => setDaysToShow(Math.max(7, daysToShow - 7));
  const handleZoomOut = () => setDaysToShow(Math.min(28, daysToShow + 7));

  const getBarPosition = (wo: WorkOrderSchedule) => {
    const start = new Date(wo.startDate);
    const end = new Date(wo.endDate);
    const startDiff = Math.floor((start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return {
      left: Math.max(0, startDiff) * (100 / daysToShow),
      width: Math.min(duration, daysToShow - startDiff) * (100 / daysToShow),
      visible: startDiff < daysToShow && startDiff + duration > 0,
    };
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Controls */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(startDate, 'MMM d')} - {format(addDays(startDate, daysToShow - 1), 'MMM d, yyyy')}
          </span>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="flex border-b">
        <div className="w-64 flex-shrink-0 p-2 border-r bg-muted/30 font-medium text-sm">
          Work Order
        </div>
        <div className="flex-1 flex">
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className="flex-1 p-1 text-center text-xs border-r last:border-r-0"
            >
              <div className="font-medium">{format(day, 'EEE')}</div>
              <div className="text-muted-foreground">{format(day, 'd')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rows */}
      {workOrders.map((wo) => {
        const pos = getBarPosition(wo);

        return (
          <div key={wo.id} className="flex border-b last:border-b-0 hover:bg-muted/30">
            <div
              className="w-64 flex-shrink-0 p-2 border-r cursor-pointer"
              onClick={() => onWorkOrderClick?.(wo)}
            >
              <div className="font-medium text-sm">{wo.number}</div>
              <div className="text-xs text-muted-foreground truncate">{wo.product}</div>
            </div>
            <div className="flex-1 relative h-14">
              {pos.visible && (
                <div
                  className={`absolute top-2 h-10 rounded ${statusColors[wo.status]} cursor-pointer hover:opacity-80 transition-opacity`}
                  style={{
                    left: `${pos.left}%`,
                    width: `${pos.width}%`,
                  }}
                  onClick={() => onWorkOrderClick?.(wo)}
                >
                  <div className="h-full px-2 flex items-center justify-between text-xs text-white">
                    <span className="truncate">{wo.assignee}</span>
                    {wo.progress > 0 && (
                      <span className="font-medium">{wo.progress}%</span>
                    )}
                  </div>
                  {/* Progress bar inside */}
                  {wo.progress > 0 && wo.progress < 100 && (
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-white/50 rounded-bl"
                      style={{ width: `${wo.progress}%` }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="p-3 border-t bg-muted/30 flex gap-4 text-xs">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded ${color}`} />
            <span className="capitalize">{status.replace('-', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
