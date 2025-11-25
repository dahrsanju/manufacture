import { faker } from '@faker-js/faker';
import type { Notification } from '@/types';

export const generateMockNotifications = (): Notification[] => {
  return [
    {
      id: 'notif-001',
      type: 'alert',
      priority: 'high',
      title: 'Low Stock Alert',
      message: 'Widget A is below reorder point (15 remaining)',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      read: false,
      actionUrl: '/inventory/products/prod-001',
    },
    {
      id: 'notif-002',
      type: 'task',
      priority: 'medium',
      title: 'Task Assigned',
      message: 'Quality inspection required for WO-2024-0891',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      read: false,
      actionUrl: '/workflows/tasks/task-123',
    },
    {
      id: 'notif-003',
      type: 'info',
      priority: 'low',
      title: 'Report Ready',
      message: 'Monthly inventory report has been generated',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      read: true,
      actionUrl: '/reports/inventory/monthly',
    },
    {
      id: 'notif-004',
      type: 'success',
      priority: 'medium',
      title: 'Work Order Completed',
      message: 'Work order WO-2024-0890 has been completed successfully',
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      read: true,
      actionUrl: '/production/work-orders/wo-0890',
    },
    {
      id: 'notif-005',
      type: 'warning',
      priority: 'high',
      title: 'Quality Issue Detected',
      message: 'Batch B-2024-456 failed quality inspection',
      timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
      read: false,
      actionUrl: '/quality/inspections/insp-456',
    },
  ];
};

export const generateRandomNotification = (): Notification => {
  const types = ['alert', 'task', 'info', 'success', 'warning', 'error'] as const;
  const priorities = ['high', 'medium', 'low'] as const;

  return {
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(types),
    priority: faker.helpers.arrayElement(priorities),
    title: faker.helpers.arrayElement([
      'Stock Level Alert',
      'Task Assigned',
      'Report Generated',
      'Order Completed',
      'Quality Alert',
      'System Update',
    ]),
    message: faker.lorem.sentence(),
    timestamp: faker.date.recent().toISOString(),
    read: faker.datatype.boolean({ probability: 0.3 }),
    actionUrl: faker.helpers.arrayElement([
      '/inventory/products',
      '/tasks',
      '/reports',
      '/production/work-orders',
      '/quality/inspections',
    ]),
  };
};
