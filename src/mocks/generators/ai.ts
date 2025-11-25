import { faker } from '@faker-js/faker';

// AI Insights Generator
export interface AIInsight {
  id: string;
  type: 'anomaly' | 'optimization' | 'prediction' | 'recommendation' | 'risk';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  actionLabel?: string;
  actionUrl?: string;
  timestamp: string;
  module: 'inventory' | 'production' | 'quality' | 'warehouse' | 'finance';
  relatedEntity?: {
    type: string;
    id: string;
    name: string;
  };
  metadata?: Record<string, unknown>;
}

const insightTemplates = [
  // Inventory insights
  {
    type: 'anomaly',
    title: 'Unusual stock movement detected',
    description: 'Product {product} shows {percent}% higher consumption than forecast. Review inventory levels.',
    module: 'inventory',
    actionLabel: 'Review Stock',
    actionUrl: '/inventory/products/{id}',
  },
  {
    type: 'optimization',
    title: 'Reorder point adjustment',
    description: 'Based on lead time analysis, consider increasing reorder point for {product} from {from} to {to} units.',
    module: 'inventory',
    actionLabel: 'Update Reorder Point',
    actionUrl: '/inventory/products/{id}/edit',
  },
  {
    type: 'risk',
    title: 'Stockout risk detected',
    description: '{product} is projected to stockout in {days} days based on current consumption rate.',
    module: 'inventory',
    actionLabel: 'Create PO',
    actionUrl: '/procurement/purchase-orders/new',
  },
  // Production insights
  {
    type: 'prediction',
    title: 'Quality risk forecast',
    description: 'Batch {batch} shows {percent}% higher defect probability based on supplier history.',
    module: 'production',
    actionLabel: 'Schedule Inspection',
    actionUrl: '/quality/inspections/new',
  },
  {
    type: 'recommendation',
    title: 'Production scheduling optimization',
    description: 'Optimize work order sequence for {percent}% efficiency gain. Prioritize {workOrder}.',
    module: 'production',
    actionLabel: 'View Schedule',
    actionUrl: '/production/schedule',
  },
  {
    type: 'anomaly',
    title: 'Machine performance degradation',
    description: 'Machine {machine} showing {percent}% decreased output. Predictive maintenance recommended.',
    module: 'production',
    actionLabel: 'Schedule Maintenance',
    actionUrl: '/production/maintenance/new',
  },
  // Warehouse insights
  {
    type: 'optimization',
    title: 'Warehouse space optimization',
    description: 'Zone {zone} utilization is at {percent}%. Recommend redistributing inventory.',
    module: 'warehouse',
    actionLabel: 'View Layout',
    actionUrl: '/warehouses/{id}/layout',
  },
  {
    type: 'prediction',
    title: 'Capacity threshold alert',
    description: 'Warehouse {warehouse} projected to reach {percent}% capacity in {days} days.',
    module: 'warehouse',
    actionLabel: 'Plan Expansion',
    actionUrl: '/warehouses/{id}',
  },
  // Quality insights
  {
    type: 'anomaly',
    title: 'Supplier quality degradation',
    description: 'Supplier {supplier} showing {percent}% increase in defect rate over last 30 days.',
    module: 'quality',
    actionLabel: 'View Supplier',
    actionUrl: '/suppliers/{id}',
  },
  {
    type: 'recommendation',
    title: 'Inspection frequency adjustment',
    description: 'Based on quality trends, recommend {action} inspection frequency for {product}.',
    module: 'quality',
    actionLabel: 'Update Schedule',
    actionUrl: '/quality/settings',
  },
];

export const generateMockInsights = (count: number = 6): AIInsight[] => {
  return Array.from({ length: count }, () => {
    const template = faker.helpers.arrayElement(insightTemplates);
    const confidence = faker.number.int({ min: 65, max: 98 });
    const minutesAgo = faker.number.int({ min: 5, max: 300 });

    // Generate dynamic values for placeholders
    const product = `${faker.commerce.productAdjective()} ${faker.commerce.product()}`;
    const percent = faker.number.int({ min: 10, max: 40 });
    const days = faker.number.int({ min: 3, max: 14 });

    let description = template.description
      .replace('{product}', product)
      .replace('{percent}', percent.toString())
      .replace('{days}', days.toString())
      .replace('{from}', faker.number.int({ min: 20, max: 50 }).toString())
      .replace('{to}', faker.number.int({ min: 60, max: 100 }).toString())
      .replace('{batch}', `B-${faker.string.numeric(4)}`)
      .replace('{workOrder}', `WO-2024-${faker.string.numeric(4)}`)
      .replace('{machine}', `Machine ${faker.string.alpha({ length: 1, casing: 'upper' })}-${faker.string.numeric(2)}`)
      .replace('{zone}', faker.helpers.arrayElement(['A', 'B', 'C', 'D']))
      .replace('{warehouse}', `Warehouse ${faker.helpers.arrayElement(['Main', 'East', 'West', 'North'])}`)
      .replace('{supplier}', faker.company.name())
      .replace('{action}', faker.helpers.arrayElement(['increasing', 'decreasing']));

    return {
      id: faker.string.uuid(),
      type: template.type as AIInsight['type'],
      title: template.title,
      description,
      severity: faker.helpers.arrayElement(['low', 'medium', 'high', 'critical']) as AIInsight['severity'],
      confidence,
      impact: faker.helpers.arrayElement(['low', 'medium', 'high']) as AIInsight['impact'],
      actionable: !!template.actionLabel,
      actionLabel: template.actionLabel,
      actionUrl: template.actionUrl?.replace('{id}', faker.string.uuid()),
      timestamp: new Date(Date.now() - minutesAgo * 60000).toISOString(),
      module: template.module as AIInsight['module'],
      relatedEntity: faker.datatype.boolean()
        ? {
            type: faker.helpers.arrayElement(['product', 'batch', 'supplier', 'machine']),
            id: faker.string.uuid(),
            name: product,
          }
        : undefined,
    };
  });
};

// Anomaly Generator
export interface Anomaly {
  id: string;
  entityType: 'product' | 'work-order' | 'supplier' | 'machine';
  entityId: string;
  entityName: string;
  score: number; // 0-100
  type: string;
  description: string;
  detectedAt: string;
  resolved: boolean;
}

export const generateMockAnomalies = (count: number = 10): Anomaly[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    entityType: faker.helpers.arrayElement(['product', 'work-order', 'supplier', 'machine']) as Anomaly['entityType'],
    entityId: faker.string.uuid(),
    entityName: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
    score: faker.number.int({ min: 30, max: 95 }),
    type: faker.helpers.arrayElement([
      'consumption_spike',
      'quality_degradation',
      'delivery_delay',
      'cost_variance',
      'performance_drop',
    ]),
    description: faker.lorem.sentence(),
    detectedAt: faker.date.recent({ days: 7 }).toISOString(),
    resolved: faker.datatype.boolean({ probability: 0.3 }),
  }));
};

// Smart Form Suggestions
export interface FormSuggestion {
  field: string;
  value: string;
  confidence: number;
  source: string;
}

export interface DuplicateCandidate {
  id: string;
  name: string;
  sku: string;
  similarity: number;
}

export interface RelatedProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  relationship: 'similar' | 'complementary' | 'substitute';
}

export const generateFormSuggestions = (fieldName: string): FormSuggestion[] => {
  const suggestions: Record<string, FormSuggestion[]> = {
    name: [
      { field: 'name', value: faker.commerce.productName(), confidence: 85, source: 'Similar products' },
      { field: 'name', value: faker.commerce.productName(), confidence: 72, source: 'Category patterns' },
    ],
    sku: [
      { field: 'sku', value: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`, confidence: 90, source: 'Auto-generated' },
    ],
    category: [
      { field: 'category', value: faker.commerce.department(), confidence: 88, source: 'Product analysis' },
      { field: 'category', value: faker.commerce.department(), confidence: 75, source: 'Supplier category' },
    ],
    price: [
      { field: 'price', value: faker.commerce.price({ min: 10, max: 500 }), confidence: 78, source: 'Market analysis' },
    ],
    reorderPoint: [
      { field: 'reorderPoint', value: faker.number.int({ min: 20, max: 100 }).toString(), confidence: 82, source: 'Demand forecast' },
    ],
  };

  return suggestions[fieldName] || [];
};

export const generateDuplicateCandidates = (): DuplicateCandidate[] => {
  return Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    sku: `SKU-${faker.string.alphanumeric(6).toUpperCase()}`,
    similarity: faker.number.int({ min: 70, max: 95 }),
  }));
};

export const generateRelatedProducts = (): RelatedProduct[] => {
  return Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    sku: `SKU-${faker.string.alphanumeric(6).toUpperCase()}`,
    category: faker.commerce.department(),
    relationship: faker.helpers.arrayElement(['similar', 'complementary', 'substitute']) as RelatedProduct['relationship'],
  }));
};

// Command Suggestions
export interface CommandSuggestion {
  id: string;
  text: string;
  action: string;
  params?: Record<string, string>;
  confidence: number;
}

export const generateCommandSuggestions = (query: string): CommandSuggestion[] => {
  const suggestions: CommandSuggestion[] = [
    {
      id: '1',
      text: `Show low stock items`,
      action: 'navigate',
      params: { path: '/inventory/products?filter=low-stock' },
      confidence: 95,
    },
    {
      id: '2',
      text: `Create new work order`,
      action: 'navigate',
      params: { path: '/production/work-orders/new' },
      confidence: 90,
    },
    {
      id: '3',
      text: `View pending inspections`,
      action: 'navigate',
      params: { path: '/quality/inspections?status=pending' },
      confidence: 85,
    },
    {
      id: '4',
      text: `Generate inventory report`,
      action: 'action',
      params: { type: 'report', report: 'inventory' },
      confidence: 88,
    },
    {
      id: '5',
      text: `Show warehouse utilization`,
      action: 'navigate',
      params: { path: '/warehouses?view=utilization' },
      confidence: 82,
    },
  ];

  if (!query) return suggestions.slice(0, 3);

  return suggestions
    .filter((s) => s.text.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);
};

// Recent Actions
export interface RecentAction {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  path: string;
}

export const generateRecentActions = (): RecentAction[] => {
  const actions = [
    { action: 'Viewed', entity: 'Product', path: '/inventory/products/' },
    { action: 'Created', entity: 'Work Order', path: '/production/work-orders/' },
    { action: 'Updated', entity: 'Inspection', path: '/quality/inspections/' },
    { action: 'Generated', entity: 'Report', path: '/reports/' },
    { action: 'Viewed', entity: 'Warehouse', path: '/warehouses/' },
  ];

  return actions.slice(0, 5).map((item, i) => ({
    id: faker.string.uuid(),
    action: item.action,
    entity: item.entity,
    entityId: faker.string.uuid(),
    timestamp: new Date(Date.now() - i * 15 * 60000).toISOString(),
    path: item.path + faker.string.uuid(),
  }));
};

// Demand Forecast
export interface ForecastDataPoint {
  date: string;
  actual?: number;
  predicted: number;
  lower: number;
  upper: number;
}

export const generateDemandForecast = (days: number = 30): ForecastDataPoint[] => {
  const data: ForecastDataPoint[] = [];
  const today = new Date();
  const historicalDays = Math.floor(days / 3);

  for (let i = -historicalDays; i < days - historicalDays; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const baseValue = 100 + Math.sin(i / 7) * 20;
    const noise = Math.random() * 10 - 5;
    const trend = i * 0.3;

    const predicted = baseValue + trend + noise;
    const variance = 12 + Math.abs(i) * 0.4;

    data.push({
      date: date.toISOString().split('T')[0],
      actual: i < 0 ? Math.round(predicted + (Math.random() * 10 - 5)) : undefined,
      predicted: Math.round(predicted),
      lower: Math.round(predicted - variance),
      upper: Math.round(predicted + variance),
    });
  }

  return data;
};
