import { faker } from '@faker-js/faker';

// Work Order Types
export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  productId: string;
  productName: string;
  productSku: string;
  bomId: string;
  bomName: string;
  status: 'draft' | 'planned' | 'released' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  plannedQuantity: number;
  completedQuantity: number;
  scrapQuantity: number;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  workCenterId: string;
  workCenterName: string;
  assignedTo: string;
  operations: WorkOrderOperation[];
  materials: WorkOrderMaterial[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderOperation {
  id: string;
  workOrderId: string;
  operationNumber: number;
  name: string;
  workCenterId: string;
  workCenterName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  plannedDuration: number; // minutes
  actualDuration?: number;
  setupTime: number;
  runTime: number;
  sequence: number;
  instructions?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface WorkOrderMaterial {
  id: string;
  workOrderId: string;
  productId: string;
  productName: string;
  sku: string;
  requiredQuantity: number;
  issuedQuantity: number;
  consumedQuantity: number;
  unitOfMeasure: string;
  warehouseId: string;
  warehouseName: string;
  binLocation?: string;
  status: 'pending' | 'partial' | 'issued' | 'consumed';
}

// BOM Types
export interface BillOfMaterials {
  id: string;
  bomNumber: string;
  name: string;
  productId: string;
  productName: string;
  productSku: string;
  version: string;
  status: 'draft' | 'active' | 'obsolete';
  effectiveDate: string;
  expiryDate?: string;
  quantity: number;
  unitOfMeasure: string;
  components: BOMComponent[];
  operations: BOMOperation[];
  totalCost: number;
  laborCost: number;
  materialCost: number;
  overheadCost: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BOMComponent {
  id: string;
  bomId: string;
  lineNumber: number;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitOfMeasure: string;
  unitCost: number;
  totalCost: number;
  scrapPercent: number;
  isPhantom: boolean;
  substituteProductId?: string;
  substituteProductName?: string;
  notes?: string;
}

export interface BOMOperation {
  id: string;
  bomId: string;
  operationNumber: number;
  name: string;
  workCenterId: string;
  workCenterName: string;
  setupTime: number; // minutes
  runTime: number; // minutes per unit
  laborCost: number;
  overheadCost: number;
  instructions?: string;
  sequence: number;
}

// Work Center Types
export interface WorkCenter {
  id: string;
  code: string;
  name: string;
  type: 'machine' | 'assembly' | 'inspection' | 'packaging';
  status: 'active' | 'maintenance' | 'inactive';
  capacity: number;
  utilizationPercent: number;
  efficiency: number;
  costPerHour: number;
  location: string;
  operators: string[];
  currentWorkOrders: number;
  scheduledMaintenance?: string;
}

// Manufacturing Activity
export interface ManufacturingActivity {
  id: string;
  type: 'work_order_created' | 'operation_started' | 'operation_completed' | 'material_issued' | 'quality_check' | 'work_order_completed';
  workOrderId: string;
  workOrderNumber: string;
  description: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Production Schedule
export interface ProductionScheduleItem {
  id: string;
  workOrderId: string;
  workOrderNumber: string;
  productName: string;
  workCenterId: string;
  workCenterName: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// Generators
export const generateMockWorkOrders = (count: number = 20): WorkOrder[] => {
  const statuses: WorkOrder['status'][] = ['draft', 'planned', 'released', 'in_progress', 'completed', 'cancelled', 'on_hold'];
  const priorities: WorkOrder['priority'][] = ['low', 'medium', 'high', 'urgent'];

  return Array.from({ length: count }, (_, i) => {
    const status = faker.helpers.arrayElement(statuses);
    const plannedQuantity = faker.number.int({ min: 10, max: 1000 });
    const completedQuantity = status === 'completed'
      ? plannedQuantity
      : status === 'in_progress'
        ? faker.number.int({ min: 0, max: plannedQuantity - 1 })
        : 0;

    const plannedStart = faker.date.soon({ days: 30 });
    const plannedEnd = new Date(plannedStart.getTime() + faker.number.int({ min: 1, max: 10 }) * 24 * 60 * 60 * 1000);

    return {
      id: faker.string.uuid(),
      workOrderNumber: `WO-${String(i + 1).padStart(5, '0')}`,
      productId: faker.string.uuid(),
      productName: faker.commerce.productName(),
      productSku: `SKU-${faker.string.alphanumeric(6).toUpperCase()}`,
      bomId: faker.string.uuid(),
      bomName: `BOM-${faker.string.alphanumeric(4).toUpperCase()}`,
      status,
      priority: faker.helpers.arrayElement(priorities),
      plannedQuantity,
      completedQuantity,
      scrapQuantity: faker.number.int({ min: 0, max: Math.floor(plannedQuantity * 0.05) }),
      plannedStartDate: plannedStart.toISOString(),
      plannedEndDate: plannedEnd.toISOString(),
      actualStartDate: ['in_progress', 'completed'].includes(status) ? faker.date.recent({ days: 7 }).toISOString() : undefined,
      actualEndDate: status === 'completed' ? faker.date.recent({ days: 3 }).toISOString() : undefined,
      workCenterId: faker.string.uuid(),
      workCenterName: faker.helpers.arrayElement(['Assembly Line A', 'CNC Machine 1', 'Packaging Station', 'Quality Lab']),
      assignedTo: faker.person.fullName(),
      operations: generateMockWorkOrderOperations(faker.string.uuid(), faker.number.int({ min: 3, max: 6 })),
      materials: generateMockWorkOrderMaterials(faker.string.uuid(), faker.number.int({ min: 2, max: 8 })),
      notes: faker.datatype.boolean({ probability: 0.3 }) ? faker.lorem.sentence() : undefined,
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      updatedAt: faker.date.recent({ days: 7 }).toISOString(),
    };
  });
};

export const generateMockWorkOrderOperations = (workOrderId: string, count: number = 4): WorkOrderOperation[] => {
  const operationNames = [
    'Material Preparation',
    'Initial Assembly',
    'Component Integration',
    'Quality Inspection',
    'Final Assembly',
    'Testing',
    'Packaging',
    'Labeling',
  ];

  return Array.from({ length: count }, (_, i) => {
    const status = faker.helpers.arrayElement(['pending', 'in_progress', 'completed', 'skipped'] as const);
    const plannedDuration = faker.number.int({ min: 15, max: 180 });

    return {
      id: faker.string.uuid(),
      workOrderId,
      operationNumber: (i + 1) * 10,
      name: operationNames[i % operationNames.length],
      workCenterId: faker.string.uuid(),
      workCenterName: faker.helpers.arrayElement(['Assembly Line A', 'CNC Machine 1', 'Packaging Station', 'Quality Lab']),
      status,
      plannedDuration,
      actualDuration: status === 'completed' ? faker.number.int({ min: plannedDuration * 0.8, max: plannedDuration * 1.2 }) : undefined,
      setupTime: faker.number.int({ min: 5, max: 30 }),
      runTime: faker.number.int({ min: 10, max: 120 }),
      sequence: i + 1,
      instructions: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
      startedAt: ['in_progress', 'completed'].includes(status) ? faker.date.recent({ days: 3 }).toISOString() : undefined,
      completedAt: status === 'completed' ? faker.date.recent({ days: 1 }).toISOString() : undefined,
    };
  });
};

export const generateMockWorkOrderMaterials = (workOrderId: string, count: number = 5): WorkOrderMaterial[] => {
  return Array.from({ length: count }, () => {
    const requiredQuantity = faker.number.int({ min: 1, max: 100 });
    const issuedQuantity = faker.number.int({ min: 0, max: requiredQuantity });
    const consumedQuantity = faker.number.int({ min: 0, max: issuedQuantity });

    let status: WorkOrderMaterial['status'] = 'pending';
    if (consumedQuantity >= requiredQuantity) status = 'consumed';
    else if (issuedQuantity >= requiredQuantity) status = 'issued';
    else if (issuedQuantity > 0) status = 'partial';

    return {
      id: faker.string.uuid(),
      workOrderId,
      productId: faker.string.uuid(),
      productName: faker.commerce.productMaterial() + ' ' + faker.commerce.productAdjective(),
      sku: `SKU-${faker.string.alphanumeric(6).toUpperCase()}`,
      requiredQuantity,
      issuedQuantity,
      consumedQuantity,
      unitOfMeasure: faker.helpers.arrayElement(['EA', 'KG', 'LB', 'M', 'FT', 'L', 'GAL']),
      warehouseId: faker.string.uuid(),
      warehouseName: faker.helpers.arrayElement(['Main Warehouse', 'Raw Materials', 'Production Storage']),
      binLocation: `${faker.helpers.arrayElement(['A', 'B', 'C'])}-${faker.number.int({ min: 1, max: 10 })}-${faker.number.int({ min: 1, max: 5 })}`,
      status,
    };
  });
};

export const generateMockBOMs = (count: number = 15): BillOfMaterials[] => {
  const statuses: BillOfMaterials['status'][] = ['draft', 'active', 'obsolete'];

  return Array.from({ length: count }, (_, i) => {
    const materialCost = faker.number.float({ min: 50, max: 500, fractionDigits: 2 });
    const laborCost = faker.number.float({ min: 20, max: 200, fractionDigits: 2 });
    const overheadCost = faker.number.float({ min: 10, max: 100, fractionDigits: 2 });

    return {
      id: faker.string.uuid(),
      bomNumber: `BOM-${String(i + 1).padStart(4, '0')}`,
      name: faker.commerce.productName() + ' Assembly',
      productId: faker.string.uuid(),
      productName: faker.commerce.productName(),
      productSku: `SKU-${faker.string.alphanumeric(6).toUpperCase()}`,
      version: `${faker.number.int({ min: 1, max: 5 })}.${faker.number.int({ min: 0, max: 9 })}`,
      status: i < 10 ? 'active' : faker.helpers.arrayElement(statuses),
      effectiveDate: faker.date.past({ years: 1 }).toISOString(),
      expiryDate: faker.datatype.boolean({ probability: 0.2 }) ? faker.date.future({ years: 1 }).toISOString() : undefined,
      quantity: 1,
      unitOfMeasure: 'EA',
      components: generateMockBOMComponents(faker.string.uuid(), faker.number.int({ min: 3, max: 10 })),
      operations: generateMockBOMOperations(faker.string.uuid(), faker.number.int({ min: 2, max: 5 })),
      totalCost: materialCost + laborCost + overheadCost,
      laborCost,
      materialCost,
      overheadCost,
      notes: faker.datatype.boolean({ probability: 0.3 }) ? faker.lorem.sentence() : undefined,
      createdBy: faker.person.fullName(),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    };
  });
};

export const generateMockBOMComponents = (bomId: string, count: number = 5): BOMComponent[] => {
  return Array.from({ length: count }, (_, i) => {
    const quantity = faker.number.float({ min: 0.1, max: 10, fractionDigits: 2 });
    const unitCost = faker.number.float({ min: 1, max: 100, fractionDigits: 2 });

    return {
      id: faker.string.uuid(),
      bomId,
      lineNumber: (i + 1) * 10,
      productId: faker.string.uuid(),
      productName: faker.commerce.productMaterial() + ' ' + faker.commerce.productAdjective(),
      sku: `SKU-${faker.string.alphanumeric(6).toUpperCase()}`,
      quantity,
      unitOfMeasure: faker.helpers.arrayElement(['EA', 'KG', 'LB', 'M', 'FT', 'L', 'GAL']),
      unitCost,
      totalCost: quantity * unitCost,
      scrapPercent: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
      isPhantom: faker.datatype.boolean({ probability: 0.1 }),
      substituteProductId: faker.datatype.boolean({ probability: 0.2 }) ? faker.string.uuid() : undefined,
      substituteProductName: faker.datatype.boolean({ probability: 0.2 }) ? faker.commerce.productName() : undefined,
      notes: faker.datatype.boolean({ probability: 0.2 }) ? faker.lorem.sentence() : undefined,
    };
  });
};

export const generateMockBOMOperations = (bomId: string, count: number = 3): BOMOperation[] => {
  const operationNames = [
    'Cut to Size',
    'Drilling',
    'Assembly',
    'Welding',
    'Painting',
    'Quality Check',
    'Packaging',
  ];

  return Array.from({ length: count }, (_, i) => {
    const setupTime = faker.number.int({ min: 5, max: 30 });
    const runTime = faker.number.int({ min: 1, max: 15 });
    const laborCost = (setupTime + runTime) * faker.number.float({ min: 0.5, max: 2, fractionDigits: 2 });

    return {
      id: faker.string.uuid(),
      bomId,
      operationNumber: (i + 1) * 10,
      name: operationNames[i % operationNames.length],
      workCenterId: faker.string.uuid(),
      workCenterName: faker.helpers.arrayElement(['Assembly Line A', 'CNC Machine 1', 'Welding Station', 'Paint Booth', 'QC Lab']),
      setupTime,
      runTime,
      laborCost,
      overheadCost: laborCost * 0.3,
      instructions: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
      sequence: i + 1,
    };
  });
};

export const generateMockWorkCenters = (count: number = 8): WorkCenter[] => {
  const types: WorkCenter['type'][] = ['machine', 'assembly', 'inspection', 'packaging'];
  const names = [
    'CNC Machine 1',
    'CNC Machine 2',
    'Assembly Line A',
    'Assembly Line B',
    'Quality Lab',
    'Packaging Station 1',
    'Welding Bay',
    'Paint Booth',
  ];

  return Array.from({ length: count }, (_, i) => {
    const capacity = faker.number.int({ min: 8, max: 24 }); // hours per day
    const utilizationPercent = faker.number.int({ min: 40, max: 95 });

    return {
      id: faker.string.uuid(),
      code: `WC-${String(i + 1).padStart(3, '0')}`,
      name: names[i] || faker.company.name() + ' Station',
      type: types[i % types.length],
      status: faker.helpers.weightedArrayElement([
        { value: 'active' as const, weight: 0.8 },
        { value: 'maintenance' as const, weight: 0.15 },
        { value: 'inactive' as const, weight: 0.05 },
      ]),
      capacity,
      utilizationPercent,
      efficiency: faker.number.int({ min: 75, max: 100 }),
      costPerHour: faker.number.float({ min: 25, max: 150, fractionDigits: 2 }),
      location: faker.helpers.arrayElement(['Building A', 'Building B', 'Production Hall', 'Warehouse Area']),
      operators: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.person.fullName()),
      currentWorkOrders: faker.number.int({ min: 0, max: 5 }),
      scheduledMaintenance: faker.datatype.boolean({ probability: 0.3 })
        ? faker.date.soon({ days: 30 }).toISOString()
        : undefined,
    };
  });
};

export const generateMockManufacturingActivity = (count: number = 30): ManufacturingActivity[] => {
  const types: ManufacturingActivity['type'][] = [
    'work_order_created',
    'operation_started',
    'operation_completed',
    'material_issued',
    'quality_check',
    'work_order_completed',
  ];

  const descriptions = {
    work_order_created: ['New work order created', 'Work order generated from sales order', 'Rush order created'],
    operation_started: ['Operation started', 'Assembly begun', 'Processing started'],
    operation_completed: ['Operation completed successfully', 'Assembly finished', 'Process complete'],
    material_issued: ['Materials issued to production', 'Components released', 'Raw materials allocated'],
    quality_check: ['Quality inspection passed', 'QC check completed', 'Inspection recorded'],
    work_order_completed: ['Work order completed', 'Production finished', 'Order fulfilled'],
  };

  return Array.from({ length: count }, (_, i) => {
    const type = faker.helpers.arrayElement(types);

    return {
      id: faker.string.uuid(),
      type,
      workOrderId: faker.string.uuid(),
      workOrderNumber: `WO-${String(faker.number.int({ min: 1, max: 1000 })).padStart(5, '0')}`,
      description: faker.helpers.arrayElement(descriptions[type]),
      user: faker.person.fullName(),
      timestamp: new Date(Date.now() - i * faker.number.int({ min: 15, max: 60 }) * 60000).toISOString(),
      metadata: {
        quantity: faker.number.int({ min: 1, max: 100 }),
        reference: `REF-${faker.string.alphanumeric(8).toUpperCase()}`,
      },
    };
  });
};

export const generateMockProductionSchedule = (count: number = 20): ProductionScheduleItem[] => {
  const priorities: ProductionScheduleItem['priority'][] = ['low', 'medium', 'high', 'urgent'];

  return Array.from({ length: count }, () => {
    const startTime = faker.date.soon({ days: 7 });
    const duration = faker.number.int({ min: 1, max: 8 }) * 60 * 60 * 1000; // 1-8 hours
    const endTime = new Date(startTime.getTime() + duration);

    return {
      id: faker.string.uuid(),
      workOrderId: faker.string.uuid(),
      workOrderNumber: `WO-${String(faker.number.int({ min: 1, max: 1000 })).padStart(5, '0')}`,
      productName: faker.commerce.productName(),
      workCenterId: faker.string.uuid(),
      workCenterName: faker.helpers.arrayElement(['Assembly Line A', 'CNC Machine 1', 'Packaging Station', 'Quality Lab']),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: faker.helpers.arrayElement(['scheduled', 'in_progress', 'completed', 'delayed'] as const),
      priority: faker.helpers.arrayElement(priorities),
    };
  });
};

// Production Metrics
export interface ProductionMetrics {
  totalWorkOrders: number;
  completedWorkOrders: number;
  inProgressWorkOrders: number;
  overdueWorkOrders: number;
  efficiency: number;
  qualityRate: number;
  onTimeDelivery: number;
  avgCycleTime: number;
  utilizationRate: number;
}

export const generateMockProductionMetrics = (): ProductionMetrics => {
  return {
    totalWorkOrders: faker.number.int({ min: 50, max: 200 }),
    completedWorkOrders: faker.number.int({ min: 30, max: 150 }),
    inProgressWorkOrders: faker.number.int({ min: 5, max: 30 }),
    overdueWorkOrders: faker.number.int({ min: 0, max: 10 }),
    efficiency: faker.number.float({ min: 75, max: 98, fractionDigits: 1 }),
    qualityRate: faker.number.float({ min: 90, max: 99.5, fractionDigits: 1 }),
    onTimeDelivery: faker.number.float({ min: 80, max: 98, fractionDigits: 1 }),
    avgCycleTime: faker.number.float({ min: 2, max: 8, fractionDigits: 1 }), // hours
    utilizationRate: faker.number.float({ min: 60, max: 95, fractionDigits: 1 }),
  };
};

// BOM Comparison
export interface BOMComparison {
  bomId1: string;
  bomId2: string;
  bomName1: string;
  bomName2: string;
  differences: BOMDifference[];
  costDifference: number;
  componentCountDiff: number;
}

export interface BOMDifference {
  type: 'added' | 'removed' | 'modified';
  componentName: string;
  oldValue?: string;
  newValue?: string;
  field?: string;
}

export const generateMockBOMComparison = (): BOMComparison => {
  const differences: BOMDifference[] = [
    { type: 'added', componentName: faker.commerce.productName(), newValue: faker.number.int({ min: 1, max: 10 }).toString() },
    { type: 'removed', componentName: faker.commerce.productName(), oldValue: faker.number.int({ min: 1, max: 10 }).toString() },
    { type: 'modified', componentName: faker.commerce.productName(), field: 'quantity', oldValue: '5', newValue: '8' },
    { type: 'modified', componentName: faker.commerce.productName(), field: 'unitCost', oldValue: '$10.00', newValue: '$12.50' },
  ];

  return {
    bomId1: faker.string.uuid(),
    bomId2: faker.string.uuid(),
    bomName1: 'Version 1.0',
    bomName2: 'Version 2.0',
    differences,
    costDifference: faker.number.float({ min: -50, max: 100, fractionDigits: 2 }),
    componentCountDiff: faker.number.int({ min: -3, max: 5 }),
  };
};
