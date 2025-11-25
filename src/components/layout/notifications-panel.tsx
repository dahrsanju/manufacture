'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge, Modal } from '@/components/ui';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Package,
  AlertTriangle,
  FileText,
  ShoppingCart,
  Factory,
  X,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: 'inventory' | 'production' | 'procurement' | 'quality' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'warning',
    category: 'inventory',
    title: 'Low Stock Alert',
    message: 'Widget Pro (SKU-001) is below minimum stock level. Current: 15, Minimum: 50',
    timestamp: '2024-11-24T10:30:00',
    read: false,
    actionUrl: '/inventory/products/prod-001',
  },
  {
    id: 'notif-002',
    type: 'info',
    category: 'procurement',
    title: 'Purchase Order Approved',
    message: 'PO-2024-0567 has been approved by John Smith',
    timestamp: '2024-11-24T09:15:00',
    read: false,
    actionUrl: '/procurement/purchase-orders/po-567',
  },
  {
    id: 'notif-003',
    type: 'success',
    category: 'production',
    title: 'Work Order Completed',
    message: 'WO-2024-0120 has been completed successfully. 100 units produced.',
    timestamp: '2024-11-23T16:45:00',
    read: false,
    actionUrl: '/production/work-orders/wo-120',
  },
  {
    id: 'notif-004',
    type: 'error',
    category: 'quality',
    title: 'Quality Inspection Failed',
    message: 'Batch B-2024-089 failed visual inspection. 12 defects found.',
    timestamp: '2024-11-23T14:20:00',
    read: true,
    actionUrl: '/quality/inspections/insp-089',
  },
  {
    id: 'notif-005',
    type: 'info',
    category: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Nov 25, 2024 from 2:00 AM to 4:00 AM EST',
    timestamp: '2024-11-22T08:00:00',
    read: true,
  },
  {
    id: 'notif-006',
    type: 'warning',
    category: 'procurement',
    title: 'Supplier Delivery Delayed',
    message: 'Steel Corp International shipment delayed by 2 days. New ETA: Nov 28',
    timestamp: '2024-11-21T11:30:00',
    read: true,
  },
];

const categoryIcons = {
  inventory: Package,
  production: Factory,
  procurement: ShoppingCart,
  quality: FileText,
  system: Bell,
};

const typeColors = {
  info: 'bg-primary',
  warning: 'bg-warning',
  success: 'bg-success',
  error: 'bg-destructive',
};

export function NotificationsPanel() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Notifications"
        size="md"
      >
        <div className="space-y-4">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'unread' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </Button>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearAll}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {filter === 'unread'
                    ? 'No unread notifications'
                    : 'No notifications'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const CategoryIcon = categoryIcons[notification.category];
                return (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      notification.read
                        ? 'bg-background hover:bg-muted/50'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`p-2 rounded-lg ${typeColors[notification.type]} flex-shrink-0`}
                      >
                        <CategoryIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(notification.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="p-1 hover:bg-muted rounded"
                            title="Mark as read"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="p-1 hover:bg-destructive/10 hover:text-destructive rounded"
                          title="Delete"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* View All Link */}
          {notifications.length > 0 && (
            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  router.push('/notifications');
                  setIsOpen(false);
                }}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

export default NotificationsPanel;
