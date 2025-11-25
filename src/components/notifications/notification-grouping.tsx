'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { Bell, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: string;
  read: boolean;
  createdAt: string;
}

interface NotificationGroup {
  label: string;
  notifications: Notification[];
}

interface NotificationGroupingProps {
  notifications?: Notification[];
  groupBy?: 'time' | 'category' | 'type';
  onNotificationClick?: (notification: Notification) => void;
}

const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Low Stock Alert', message: 'Widget A-100 below minimum', type: 'warning', category: 'Inventory', read: false, createdAt: '2024-11-24T10:30:00' },
  { id: 'n2', title: 'Task Assigned', message: 'Quality Inspection assigned', type: 'info', category: 'Tasks', read: false, createdAt: '2024-11-24T09:15:00' },
  { id: 'n3', title: 'Work Order Completed', message: 'WO-2024-156 completed', type: 'success', category: 'Production', read: true, createdAt: '2024-11-24T08:00:00' },
  { id: 'n4', title: 'Approval Required', message: 'PO-2024-089 needs approval', type: 'info', category: 'Workflow', read: false, createdAt: '2024-11-23T16:45:00' },
  { id: 'n5', title: 'Quality Issue', message: 'Defect rate exceeded', type: 'error', category: 'Quality', read: true, createdAt: '2024-11-23T14:20:00' },
  { id: 'n6', title: 'Stock Replenished', message: 'Part B-200 restocked', type: 'success', category: 'Inventory', read: true, createdAt: '2024-11-22T10:00:00' },
];

const typeColors = {
  info: 'default',
  success: 'success',
  warning: 'warning',
  error: 'destructive',
};

export function NotificationGrouping({
  notifications = mockNotifications,
  groupBy = 'time',
  onNotificationClick,
}: NotificationGroupingProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Today', 'Inventory', 'info']));
  const [currentGroupBy, setCurrentGroupBy] = useState(groupBy);

  const getTimeGroup = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date)) return 'This Week';
    return format(date, 'MMMM yyyy');
  };

  const groupNotifications = (): NotificationGroup[] => {
    const groups: Record<string, Notification[]> = {};

    notifications.forEach((notification) => {
      let groupKey: string;
      switch (currentGroupBy) {
        case 'time':
          groupKey = getTimeGroup(notification.createdAt);
          break;
        case 'category':
          groupKey = notification.category;
          break;
        case 'type':
          groupKey = notification.type;
          break;
        default:
          groupKey = 'All';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });

    return Object.entries(groups).map(([label, items]) => ({
      label,
      notifications: items.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    }));
  };

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const groups = groupNotifications();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <div className="flex gap-1">
            {(['time', 'category', 'type'] as const).map((option) => (
              <Button
                key={option}
                variant={currentGroupBy === option ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setCurrentGroupBy(option)}
                className="capitalize"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groups.map((group) => {
            const isExpanded = expandedGroups.has(group.label);
            const unreadCount = group.notifications.filter((n) => !n.read).length;

            return (
              <div key={group.label} className="border rounded-lg">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-medium capitalize">{group.label}</span>
                    <Badge variant="outline">{group.notifications.length}</Badge>
                    {unreadCount > 0 && (
                      <Badge variant="default">{unreadCount} new</Badge>
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t">
                    {group.notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => onNotificationClick?.(notification)}
                        className={`p-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{notification.title}</span>
                          <Badge variant={typeColors[notification.type] as any} className="text-xs">
                            {notification.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
