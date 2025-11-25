'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { CheckCircle, XCircle, Clock, AlertTriangle, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface InspectionEvent {
  id: string;
  type: 'inspection' | 'approval' | 'rejection' | 'comment' | 'retest';
  status: 'passed' | 'failed' | 'pending' | 'warning';
  title: string;
  description: string;
  user: string;
  timestamp: string;
  details?: { key: string; value: string }[];
}

interface InspectionHistoryTimelineProps {
  inspectionId: string;
  events: InspectionEvent[];
}

const mockEvents: InspectionEvent[] = [
  {
    id: 'e1',
    type: 'inspection',
    status: 'passed',
    title: 'Final Inspection Completed',
    description: 'All quality checks passed. Product approved for shipment.',
    user: 'Emily Davis',
    timestamp: '2024-11-24T10:30:00',
    details: [
      { key: 'Defect Rate', value: '0.5%' },
      { key: 'Units Inspected', value: '500' },
    ],
  },
  {
    id: 'e2',
    type: 'retest',
    status: 'passed',
    title: 'Retest Completed',
    description: 'Retest after corrective action. Dimensional issues resolved.',
    user: 'John Smith',
    timestamp: '2024-11-24T09:15:00',
  },
  {
    id: 'e3',
    type: 'comment',
    status: 'warning',
    title: 'Corrective Action Taken',
    description: 'Adjusted CNC machine calibration to fix dimensional variance.',
    user: 'Mike Wilson',
    timestamp: '2024-11-24T08:45:00',
  },
  {
    id: 'e4',
    type: 'rejection',
    status: 'failed',
    title: 'Initial Inspection Failed',
    description: 'Dimensional variance detected. 15 units out of tolerance.',
    user: 'Emily Davis',
    timestamp: '2024-11-23T16:30:00',
    details: [
      { key: 'Defect Rate', value: '3.0%' },
      { key: 'Units Failed', value: '15' },
    ],
  },
  {
    id: 'e5',
    type: 'inspection',
    status: 'pending',
    title: 'Inspection Started',
    description: 'Quality inspection initiated for Batch B-2024-089.',
    user: 'Emily Davis',
    timestamp: '2024-11-23T14:00:00',
  },
];

const statusIcons = {
  passed: CheckCircle,
  failed: XCircle,
  pending: Clock,
  warning: AlertTriangle,
};

const statusColors = {
  passed: 'text-success',
  failed: 'text-destructive',
  pending: 'text-muted-foreground',
  warning: 'text-warning',
};

export function InspectionHistoryTimeline({
  inspectionId,
  events = mockEvents,
}: InspectionHistoryTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inspection History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          {/* Events */}
          <div className="space-y-6">
            {events.map((event, index) => {
              const Icon = statusIcons[event.status];

              return (
                <div key={event.id} className="relative pl-10">
                  {/* Icon */}
                  <div
                    className={`absolute left-0 p-1.5 rounded-full bg-background border-2 ${
                      event.status === 'passed'
                        ? 'border-success'
                        : event.status === 'failed'
                        ? 'border-destructive'
                        : event.status === 'warning'
                        ? 'border-warning'
                        : 'border-muted'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${statusColors[event.status]}`} />
                  </div>

                  {/* Content */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                      <Badge
                        variant={
                          event.status === 'passed'
                            ? 'success'
                            : event.status === 'failed'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>

                    {/* Details */}
                    {event.details && (
                      <div className="flex gap-4 mt-3 pt-3 border-t border-border/50">
                        {event.details.map((detail) => (
                          <div key={detail.key} className="text-sm">
                            <span className="text-muted-foreground">{detail.key}: </span>
                            <span className="font-medium">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {event.user}
                      </div>
                      <span>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
