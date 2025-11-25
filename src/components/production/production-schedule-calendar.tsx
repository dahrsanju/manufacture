'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';

interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  type: 'work-order' | 'maintenance' | 'inspection' | 'delivery';
  status: 'scheduled' | 'in-progress' | 'completed';
}

interface ProductionScheduleCalendarProps {
  events: ScheduleEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: ScheduleEvent) => void;
  onAddEvent?: (date: Date) => void;
}

const mockEvents: ScheduleEvent[] = [
  { id: 'e-1', title: 'WO-2024-0891', date: '2024-11-25', type: 'work-order', status: 'scheduled' },
  { id: 'e-2', title: 'WO-2024-0892', date: '2024-11-25', type: 'work-order', status: 'scheduled' },
  { id: 'e-3', title: 'CNC Maintenance', date: '2024-11-26', type: 'maintenance', status: 'scheduled' },
  { id: 'e-4', title: 'Quality Inspection', date: '2024-11-27', type: 'inspection', status: 'scheduled' },
  { id: 'e-5', title: 'WO-2024-0893', date: '2024-11-28', type: 'work-order', status: 'scheduled' },
  { id: 'e-6', title: 'Material Delivery', date: '2024-11-29', type: 'delivery', status: 'scheduled' },
  { id: 'e-7', title: 'WO-2024-0890', date: '2024-11-24', type: 'work-order', status: 'in-progress' },
];

const typeColors = {
  'work-order': 'bg-primary',
  maintenance: 'bg-warning',
  inspection: 'bg-success',
  delivery: 'bg-secondary',
};

export function ProductionScheduleCalendar({
  events = mockEvents,
  onDateClick,
  onEventClick,
  onAddEvent,
}: ProductionScheduleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter((event) => event.date === dateStr);
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Get day of week for first day (0 = Sunday)
  const startDay = monthStart.getDay();

  return (
    <div className="bg-background rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {/* Empty cells for days before month start */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="h-24 p-1 border-b border-r bg-muted/30" />
        ))}

        {/* Days of month */}
        {days.map((day) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`h-24 p-1 border-b border-r cursor-pointer hover:bg-muted/50 ${
                !isCurrentMonth ? 'bg-muted/30' : ''
              }`}
              onClick={() => onDateClick?.(day)}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-sm w-6 h-6 flex items-center justify-center rounded-full ${
                    isTodayDate ? 'bg-primary text-primary-foreground' : ''
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {onAddEvent && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddEvent(day);
                    }}
                    className="opacity-0 hover:opacity-100 p-0.5 hover:bg-muted rounded"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="space-y-0.5 overflow-hidden">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    className={`text-[10px] px-1 py-0.5 rounded truncate text-white ${typeColors[event.type]}`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[10px] text-muted-foreground">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-3 border-t flex flex-wrap gap-4 text-xs">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded ${color}`} />
            <span className="capitalize">{type.replace('-', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
