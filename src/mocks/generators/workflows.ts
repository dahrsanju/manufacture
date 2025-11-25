import { faker } from '@faker-js/faker';
import type { Workflow, WorkflowTask } from '@/types';

const generateMockWorkflows = (): Workflow[] => {
  return [
    {
      id: 'wf-001',
      name: 'Purchase Order Approval',
      description: 'Standard approval workflow for purchase orders',
      status: 'active',
      instances: 24,
      completedToday: 12,
      avgDuration: '2.5 hours',
      steps: ['Submit', 'Manager Review', 'Finance Approval', 'Complete'],
    },
    {
      id: 'wf-002',
      name: 'Quality Inspection',
      description: 'Quality control inspection workflow',
      status: 'active',
      instances: 45,
      completedToday: 38,
      avgDuration: '45 mins',
      steps: ['Sample', 'Inspect', 'Report', 'Decision'],
    },
    {
      id: 'wf-003',
      name: 'Work Order Processing',
      description: 'Manufacturing work order workflow',
      status: 'active',
      instances: 67,
      completedToday: 52,
      avgDuration: '4 hours',
      steps: ['Create', 'Schedule', 'Execute', 'QC', 'Complete'],
    },
    {
      id: 'wf-004',
      name: 'Stock Transfer',
      description: 'Inter-warehouse stock transfer workflow',
      status: 'active',
      instances: 15,
      completedToday: 8,
      avgDuration: '1.5 hours',
      steps: ['Request', 'Approve', 'Ship', 'Receive', 'Confirm'],
    },
  ];
};

export const generateMockWorkflowTasks = (count: number = 10): WorkflowTask[] => {
  const workflows = generateMockWorkflows();

  return Array.from({ length: count }, () => {
    const workflow = faker.helpers.arrayElement(workflows);
    const status = faker.helpers.arrayElement(['pending', 'in_progress', 'completed', 'rejected'] as const);

    return {
      id: faker.string.uuid(),
      workflowId: workflow.id,
      workflowName: workflow.name,
      title: faker.helpers.arrayElement([
        'Review Purchase Order #2024-001',
        'Approve Stock Transfer Request',
        'Quality Inspection Required',
        'Complete Work Order WO-2024-089',
        'Verify Inventory Adjustment',
      ]),
      description: faker.lorem.sentence(),
      status,
      priority: faker.helpers.arrayElement(['high', 'medium', 'low'] as const),
      assigneeId: faker.string.uuid(),
      assigneeName: faker.person.fullName(),
      dueDate: faker.date.soon({ days: 3 }).toISOString(),
      slaDeadline: faker.date.soon({ days: 1 }).toISOString(),
      createdAt: faker.date.recent().toISOString(),
      completedAt: status === 'completed' ? faker.date.recent().toISOString() : undefined,
    };
  });
};
