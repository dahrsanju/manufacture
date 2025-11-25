import { faker } from '@faker-js/faker';

// Analytics Types
export interface AnalyticsKPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changeDirection: 'up' | 'down' | 'stable';
  trend: number[];
}

export interface AnalyticsData {
  kpis: AnalyticsKPI[];
  charts: {
    revenue: { date: string; value: number; forecast?: number }[];
    production: { date: string; planned: number; actual: number }[];
    inventory: { category: string; value: number; color: string }[];
    quality: { date: string; rate: number; target: number }[];
    deliveryPerformance: { date: string; onTime: number; late: number }[];
  };
  topProducts: {
    id: string;
    name: string;
    sku: string;
    revenue: number;
    units: number;
    growth: number;
  }[];
  alerts: {
    id: string;
    type: 'warning' | 'critical' | 'info';
    title: string;
    message: string;
    timestamp: string;
    action?: string;
  }[];
}

export const generateMockAnalytics = (): AnalyticsData => {
  const kpis: AnalyticsKPI[] = [
    {
      id: 'revenue',
      name: 'Total Revenue',
      value: faker.number.int({ min: 100000, max: 500000 }),
      unit: '$',
      change: faker.number.float({ min: -10, max: 15, fractionDigits: 1 }),
      changeDirection: faker.helpers.arrayElement(['up', 'down', 'stable']),
      trend: Array.from({ length: 7 }, () => faker.number.int({ min: 10000, max: 80000 })),
    },
    {
      id: 'orders',
      name: 'Total Orders',
      value: faker.number.int({ min: 500, max: 2000 }),
      unit: '',
      change: faker.number.float({ min: -5, max: 20, fractionDigits: 1 }),
      changeDirection: faker.helpers.arrayElement(['up', 'down', 'stable']),
      trend: Array.from({ length: 7 }, () => faker.number.int({ min: 50, max: 300 })),
    },
    {
      id: 'production',
      name: 'Production Output',
      value: faker.number.int({ min: 5000, max: 15000 }),
      unit: 'units',
      change: faker.number.float({ min: -8, max: 12, fractionDigits: 1 }),
      changeDirection: faker.helpers.arrayElement(['up', 'down', 'stable']),
      trend: Array.from({ length: 7 }, () => faker.number.int({ min: 500, max: 2500 })),
    },
    {
      id: 'quality',
      name: 'Quality Rate',
      value: faker.number.float({ min: 94, max: 99.5, fractionDigits: 1 }),
      unit: '%',
      change: faker.number.float({ min: -2, max: 3, fractionDigits: 1 }),
      changeDirection: faker.helpers.arrayElement(['up', 'down', 'stable']),
      trend: Array.from({ length: 7 }, () => faker.number.float({ min: 92, max: 99, fractionDigits: 1 })),
    },
    {
      id: 'inventory',
      name: 'Inventory Value',
      value: faker.number.int({ min: 200000, max: 800000 }),
      unit: '$',
      change: faker.number.float({ min: -5, max: 10, fractionDigits: 1 }),
      changeDirection: faker.helpers.arrayElement(['up', 'down', 'stable']),
      trend: Array.from({ length: 7 }, () => faker.number.int({ min: 150000, max: 900000 })),
    },
    {
      id: 'ontime',
      name: 'On-Time Delivery',
      value: faker.number.float({ min: 90, max: 98, fractionDigits: 1 }),
      unit: '%',
      change: faker.number.float({ min: -3, max: 5, fractionDigits: 1 }),
      changeDirection: faker.helpers.arrayElement(['up', 'down', 'stable']),
      trend: Array.from({ length: 7 }, () => faker.number.float({ min: 88, max: 99, fractionDigits: 1 })),
    },
  ];

  // Generate revenue chart data (last 30 days)
  const revenueData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    value: faker.number.int({ min: 8000, max: 25000 }),
    forecast: i > 22 ? faker.number.int({ min: 10000, max: 28000 }) : undefined,
  }));

  // Generate production chart data (last 7 days)
  const productionData = Array.from({ length: 7 }, (_, i) => {
    const planned = faker.number.int({ min: 800, max: 1500 });
    return {
      date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
      planned,
      actual: planned + faker.number.int({ min: -200, max: 100 }),
    };
  });

  // Generate inventory by category
  const inventoryData = [
    { category: 'Electronics', value: faker.number.int({ min: 50000, max: 150000 }), color: '#3B82F6' },
    { category: 'Raw Materials', value: faker.number.int({ min: 30000, max: 100000 }), color: '#10B981' },
    { category: 'Finished Goods', value: faker.number.int({ min: 40000, max: 120000 }), color: '#F59E0B' },
    { category: 'Packaging', value: faker.number.int({ min: 10000, max: 40000 }), color: '#6366F1' },
    { category: 'Tools', value: faker.number.int({ min: 15000, max: 50000 }), color: '#EC4899' },
  ];

  // Generate quality trend
  const qualityData = Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split('T')[0],
    rate: faker.number.float({ min: 94, max: 99, fractionDigits: 1 }),
    target: 97,
  }));

  // Generate delivery performance
  const deliveryData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
    onTime: faker.number.int({ min: 85, max: 98 }),
    late: faker.number.int({ min: 2, max: 15 }),
  }));

  // Generate top products
  const topProducts = Array.from({ length: 10 }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    sku: `SKU-${faker.string.alphanumeric(6).toUpperCase()}`,
    revenue: faker.number.int({ min: 5000, max: 50000 }),
    units: faker.number.int({ min: 50, max: 500 }),
    growth: faker.number.float({ min: -10, max: 30, fractionDigits: 1 }),
  })).sort((a, b) => b.revenue - a.revenue);

  // Generate alerts
  const alerts = [
    {
      id: faker.string.uuid(),
      type: 'warning' as const,
      title: 'Low Stock Alert',
      message: '5 products below reorder point',
      timestamp: faker.date.recent({ days: 1 }).toISOString(),
      action: 'View Items',
    },
    {
      id: faker.string.uuid(),
      type: 'critical' as const,
      title: 'Quality Issue Detected',
      message: 'Quality issue detected in Batch B-2024-156',
      timestamp: faker.date.recent({ days: 2 }).toISOString(),
      action: 'Investigate',
    },
    {
      id: faker.string.uuid(),
      type: 'info' as const,
      title: 'Production Target Achieved',
      message: 'Weekly production target achieved: 105%',
      timestamp: faker.date.recent({ days: 3 }).toISOString(),
    },
  ];

  return {
    kpis,
    charts: {
      revenue: revenueData,
      production: productionData,
      inventory: inventoryData,
      quality: qualityData,
      deliveryPerformance: deliveryData,
    },
    topProducts,
    alerts,
  };
};

// Forecasting Types
export interface ForecastData {
  kpis: {
    id: string;
    name: string;
    currentValue: number;
    forecastValue: number;
    confidence: number;
    unit: string;
  }[];
  demandForecast: {
    date: string;
    predicted: number;
    lowerBound: number;
    upperBound: number;
    actual?: number;
  }[];
  inventoryForecast: {
    productId: string;
    productName: string;
    currentStock: number;
    predictedDemand: number;
    suggestedReorder: number;
    stockoutRisk: 'low' | 'medium' | 'high';
    daysUntilStockout: number;
  }[];
  seasonalTrends: {
    month: string;
    index: number;
    category: string;
  }[];
  modelInfo: {
    version: string;
    lastTrained: string;
    accuracy: number;
    dataPoints: number;
  };
}

export const generateMockForecasting = () => {
  // Generate KPIs with trend field matching component expectations
  const kpis = [
    {
      id: 'demand',
      name: '30-Day Demand',
      currentValue: faker.number.int({ min: 5000, max: 15000 }),
      forecastValue: faker.number.int({ min: 5500, max: 16000 }),
      confidence: faker.number.int({ min: 80, max: 95 }),
      unit: 'units',
      trend: faker.helpers.arrayElement(['up', 'down', 'stable']) as 'up' | 'down' | 'stable',
    },
    {
      id: 'revenue',
      name: 'Projected Revenue',
      currentValue: faker.number.int({ min: 100000, max: 300000 }),
      forecastValue: faker.number.int({ min: 110000, max: 350000 }),
      confidence: faker.number.int({ min: 75, max: 90 }),
      unit: '$',
      trend: faker.helpers.arrayElement(['up', 'down', 'stable']) as 'up' | 'down' | 'stable',
    },
    {
      id: 'stockouts',
      name: 'Stockout Risk',
      currentValue: faker.number.int({ min: 2, max: 10 }),
      forecastValue: faker.number.int({ min: 3, max: 12 }),
      confidence: faker.number.int({ min: 70, max: 88 }),
      unit: 'items',
      trend: faker.helpers.arrayElement(['up', 'down', 'stable']) as 'up' | 'down' | 'stable',
    },
  ];

  // Generate demand chart data (next 30 days) - renamed to match component
  const demandChart = Array.from({ length: 30 }, (_, i) => {
    const forecast = faker.number.int({ min: 100, max: 500 });
    const variance = faker.number.int({ min: 20, max: 80 });
    return {
      date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      forecast,
      lowerBound: forecast - variance,
      upperBound: forecast + variance,
      actual: i < 5 ? forecast + faker.number.int({ min: -30, max: 30 }) : null,
    };
  });

  // Generate inventory forecasts with fields matching component expectations
  const inventoryForecasts = Array.from({ length: 15 }, () => {
    const currentStock = faker.number.int({ min: 50, max: 500 });
    const forecastedDemand = faker.number.int({ min: 30, max: 400 });
    const daysUntilStockout = Math.floor(currentStock / (forecastedDemand / 30));
    const reorderPoint = Math.floor(forecastedDemand * 0.3);

    return {
      id: faker.string.uuid(),
      productId: faker.string.uuid(),
      productName: faker.commerce.productName(),
      sku: `SKU-${faker.string.alphanumeric(6).toUpperCase()}`,
      currentStock,
      forecastedDemand,
      reorderPoint,
      stockoutRisk: daysUntilStockout < 7 ? 'high' : daysUntilStockout < 14 ? 'medium' : 'low' as const,
      daysUntilStockout: daysUntilStockout > 60 ? null : daysUntilStockout,
      recommendedOrder: Math.max(0, forecastedDemand - currentStock + reorderPoint),
    };
  }).sort((a, b) => (a.daysUntilStockout ?? 999) - (b.daysUntilStockout ?? 999));

  return {
    kpis,
    demandChart,
    inventoryForecasts,
    modelInfo: {
      version: 'v2.1.0',
      lastTrained: faker.date.recent({ days: 7 }).toISOString(),
      accuracy: faker.number.float({ min: 85, max: 95, fractionDigits: 1 }),
      dataPoints: faker.number.int({ min: 10000, max: 50000 }),
    },
  };
};

// Reports Types - Updated to match component expectations
export interface ReportKPI {
  id: string;
  label: string;
  value: string;
  unit: string;
  change: number;
  icon: string;
}

export interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: string;
  lastGenerated: string | null;
  format: string[];
}

export interface RecentReport {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  generatedBy: string;
  status: 'completed' | 'processing' | 'failed';
  fileSize: string;
  downloadUrl: string;
}

export interface ScheduledReport {
  id: string;
  name: string;
  type: string;
  frequency: string;
  nextRun: string;
  recipients: string[];
  enabled: boolean;
}

export interface ReportChartData {
  production: Array<{ month: string; planned: number; actual: number }>;
  inventory: Array<{ week: string; value: number }>;
  quality: Array<{ name: string; value: number; color: string }>;
}

export interface ReportTopProduct {
  name: string;
  units: number;
  revenue: number;
  growth: number;
}

export interface ReportAlert {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  action?: string;
}

export interface ReportData {
  kpis: ReportKPI[];
  reportTypes: ReportType[];
  recentReports: RecentReport[];
  scheduledReports: ScheduledReport[];
  charts: ReportChartData;
  topProducts: ReportTopProduct[];
  alerts: ReportAlert[];
}

export const generateMockReports = (): ReportData => {
  // Generate KPIs for Reports dashboard
  const kpis: ReportKPI[] = [
    {
      id: 'total-reports',
      label: 'Reports Generated',
      value: faker.number.int({ min: 100, max: 500 }).toString(),
      unit: '',
      change: faker.number.float({ min: 5, max: 25, fractionDigits: 1 }),
      icon: 'FileText',
    },
    {
      id: 'production-efficiency',
      label: 'Production Efficiency',
      value: faker.number.float({ min: 85, max: 98, fractionDigits: 1 }).toString(),
      unit: '%',
      change: faker.number.float({ min: -3, max: 8, fractionDigits: 1 }),
      icon: 'Factory',
    },
    {
      id: 'inventory-turnover',
      label: 'Inventory Turnover',
      value: faker.number.float({ min: 4, max: 12, fractionDigits: 1 }).toString(),
      unit: 'x',
      change: faker.number.float({ min: -5, max: 15, fractionDigits: 1 }),
      icon: 'Package',
    },
    {
      id: 'quality-score',
      label: 'Quality Score',
      value: faker.number.float({ min: 94, max: 99.5, fractionDigits: 1 }).toString(),
      unit: '%',
      change: faker.number.float({ min: -2, max: 5, fractionDigits: 1 }),
      icon: 'CheckCircle',
    },
  ];

  // Generate Report Types
  const reportTypes: ReportType[] = [
    {
      id: 'prod-summary',
      name: 'Production Summary',
      description: 'Daily production output, efficiency metrics, and work order status',
      icon: 'Factory',
      lastGenerated: faker.date.recent({ days: 1 }).toISOString(),
      format: ['PDF', 'Excel'],
    },
    {
      id: 'inv-valuation',
      name: 'Inventory Valuation',
      description: 'Current inventory value by category, warehouse, and aging',
      icon: 'Package',
      lastGenerated: faker.date.recent({ days: 7 }).toISOString(),
      format: ['Excel', 'CSV'],
    },
    {
      id: 'quality-metrics',
      name: 'Quality Metrics',
      description: 'Inspection results, defect rates, and NCR analysis',
      icon: 'CheckCircle',
      lastGenerated: faker.date.recent({ days: 7 }).toISOString(),
      format: ['PDF'],
    },
    {
      id: 'financial-overview',
      name: 'Financial Overview',
      description: 'Revenue, costs, margins, and profitability analysis',
      icon: 'DollarSign',
      lastGenerated: faker.date.recent({ days: 30 }).toISOString(),
      format: ['Excel', 'PDF'],
    },
    {
      id: 'supplier-performance',
      name: 'Supplier Performance',
      description: 'Supplier delivery, quality, and pricing performance',
      icon: 'Users',
      lastGenerated: faker.date.recent({ days: 30 }).toISOString(),
      format: ['PDF'],
    },
    {
      id: 'custom-report',
      name: 'Custom Report Builder',
      description: 'Create custom reports with selected metrics and date ranges',
      icon: 'FileText',
      lastGenerated: null,
      format: ['PDF', 'Excel', 'CSV'],
    },
  ];

  // Generate Recent Reports
  const recentReports: RecentReport[] = Array.from({ length: 10 }, (_, i) => ({
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(reportTypes).name,
    type: faker.helpers.arrayElement(['Production', 'Inventory', 'Quality', 'Financial']),
    generatedAt: new Date(Date.now() - i * faker.number.int({ min: 1, max: 5 }) * 86400000).toISOString(),
    generatedBy: faker.person.fullName(),
    status: faker.helpers.weightedArrayElement([
      { value: 'completed' as const, weight: 8 },
      { value: 'processing' as const, weight: 1 },
      { value: 'failed' as const, weight: 1 },
    ]),
    fileSize: `${faker.number.int({ min: 100, max: 5000 })} KB`,
    downloadUrl: `/api/v1/reports/download/${faker.string.uuid()}`,
  }));

  // Generate Scheduled Reports
  const scheduledReports: ScheduledReport[] = Array.from({ length: 5 }, () => ({
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(reportTypes).name,
    type: faker.helpers.arrayElement(['Production', 'Inventory', 'Quality', 'Financial']),
    frequency: faker.helpers.arrayElement(['daily', 'weekly', 'monthly']),
    nextRun: faker.date.soon({ days: 7 }).toISOString(),
    recipients: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.internet.email()),
    enabled: faker.datatype.boolean({ probability: 0.8 }),
  }));

  // Generate Chart Data
  const charts: ReportChartData = {
    production: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
      month,
      planned: faker.number.int({ min: 800, max: 1500 }),
      actual: faker.number.int({ min: 700, max: 1600 }),
    })),
    inventory: ['W1', 'W2', 'W3', 'W4'].map(week => ({
      week,
      value: faker.number.int({ min: 150000, max: 300000 }),
    })),
    quality: [
      { name: 'Passed', value: faker.number.int({ min: 85, max: 95 }), color: '#22c55e' },
      { name: 'Minor Issues', value: faker.number.int({ min: 3, max: 10 }), color: '#f59e0b' },
      { name: 'Failed', value: faker.number.int({ min: 1, max: 5 }), color: '#ef4444' },
    ],
  };

  // Generate Top Products
  const topProducts: ReportTopProduct[] = Array.from({ length: 5 }, () => ({
    name: faker.commerce.productName(),
    units: faker.number.int({ min: 100, max: 1000 }),
    revenue: faker.number.int({ min: 5000, max: 50000 }),
    growth: faker.number.float({ min: -10, max: 30, fractionDigits: 1 }),
  })).sort((a, b) => b.revenue - a.revenue);

  // Generate Alerts
  const alerts: ReportAlert[] = [
    {
      id: faker.string.uuid(),
      type: 'warning',
      title: 'Low Inventory Alert',
      message: '5 products below reorder point require attention',
      action: 'View Items',
    },
    {
      id: faker.string.uuid(),
      type: 'success',
      title: 'Production Target Achieved',
      message: 'Monthly production target exceeded by 8%',
    },
    {
      id: faker.string.uuid(),
      type: 'info',
      title: 'Report Scheduled',
      message: 'Weekly inventory report will be generated tomorrow at 8:00 AM',
      action: 'Edit Schedule',
    },
  ];

  return {
    kpis,
    reportTypes,
    recentReports,
    scheduledReports,
    charts,
    topProducts,
    alerts,
  };
};

// Certificates list generator
export interface CertificateListItem {
  id: string;
  certificateNumber: string;
  type: 'inspection' | 'calibration' | 'compliance' | 'quality';
  entityType: 'product' | 'batch' | 'equipment';
  entityId: string;
  entityName: string;
  issuedDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'revoked';
  issuedBy: string;
}

export const generateMockCertificates = (count: number = 20): CertificateListItem[] => {
  const types: CertificateListItem['type'][] = ['inspection', 'calibration', 'compliance', 'quality'];
  const entityTypes: CertificateListItem['entityType'][] = ['product', 'batch', 'equipment'];

  return Array.from({ length: count }, () => {
    const issuedDate = faker.date.recent({ days: 90 });
    const expiryDate = new Date(issuedDate.getTime() + 365 * 86400000);
    const isExpired = expiryDate < new Date();

    return {
      id: faker.string.uuid(),
      certificateNumber: `CERT-${faker.string.alphanumeric(8).toUpperCase()}`,
      type: faker.helpers.arrayElement(types),
      entityType: faker.helpers.arrayElement(entityTypes),
      entityId: faker.string.uuid(),
      entityName: faker.commerce.productName(),
      issuedDate: issuedDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      status: isExpired ? 'expired' : faker.helpers.weightedArrayElement([
        { value: 'valid', weight: 8 },
        { value: 'revoked', weight: 2 },
      ]) as 'valid' | 'expired' | 'revoked',
      issuedBy: faker.person.fullName(),
    };
  });
};
