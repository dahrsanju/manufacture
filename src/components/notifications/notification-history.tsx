'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Input } from '@/components/ui';
import { Bell, Search, Filter, Check, Trash2, Archive, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationHistoryProps {
  notifications?: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
}

const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Low Stock Alert', message: 'Widget A-100 has fallen below minimum stock level (50 units remaining)', type: 'warning', category: 'Inventory', read: false, createdAt: '2024-11-24T10:30:00' },
  { id: 'n2', title: 'Task Assigned', message: 'You have been assigned to "Quality Inspection - Batch #1234"', type: 'info', category: 'Tasks', read: false, createdAt: '2024-11-24T09:15:00' },
  { id: 'n3', title: 'Work Order Completed', message: 'Work Order WO-2024-156 has been completed successfully', type: 'success', category: 'Production', read: true, createdAt: '2024-11-24T08:00:00' },
  { id: 'n4', title: 'Approval Required', message: 'Purchase Order PO-2024-089 requires your approval', type: 'info', category: 'Workflow', read: false, createdAt: '2024-11-23T16:45:00' },
  { id: 'n5', title: 'Quality Issue Detected', message: 'Defect rate exceeded threshold for Product SKU-789', type: 'error', category: 'Quality', read: true, createdAt: '2024-11-23T14:20:00' },
  { id: 'n6', title: 'System Maintenance', message: 'Scheduled maintenance on November 25, 2024 from 2:00 AM to 4:00 AM', type: 'info', category: 'System', read: true, createdAt: '2024-11-22T10:00:00' },
];

const typeColors = {
  info: 'default',
  success: 'success',
  warning: 'warning',
  error: 'destructive',
};

export function NotificationHistory({
  notifications = mockNotifications,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onArchive,
}: NotificationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterRead, setFilterRead] = useState<boolean | null>(null);

  const categories = [...new Set(notifications.map((n) => n.category))];

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || notification.category === filterCategory;
    const matchesRead = filterRead === null || notification.read === filterRead;
    return matchesSearch && matchesCategory && matchesRead;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification History
            {unreadCount > 0 && (
              <Badge variant="default">{unreadCount} unread</Badge>
            )}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onMarkAllRead}>
            <Check className="h-4 w-4 mr-1" />
            Mark All Read
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterRead === null ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterRead(null)}
            >
              All
            </Button>
            <Button
              variant={filterRead === false ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterRead(false)}
            >
              Unread
            </Button>
            <Button
              variant={filterRead === true ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterRead(true)}
            >
              Read
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Button
            variant={filterCategory === null ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory(null)}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={filterCategory === category ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setFilterCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                !notification.read ? 'bg-primary/5 border-primary/20' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{notification.title}</span>
                    <Badge variant={typeColors[notification.type] as any}>
                      {notification.type}
                    </Badge>
                    <Badge variant="outline">{notification.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkRead?.(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onArchive?.(notification.id)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(notification.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No notifications found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
