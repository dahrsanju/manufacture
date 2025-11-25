import { faker } from '@faker-js/faker';

export interface Activity {
  id: string;
  action: string;
  item: string;
  itemId: string;
  type: 'create' | 'update' | 'complete' | 'success' | 'alert' | 'error';
  user: string;
  timestamp: string;
  module: string;
}

const activityTemplates = [
  { action: 'Product Created', type: 'create', module: 'inventory' },
  { action: 'Stock Updated', type: 'update', module: 'inventory' },
  { action: 'Work Order Completed', type: 'complete', module: 'production' },
  { action: 'Quality Check Passed', type: 'success', module: 'quality' },
  { action: 'Low Stock Alert', type: 'alert', module: 'inventory' },
  { action: 'Order Shipped', type: 'complete', module: 'sales' },
  { action: 'Invoice Generated', type: 'create', module: 'finance' },
  { action: 'BOM Updated', type: 'update', module: 'production' },
  { action: 'Supplier Added', type: 'create', module: 'procurement' },
  { action: 'Task Assigned', type: 'update', module: 'workflow' },
  { action: 'Inspection Failed', type: 'error', module: 'quality' },
  { action: 'Transfer Completed', type: 'complete', module: 'warehouse' },
];

const itemPrefixes: Record<string, string> = {
  inventory: 'PRD-',
  production: 'WO-',
  quality: 'QC-',
  sales: 'ORD-',
  finance: 'INV-',
  procurement: 'SUP-',
  workflow: 'TSK-',
  warehouse: 'TRF-',
};

export const generateMockActivity = (count: number = 10): Activity[] => {
  return Array.from({ length: count }, (_, i) => {
    const template = faker.helpers.arrayElement(activityTemplates);
    const prefix = itemPrefixes[template.module] || 'ITM-';
    const minutesAgo = i * faker.number.int({ min: 5, max: 30 });

    return {
      id: faker.string.uuid(),
      action: template.action,
      item: `${prefix}${faker.string.numeric(4)}`,
      itemId: faker.string.uuid(),
      type: template.type as Activity['type'],
      user: faker.person.fullName(),
      timestamp: new Date(Date.now() - minutesAgo * 60000).toISOString(),
      module: template.module,
    };
  });
};

// Generate chart data for dashboard
export const generateRevenueChartData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((name) => ({
    name,
    revenue: faker.number.int({ min: 30000, max: 80000 }),
    orders: faker.number.int({ min: 15, max: 50 }),
  }));
};

export const generateProductionChartData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  return days.map((name) => ({
    name,
    units: faker.number.int({ min: 100, max: 250 }),
  }));
};

export const generateInventoryByCategory = () => {
  return [
    { name: 'Electronics', value: faker.number.int({ min: 200, max: 500 }) },
    { name: 'Components', value: faker.number.int({ min: 200, max: 400 }) },
    { name: 'Raw Materials', value: faker.number.int({ min: 150, max: 300 }) },
    { name: 'Finished', value: faker.number.int({ min: 200, max: 400 }) },
  ];
};

// Generate sparkline data (last 7 data points)
export const generateSparklineData = (trend: 'up' | 'down' | 'stable' = 'up'): number[] => {
  const baseValue = faker.number.int({ min: 50, max: 100 });
  const data: number[] = [];

  for (let i = 0; i < 7; i++) {
    let change = faker.number.int({ min: -10, max: 10 });
    if (trend === 'up') change = faker.number.int({ min: -5, max: 15 });
    if (trend === 'down') change = faker.number.int({ min: -15, max: 5 });

    const value = Math.max(0, baseValue + change * (i + 1));
    data.push(value);
  }

  return data;
};
