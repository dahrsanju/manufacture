import { faker } from '@faker-js/faker';

// Task Types
export interface Task {
  id: string;
  taskNumber: string;
  title: string;
  description: string;
  type: 'approval' | 'review' | 'action' | 'notification' | 'assignment';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'delegated' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  module: 'purchasing' | 'quality' | 'manufacturing' | 'inventory' | 'finance' | 'hr';
  workflowId?: string;
  workflowName?: string;
  workflowInstanceId?: string;
  entityType: string;
  entityId: string;
  entityName: string;
  assignedTo: string;
  assignedToId: string;
  assignedBy: string;
  delegatedTo?: string;
  delegatedAt?: string;
  dueDate: string;
  slaDeadline: string;
  slaStatus: 'on_track' | 'at_risk' | 'breached';
  completedAt?: string;
  completedBy?: string;
  outcome?: 'approved' | 'rejected' | 'completed' | 'deferred';
  comments: TaskComment[];
  attachments: TaskAttachment[];
  history: TaskHistoryItem[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  content: string;
  type: 'comment' | 'system' | 'decision';
  createdAt: string;
  editedAt?: string;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface TaskHistoryItem {
  id: string;
  taskId: string;
  action: 'created' | 'assigned' | 'delegated' | 'commented' | 'status_changed' | 'completed' | 'rejected';
  description: string;
  user: string;
  timestamp: string;
  oldValue?: string;
  newValue?: string;
}

// Task Stats Types
export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  dueToday: number;
  dueTomorrow: number;
  avgCompletionTime: number;
  byPriority: { priority: string; count: number }[];
  byModule: { module: string; count: number }[];
  byStatus: { status: string; count: number }[];
}

// Task Filter Types
export interface TaskFilter {
  status?: string[];
  priority?: string[];
  module?: string[];
  assignedTo?: string;
  dueDate?: { from?: string; to?: string };
  search?: string;
}

// Delegation Types
export interface DelegationRequest {
  taskId: string;
  delegateToId: string;
  delegateToName: string;
  reason?: string;
  keepCopy?: boolean;
}

// Bulk Action Types
export interface BulkActionResult {
  success: string[];
  failed: Array<{ id: string; error: string }>;
  totalProcessed: number;
}

// Generators
export const generateMockTasks = (count: number = 30): Task[] => {
  const types: Task['type'][] = ['approval', 'review', 'action', 'notification', 'assignment'];
  const statuses: Task['status'][] = ['pending', 'in_progress', 'completed', 'rejected', 'delegated', 'cancelled'];
  const priorities: Task['priority'][] = ['low', 'medium', 'high', 'urgent'];
  const modules: Task['module'][] = ['purchasing', 'quality', 'manufacturing', 'inventory', 'finance', 'hr'];

  const taskTitles = [
    'Approve Purchase Order',
    'Review Quality Inspection',
    'Approve Budget Request',
    'Review Work Order',
    'Approve Supplier Invoice',
    'Review Document Changes',
    'Approve Leave Request',
    'Review NCR Report',
    'Approve Stock Transfer',
    'Review Expense Claim',
  ];

  return Array.from({ length: count }, (_, i) => {
    const status = faker.helpers.weightedArrayElement([
      { value: 'pending' as const, weight: 0.4 },
      { value: 'in_progress' as const, weight: 0.2 },
      { value: 'completed' as const, weight: 0.25 },
      { value: 'rejected' as const, weight: 0.1 },
      { value: 'delegated' as const, weight: 0.03 },
      { value: 'cancelled' as const, weight: 0.02 },
    ]);

    const dueDate = faker.date.soon({ days: 7 });
    const slaDeadline = new Date(dueDate.getTime() + faker.number.int({ min: 1, max: 24 }) * 60 * 60 * 1000);
    const now = new Date();

    let slaStatus: Task['slaStatus'] = 'on_track';
    if (slaDeadline < now) {
      slaStatus = 'breached';
    } else if (slaDeadline.getTime() - now.getTime() < 4 * 60 * 60 * 1000) {
      slaStatus = 'at_risk';
    }

    const taskModule = faker.helpers.arrayElement(modules);
    const entityTypes = {
      purchasing: 'Purchase Order',
      quality: 'Inspection',
      manufacturing: 'Work Order',
      inventory: 'Stock Transfer',
      finance: 'Invoice',
      hr: 'Leave Request',
    };

    return {
      id: faker.string.uuid(),
      taskNumber: `TASK-${String(i + 1).padStart(5, '0')}`,
      title: faker.helpers.arrayElement(taskTitles),
      description: faker.lorem.paragraph(),
      type: faker.helpers.arrayElement(types),
      status,
      priority: faker.helpers.arrayElement(priorities),
      module: taskModule,
      workflowId: faker.datatype.boolean({ probability: 0.7 }) ? faker.string.uuid() : undefined,
      workflowName: faker.datatype.boolean({ probability: 0.7 }) ? faker.helpers.arrayElement(['Purchase Approval', 'QC Review', 'Document Review']) : undefined,
      workflowInstanceId: faker.datatype.boolean({ probability: 0.7 }) ? faker.string.uuid() : undefined,
      entityType: entityTypes[taskModule],
      entityId: faker.string.uuid(),
      entityName: `${entityTypes[taskModule]}-${faker.string.numeric(5)}`,
      assignedTo: faker.person.fullName(),
      assignedToId: faker.string.uuid(),
      assignedBy: faker.person.fullName(),
      delegatedTo: status === 'delegated' ? faker.person.fullName() : undefined,
      delegatedAt: status === 'delegated' ? faker.date.recent({ days: 3 }).toISOString() : undefined,
      dueDate: dueDate.toISOString(),
      slaDeadline: slaDeadline.toISOString(),
      slaStatus,
      completedAt: ['completed', 'rejected'].includes(status) ? faker.date.recent({ days: 5 }).toISOString() : undefined,
      completedBy: ['completed', 'rejected'].includes(status) ? faker.person.fullName() : undefined,
      outcome: status === 'completed' ? faker.helpers.arrayElement(['approved', 'completed'] as const) : status === 'rejected' ? 'rejected' : undefined,
      comments: generateMockTaskComments(faker.string.uuid(), faker.number.int({ min: 0, max: 5 })),
      attachments: generateMockTaskAttachments(faker.string.uuid(), faker.number.int({ min: 0, max: 3 })),
      history: generateMockTaskHistory(faker.string.uuid(), faker.number.int({ min: 2, max: 6 })),
      metadata: {
        amount: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }),
        reference: `REF-${faker.string.alphanumeric(8).toUpperCase()}`,
      },
      createdAt: faker.date.recent({ days: 14 }).toISOString(),
      updatedAt: faker.date.recent({ days: 3 }).toISOString(),
    };
  });
};

export const generateMockTaskComments = (taskId: string, count: number = 3): TaskComment[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: faker.string.uuid(),
    taskId,
    userId: faker.string.uuid(),
    userName: faker.person.fullName(),
    content: faker.lorem.sentence(),
    type: faker.helpers.arrayElement(['comment', 'system', 'decision'] as const),
    createdAt: new Date(Date.now() - (count - 1 - i) * faker.number.int({ min: 30, max: 120 }) * 60000).toISOString(),
    editedAt: faker.datatype.boolean({ probability: 0.1 }) ? faker.date.recent({ days: 1 }).toISOString() : undefined,
  }));
};

export const generateMockTaskAttachments = (taskId: string, count: number = 2): TaskAttachment[] => {
  const fileTypes = ['pdf', 'xlsx', 'docx', 'png', 'jpg'];

  return Array.from({ length: count }, () => {
    const fileType = faker.helpers.arrayElement(fileTypes);
    return {
      id: faker.string.uuid(),
      taskId,
      name: `${faker.system.fileName()}.${fileType}`,
      type: `application/${fileType}`,
      size: faker.number.int({ min: 10000, max: 5000000 }),
      url: faker.internet.url(),
      uploadedBy: faker.person.fullName(),
      uploadedAt: faker.date.recent({ days: 7 }).toISOString(),
    };
  });
};

export const generateMockTaskHistory = (taskId: string, count: number = 4): TaskHistoryItem[] => {
  const actions: TaskHistoryItem['action'][] = ['created', 'assigned', 'delegated', 'commented', 'status_changed', 'completed', 'rejected'];

  return Array.from({ length: count }, (_, i) => ({
    id: faker.string.uuid(),
    taskId,
    action: i === 0 ? 'created' : faker.helpers.arrayElement(actions),
    description: faker.lorem.sentence(),
    user: faker.person.fullName(),
    timestamp: new Date(Date.now() - (count - 1 - i) * faker.number.int({ min: 60, max: 240 }) * 60000).toISOString(),
    oldValue: faker.datatype.boolean({ probability: 0.3 }) ? faker.lorem.word() : undefined,
    newValue: faker.datatype.boolean({ probability: 0.3 }) ? faker.lorem.word() : undefined,
  }));
};

export const generateMockTaskStats = (): TaskStats => {
  const total = faker.number.int({ min: 50, max: 200 });
  const completed = faker.number.int({ min: 20, max: Math.floor(total * 0.6) });
  const pending = faker.number.int({ min: 10, max: total - completed - 10 });
  const inProgress = total - pending - completed;

  return {
    total,
    pending,
    inProgress,
    completed,
    overdue: faker.number.int({ min: 0, max: Math.floor(pending * 0.3) }),
    dueToday: faker.number.int({ min: 1, max: 10 }),
    dueTomorrow: faker.number.int({ min: 1, max: 8 }),
    avgCompletionTime: faker.number.float({ min: 2, max: 24, fractionDigits: 1 }),
    byPriority: [
      { priority: 'Urgent', count: faker.number.int({ min: 5, max: 20 }) },
      { priority: 'High', count: faker.number.int({ min: 10, max: 40 }) },
      { priority: 'Medium', count: faker.number.int({ min: 20, max: 60 }) },
      { priority: 'Low', count: faker.number.int({ min: 10, max: 30 }) },
    ],
    byModule: [
      { module: 'Purchasing', count: faker.number.int({ min: 10, max: 50 }) },
      { module: 'Quality', count: faker.number.int({ min: 8, max: 40 }) },
      { module: 'Manufacturing', count: faker.number.int({ min: 5, max: 30 }) },
      { module: 'Inventory', count: faker.number.int({ min: 5, max: 25 }) },
      { module: 'Finance', count: faker.number.int({ min: 3, max: 20 }) },
      { module: 'HR', count: faker.number.int({ min: 2, max: 15 }) },
    ],
    byStatus: [
      { status: 'Pending', count: pending },
      { status: 'In Progress', count: inProgress },
      { status: 'Completed', count: completed },
    ],
  };
};

export const generateMockBulkActionResult = (taskIds: string[]): BulkActionResult => {
  const failed = faker.datatype.boolean({ probability: 0.1 })
    ? [{ id: taskIds[0], error: 'Task is already completed' }]
    : [];

  return {
    success: taskIds.filter((id) => !failed.find((f) => f.id === id)),
    failed,
    totalProcessed: taskIds.length,
  };
};

// Notification Preferences Types
export interface NotificationPreferences {
  userId: string;
  email: {
    enabled: boolean;
    digest: 'realtime' | 'daily' | 'weekly';
    types: string[];
  };
  push: {
    enabled: boolean;
    types: string[];
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    soundTheme: 'default' | 'subtle' | 'chime' | 'none';
    types: string[];
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export const generateMockNotificationPreferences = (userId?: string): NotificationPreferences => {
  return {
    userId: userId || faker.string.uuid(),
    email: {
      enabled: true,
      digest: faker.helpers.arrayElement(['realtime', 'daily', 'weekly']),
      types: ['task_assigned', 'task_completed', 'mention', 'deadline_reminder'],
    },
    push: {
      enabled: faker.datatype.boolean({ probability: 0.7 }),
      types: ['task_assigned', 'urgent_task', 'mention'],
    },
    inApp: {
      enabled: true,
      sound: faker.datatype.boolean({ probability: 0.5 }),
      soundTheme: faker.helpers.arrayElement(['default', 'subtle', 'chime', 'none']),
      types: ['all'],
    },
    quietHours: {
      enabled: faker.datatype.boolean({ probability: 0.3 }),
      start: '22:00',
      end: '07:00',
    },
  };
};

// Extended Notification Types for history page
export interface NotificationHistoryItem {
  id: string;
  type: 'task' | 'system' | 'workflow' | 'alert' | 'mention' | 'reminder';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  readAt?: string;
}

export const generateMockNotificationHistory = (count: number = 50): NotificationHistoryItem[] => {
  const types: NotificationHistoryItem['type'][] = ['task', 'system', 'workflow', 'alert', 'mention', 'reminder'];
  const priorities: NotificationHistoryItem['priority'][] = ['low', 'medium', 'high', 'urgent'];

  const titles = {
    task: ['New task assigned', 'Task completed', 'Task due soon', 'Task overdue'],
    system: ['System maintenance', 'Update available', 'Backup completed', 'Security alert'],
    workflow: ['Approval required', 'Workflow completed', 'Workflow failed', 'Workflow cancelled'],
    alert: ['Stock alert', 'Quality alert', 'Budget alert', 'Performance alert'],
    mention: ['You were mentioned', 'Reply to your comment', 'Tagged in document'],
    reminder: ['Meeting reminder', 'Deadline reminder', 'Follow-up reminder'],
  };

  return Array.from({ length: count }, (_, i) => {
    const type = faker.helpers.arrayElement(types);
    const read = i > 5 ? faker.datatype.boolean({ probability: 0.8 }) : false;

    return {
      id: faker.string.uuid(),
      type,
      title: faker.helpers.arrayElement(titles[type]),
      message: faker.lorem.sentence(),
      priority: faker.helpers.arrayElement(priorities),
      read,
      actionUrl: faker.datatype.boolean({ probability: 0.7 }) ? `/tasks/${faker.string.uuid()}` : undefined,
      actionLabel: faker.datatype.boolean({ probability: 0.7 }) ? 'View Details' : undefined,
      metadata: faker.datatype.boolean({ probability: 0.3 })
        ? { entityId: faker.string.uuid(), entityType: 'task' }
        : undefined,
      createdAt: new Date(Date.now() - i * faker.number.int({ min: 30, max: 120 }) * 60000).toISOString(),
      readAt: read ? faker.date.recent({ days: 1 }).toISOString() : undefined,
    };
  });
};
