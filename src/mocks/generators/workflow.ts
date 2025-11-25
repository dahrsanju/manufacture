import { faker } from '@faker-js/faker';

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'approval' | 'process' | 'notification' | 'automation';
  status: 'draft' | 'active' | 'inactive' | 'archived';
  version: string;
  trigger: WorkflowTrigger;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface WorkflowTrigger {
  type: 'manual' | 'event' | 'schedule' | 'condition';
  event?: string;
  schedule?: string;
  condition?: string;
}

export interface WorkflowNode {
  id: string;
  type: 'start' | 'end' | 'approval' | 'condition' | 'action' | 'notification' | 'delay' | 'parallel';
  position: { x: number; y: number };
  data: WorkflowNodeData;
}

export interface WorkflowNodeData {
  label: string;
  description?: string;
  config: Record<string, unknown>;
  // Approval specific
  approvers?: string[];
  approvalType?: 'any' | 'all' | 'sequential';
  // Condition specific
  conditions?: WorkflowCondition[];
  // Action specific
  actionType?: string;
  actionParams?: Record<string, unknown>;
  // Notification specific
  recipients?: string[];
  template?: string;
  // Delay specific
  duration?: number;
  unit?: 'minutes' | 'hours' | 'days';
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in';
  value: unknown;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  condition?: string;
}

// Workflow Template Types
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'purchasing' | 'quality' | 'manufacturing' | 'hr' | 'finance' | 'general';
  preview: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: WorkflowVariable[];
  usageCount: number;
  rating: number;
  createdAt: string;
}

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'user' | 'list';
  required: boolean;
  defaultValue?: unknown;
  description?: string;
}

// Workflow Version Types
export interface WorkflowVersion {
  id: string;
  workflowId: string;
  version: string;
  status: 'draft' | 'published' | 'deprecated';
  changes: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
}

// Workflow Instance Types
export interface WorkflowInstance {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled' | 'waiting';
  currentNode: string;
  currentNodeName: string;
  triggeredBy: string;
  triggerData: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
  history: WorkflowHistoryItem[];
}

export interface WorkflowHistoryItem {
  id: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  startedAt: string;
  completedAt?: string;
  result?: Record<string, unknown>;
  error?: string;
}

// Node Palette Types
export interface NodePaletteItem {
  type: WorkflowNode['type'];
  label: string;
  description: string;
  icon: string;
  category: 'control' | 'action' | 'logic';
  defaultConfig: Record<string, unknown>;
}

// Validation Types
export interface WorkflowValidation {
  isValid: boolean;
  errors: WorkflowValidationError[];
  warnings: WorkflowValidationWarning[];
}

export interface WorkflowValidationError {
  nodeId?: string;
  edgeId?: string;
  type: 'orphan_node' | 'missing_connection' | 'invalid_config' | 'no_start' | 'no_end' | 'cycle_detected';
  message: string;
}

export interface WorkflowValidationWarning {
  nodeId?: string;
  type: 'unreachable_node' | 'missing_description' | 'complex_condition';
  message: string;
}

// Generators
export const generateMockWorkflows = (count: number = 10): Workflow[] => {
  const types: Workflow['type'][] = ['approval', 'process', 'notification', 'automation'];
  const statuses: Workflow['status'][] = ['draft', 'active', 'inactive', 'archived'];

  return Array.from({ length: count }, (_, i) => {
    const { nodes, edges } = generateMockWorkflowGraph();

    return {
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement([
        'Purchase Order Approval',
        'Quality Inspection Flow',
        'New Employee Onboarding',
        'Invoice Processing',
        'Change Request Approval',
        'Equipment Maintenance',
        'Customer Complaint Resolution',
        'Document Review Process',
      ]),
      description: faker.lorem.sentence(),
      type: faker.helpers.arrayElement(types),
      status: i < 5 ? 'active' : faker.helpers.arrayElement(statuses),
      version: `${faker.number.int({ min: 1, max: 5 })}.${faker.number.int({ min: 0, max: 9 })}`,
      trigger: generateMockTrigger(),
      nodes,
      edges,
      createdBy: faker.person.fullName(),
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString(),
      publishedAt: faker.datatype.boolean({ probability: 0.7 }) ? faker.date.recent({ days: 60 }).toISOString() : undefined,
    };
  });
};

export const generateMockTrigger = (): WorkflowTrigger => {
  const type = faker.helpers.arrayElement(['manual', 'event', 'schedule', 'condition'] as const);

  return {
    type,
    event: type === 'event' ? faker.helpers.arrayElement(['order.created', 'inspection.completed', 'document.uploaded']) : undefined,
    schedule: type === 'schedule' ? faker.helpers.arrayElement(['0 9 * * *', '0 0 * * 1', '0 */4 * * *']) : undefined,
    condition: type === 'condition' ? 'amount > 1000' : undefined,
  };
};

export const generateMockWorkflowGraph = (): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } => {
  const startNode: WorkflowNode = {
    id: 'start',
    type: 'start',
    position: { x: 250, y: 50 },
    data: {
      label: 'Start',
      config: {},
    },
  };

  const approvalNode: WorkflowNode = {
    id: 'approval-1',
    type: 'approval',
    position: { x: 250, y: 150 },
    data: {
      label: 'Manager Approval',
      description: 'Requires manager approval',
      config: {},
      approvers: [faker.person.fullName()],
      approvalType: 'any',
    },
  };

  const conditionNode: WorkflowNode = {
    id: 'condition-1',
    type: 'condition',
    position: { x: 250, y: 250 },
    data: {
      label: 'Check Amount',
      description: 'Check if amount exceeds threshold',
      config: {},
      conditions: [
        { field: 'amount', operator: 'greater_than', value: 5000 },
      ],
    },
  };

  const actionNode: WorkflowNode = {
    id: 'action-1',
    type: 'action',
    position: { x: 100, y: 350 },
    data: {
      label: 'Send Notification',
      config: {},
      actionType: 'notification',
      actionParams: { template: 'approval_required' },
    },
  };

  const endNode: WorkflowNode = {
    id: 'end',
    type: 'end',
    position: { x: 250, y: 450 },
    data: {
      label: 'End',
      config: {},
    },
  };

  const nodes = [startNode, approvalNode, conditionNode, actionNode, endNode];

  const edges: WorkflowEdge[] = [
    { id: 'e1', source: 'start', target: 'approval-1' },
    { id: 'e2', source: 'approval-1', target: 'condition-1' },
    { id: 'e3', source: 'condition-1', target: 'action-1', label: 'Yes', sourceHandle: 'true' },
    { id: 'e4', source: 'condition-1', target: 'end', label: 'No', sourceHandle: 'false' },
    { id: 'e5', source: 'action-1', target: 'end' },
  ];

  return { nodes, edges };
};

export const generateMockWorkflowTemplates = (): WorkflowTemplate[] => {
  const templates = [
    {
      name: 'Purchase Order Approval',
      description: 'Standard 3-level approval workflow for purchase orders',
      category: 'purchasing' as const,
    },
    {
      name: 'Quality Control Flow',
      description: 'Inspection and defect reporting workflow',
      category: 'quality' as const,
    },
    {
      name: 'Issue Resolution',
      description: 'Customer complaint and issue tracking workflow',
      category: 'general' as const,
    },
    {
      name: 'Document Review',
      description: 'Multi-stage document review and approval',
      category: 'general' as const,
    },
    {
      name: 'Employee Onboarding',
      description: 'New hire onboarding checklist workflow',
      category: 'hr' as const,
    },
    {
      name: 'Invoice Processing',
      description: 'Invoice receipt to payment workflow',
      category: 'finance' as const,
    },
  ];

  return templates.map((t) => {
    const { nodes, edges } = generateMockWorkflowGraph();

    return {
      id: faker.string.uuid(),
      name: t.name,
      description: t.description,
      category: t.category,
      preview: faker.image.url(),
      nodes,
      edges,
      variables: generateMockWorkflowVariables(),
      usageCount: faker.number.int({ min: 5, max: 100 }),
      rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
    };
  });
};

export const generateMockWorkflowVariables = (): WorkflowVariable[] => {
  return [
    { name: 'requestor', type: 'user', required: true, description: 'The person making the request' },
    { name: 'amount', type: 'number', required: true, description: 'Total amount for approval' },
    { name: 'description', type: 'string', required: false, description: 'Additional details' },
    { name: 'priority', type: 'string', required: false, defaultValue: 'normal', description: 'Request priority' },
  ];
};

export const generateMockWorkflowVersions = (workflowId: string, count: number = 5): WorkflowVersion[] => {
  return Array.from({ length: count }, (_, i) => {
    const { nodes, edges } = generateMockWorkflowGraph();

    return {
      id: faker.string.uuid(),
      workflowId,
      version: `${count - i}.0`,
      status: i === 0 ? 'published' : i === count - 1 ? 'draft' : 'deprecated',
      changes: faker.lorem.sentence(),
      nodes,
      edges,
      createdBy: faker.person.fullName(),
      createdAt: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString(),
      publishedAt: i < count - 1 ? new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000 + 86400000).toISOString() : undefined,
    };
  });
};

export const generateMockWorkflowInstances = (count: number = 15): WorkflowInstance[] => {
  const statuses: WorkflowInstance['status'][] = ['running', 'completed', 'failed', 'cancelled', 'waiting'];

  return Array.from({ length: count }, () => {
    const status = faker.helpers.arrayElement(statuses);

    return {
      id: faker.string.uuid(),
      workflowId: faker.string.uuid(),
      workflowName: faker.helpers.arrayElement(['Purchase Order Approval', 'Quality Inspection', 'Document Review']),
      status,
      currentNode: 'approval-1',
      currentNodeName: 'Manager Approval',
      triggeredBy: faker.person.fullName(),
      triggerData: {
        orderId: faker.string.uuid(),
        amount: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }),
      },
      startedAt: faker.date.recent({ days: 7 }).toISOString(),
      completedAt: ['completed', 'failed', 'cancelled'].includes(status) ? faker.date.recent({ days: 3 }).toISOString() : undefined,
      history: generateMockWorkflowHistory(),
    };
  });
};

export const generateMockWorkflowHistory = (): WorkflowHistoryItem[] => {
  return [
    {
      id: faker.string.uuid(),
      nodeId: 'start',
      nodeName: 'Start',
      nodeType: 'start',
      status: 'completed',
      startedAt: faker.date.recent({ days: 5 }).toISOString(),
      completedAt: faker.date.recent({ days: 5 }).toISOString(),
    },
    {
      id: faker.string.uuid(),
      nodeId: 'approval-1',
      nodeName: 'Manager Approval',
      nodeType: 'approval',
      status: faker.helpers.arrayElement(['completed', 'in_progress', 'pending'] as const),
      startedAt: faker.date.recent({ days: 4 }).toISOString(),
      completedAt: faker.datatype.boolean() ? faker.date.recent({ days: 3 }).toISOString() : undefined,
      result: faker.datatype.boolean() ? { approved: true, approver: faker.person.fullName() } : undefined,
    },
  ];
};

export const generateMockNodePalette = (): NodePaletteItem[] => {
  return [
    {
      type: 'start',
      label: 'Start',
      description: 'Workflow entry point',
      icon: 'PlayCircle',
      category: 'control',
      defaultConfig: {},
    },
    {
      type: 'end',
      label: 'End',
      description: 'Workflow exit point',
      icon: 'StopCircle',
      category: 'control',
      defaultConfig: {},
    },
    {
      type: 'approval',
      label: 'Approval',
      description: 'Request approval from users',
      icon: 'CheckCircle',
      category: 'action',
      defaultConfig: { approvalType: 'any' },
    },
    {
      type: 'condition',
      label: 'Condition',
      description: 'Branch based on conditions',
      icon: 'GitBranch',
      category: 'logic',
      defaultConfig: { conditions: [] },
    },
    {
      type: 'action',
      label: 'Action',
      description: 'Execute an action',
      icon: 'Zap',
      category: 'action',
      defaultConfig: { actionType: 'custom' },
    },
    {
      type: 'notification',
      label: 'Notification',
      description: 'Send notification to users',
      icon: 'Bell',
      category: 'action',
      defaultConfig: { recipients: [], template: '' },
    },
    {
      type: 'delay',
      label: 'Delay',
      description: 'Wait for specified duration',
      icon: 'Clock',
      category: 'control',
      defaultConfig: { duration: 1, unit: 'hours' },
    },
    {
      type: 'parallel',
      label: 'Parallel',
      description: 'Execute branches in parallel',
      icon: 'GitFork',
      category: 'logic',
      defaultConfig: {},
    },
  ];
};

export const generateMockWorkflowValidation = (hasErrors: boolean = false): WorkflowValidation => {
  if (!hasErrors) {
    return {
      isValid: true,
      errors: [],
      warnings: [
        {
          nodeId: 'approval-1',
          type: 'missing_description',
          message: 'Node "Manager Approval" is missing a description',
        },
      ],
    };
  }

  return {
    isValid: false,
    errors: [
      {
        nodeId: 'action-2',
        type: 'orphan_node',
        message: 'Node "Send Email" is not connected to any other node',
      },
      {
        type: 'missing_connection',
        message: 'Workflow must have at least one path from Start to End',
      },
    ],
    warnings: [
      {
        nodeId: 'condition-1',
        type: 'complex_condition',
        message: 'Condition has more than 5 rules which may be hard to maintain',
      },
    ],
  };
};
