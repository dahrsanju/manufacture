import { faker } from '@faker-js/faker';

// Warehouse Types
export interface Warehouse {
  id: string;
  code: string;
  name: string;
  type: 'MAIN' | 'BRANCH' | 'TRANSIT' | 'QUARANTINE';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  capacity: number;
  usedSpace: number;
  availableSpace: number;
  utilizationPercent: number;
  zones: Zone[];
  isActive: boolean;
  manager: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
}

export interface Zone {
  id: string;
  warehouseId: string;
  code: string;
  name: string;
  type: 'RECEIVING' | 'STORAGE' | 'PICKING' | 'SHIPPING' | 'QUARANTINE';
  capacity: number;
  usedSpace: number;
  bins: Bin[];
  temperature?: { min: number; max: number };
  humidity?: { min: number; max: number };
}

export interface Bin {
  id: string;
  zoneId: string;
  code: string;
  aisle: string;
  rack: string;
  level: string;
  position: string;
  capacity: number;
  usedSpace: number;
  productId?: string;
  productName?: string;
  quantity?: number;
  lastActivity?: string;
}

export interface StockTransfer {
  id: string;
  sourceWarehouseId: string;
  sourceWarehouseName: string;
  targetWarehouseId: string;
  targetWarehouseName: string;
  status: 'draft' | 'pending' | 'in_transit' | 'completed' | 'cancelled';
  items: TransferItem[];
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface TransferItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  sourceBinId?: string;
  targetBinId?: string;
}

export interface WarehouseActivity {
  id: string;
  warehouseId: string;
  type: 'receipt' | 'shipment' | 'transfer' | 'adjustment' | 'count';
  description: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Generators
export const generateMockWarehouses = (count: number = 5): Warehouse[] => {
  const types: Warehouse['type'][] = ['MAIN', 'BRANCH', 'TRANSIT', 'QUARANTINE'];
  const names = ['Main Distribution Center', 'East Coast Warehouse', 'West Coast Hub', 'Central Storage', 'North Facility', 'South Branch'];

  return Array.from({ length: count }, (_, i) => {
    const capacity = faker.number.int({ min: 5000, max: 50000 });
    const usedSpace = faker.number.int({ min: 1000, max: capacity - 500 });

    return {
      id: faker.string.uuid(),
      code: `WH-${String(i + 1).padStart(3, '0')}`,
      name: names[i] || faker.company.name() + ' Warehouse',
      type: i === 0 ? 'MAIN' : types[faker.number.int({ min: 0, max: 3 })],
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode(),
        country: 'USA',
      },
      capacity,
      usedSpace,
      availableSpace: capacity - usedSpace,
      utilizationPercent: Math.round((usedSpace / capacity) * 100),
      zones: generateMockZones(faker.string.uuid(), faker.number.int({ min: 3, max: 6 })),
      isActive: faker.datatype.boolean({ probability: 0.9 }),
      manager: faker.person.fullName(),
      contact: faker.phone.number(),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    };
  });
};

export const generateMockZones = (warehouseId: string, count: number = 4): Zone[] => {
  const zoneTypes: Zone['type'][] = ['RECEIVING', 'STORAGE', 'PICKING', 'SHIPPING', 'QUARANTINE'];
  const zoneNames = {
    RECEIVING: 'Receiving Dock',
    STORAGE: 'Main Storage',
    PICKING: 'Picking Area',
    SHIPPING: 'Shipping Dock',
    QUARANTINE: 'Quarantine Zone',
  };

  return Array.from({ length: count }, (_, i) => {
    const type = zoneTypes[i % zoneTypes.length];
    const capacity = faker.number.int({ min: 500, max: 5000 });
    const usedSpace = faker.number.int({ min: 100, max: capacity - 100 });

    return {
      id: faker.string.uuid(),
      warehouseId,
      code: `Z-${String.fromCharCode(65 + i)}`,
      name: zoneNames[type] + (i > 4 ? ` ${i - 4}` : ''),
      type,
      capacity,
      usedSpace,
      bins: generateMockBins(faker.string.uuid(), faker.number.int({ min: 5, max: 15 })),
      temperature: type === 'STORAGE' ? { min: 15, max: 25 } : undefined,
      humidity: type === 'STORAGE' ? { min: 40, max: 60 } : undefined,
    };
  });
};

export const generateMockBins = (zoneId: string, count: number = 10): Bin[] => {
  const aisles = ['A', 'B', 'C', 'D'];
  const racks = ['01', '02', '03', '04', '05'];
  const levels = ['1', '2', '3', '4'];

  return Array.from({ length: count }, (_, i) => {
    const capacity = faker.number.int({ min: 50, max: 200 });
    const usedSpace = faker.number.int({ min: 0, max: capacity });
    const hasProduct = usedSpace > 0;

    return {
      id: faker.string.uuid(),
      zoneId,
      code: `${aisles[i % 4]}-${racks[i % 5]}-${levels[i % 4]}`,
      aisle: aisles[i % 4],
      rack: racks[i % 5],
      level: levels[i % 4],
      position: `${i + 1}`,
      capacity,
      usedSpace,
      productId: hasProduct ? faker.string.uuid() : undefined,
      productName: hasProduct ? faker.commerce.productName() : undefined,
      quantity: hasProduct ? faker.number.int({ min: 1, max: 100 }) : undefined,
      lastActivity: hasProduct ? faker.date.recent({ days: 7 }).toISOString() : undefined,
    };
  });
};

export const generateMockTransfers = (count: number = 10): StockTransfer[] => {
  const statuses: StockTransfer['status'][] = ['draft', 'pending', 'in_transit', 'completed', 'cancelled'];

  return Array.from({ length: count }, () => {
    const status = faker.helpers.arrayElement(statuses);

    return {
      id: faker.string.uuid(),
      sourceWarehouseId: faker.string.uuid(),
      sourceWarehouseName: faker.company.name() + ' Warehouse',
      targetWarehouseId: faker.string.uuid(),
      targetWarehouseName: faker.company.name() + ' Warehouse',
      status,
      items: generateMockTransferItems(faker.number.int({ min: 1, max: 5 })),
      createdBy: faker.person.fullName(),
      createdAt: faker.date.recent({ days: 14 }).toISOString(),
      completedAt: status === 'completed' ? faker.date.recent({ days: 7 }).toISOString() : undefined,
      notes: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
    };
  });
};

export const generateMockTransferItems = (count: number = 3): TransferItem[] => {
  return Array.from({ length: count }, () => ({
    productId: faker.string.uuid(),
    productName: faker.commerce.productName(),
    sku: `SKU-${faker.string.alphanumeric(6).toUpperCase()}`,
    quantity: faker.number.int({ min: 1, max: 100 }),
    sourceBinId: faker.string.uuid(),
    targetBinId: faker.string.uuid(),
  }));
};

export const generateMockWarehouseActivity = (
  warehouseId: string,
  count: number = 20
): WarehouseActivity[] => {
  const activityTypes: WarehouseActivity['type'][] = [
    'receipt',
    'shipment',
    'transfer',
    'adjustment',
    'count',
  ];

  const descriptions = {
    receipt: ['Received shipment from supplier', 'Incoming PO received', 'Return processed'],
    shipment: ['Order shipped to customer', 'Transfer shipped', 'Sample sent'],
    transfer: ['Internal transfer completed', 'Zone transfer', 'Bin consolidation'],
    adjustment: ['Inventory adjustment', 'Damaged goods written off', 'Quantity correction'],
    count: ['Cycle count completed', 'Annual inventory count', 'Spot check performed'],
  };

  return Array.from({ length: count }, (_, i) => {
    const type = faker.helpers.arrayElement(activityTypes);

    return {
      id: faker.string.uuid(),
      warehouseId,
      type,
      description: faker.helpers.arrayElement(descriptions[type]),
      user: faker.person.fullName(),
      timestamp: new Date(Date.now() - i * faker.number.int({ min: 30, max: 120 }) * 60000).toISOString(),
      metadata: {
        quantity: faker.number.int({ min: 1, max: 500 }),
        reference: `REF-${faker.string.alphanumeric(8).toUpperCase()}`,
      },
    };
  });
};

// Product Categories
export interface ProductCategory {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  children?: ProductCategory[];
  productCount: number;
  isActive: boolean;
}

export const generateMockCategories = (): ProductCategory[] => {
  return [
    {
      id: 'cat-1',
      name: 'Electronics',
      code: 'ELEC',
      productCount: faker.number.int({ min: 50, max: 200 }),
      isActive: true,
      children: [
        {
          id: 'cat-1-1',
          name: 'Components',
          code: 'ELEC-COMP',
          parentId: 'cat-1',
          productCount: faker.number.int({ min: 20, max: 80 }),
          isActive: true,
          children: [
            { id: 'cat-1-1-1', name: 'Resistors', code: 'ELEC-COMP-RES', parentId: 'cat-1-1', productCount: faker.number.int({ min: 10, max: 30 }), isActive: true },
            { id: 'cat-1-1-2', name: 'Capacitors', code: 'ELEC-COMP-CAP', parentId: 'cat-1-1', productCount: faker.number.int({ min: 10, max: 30 }), isActive: true },
            { id: 'cat-1-1-3', name: 'Semiconductors', code: 'ELEC-COMP-SEM', parentId: 'cat-1-1', productCount: faker.number.int({ min: 10, max: 30 }), isActive: true },
          ],
        },
        {
          id: 'cat-1-2',
          name: 'Assemblies',
          code: 'ELEC-ASSY',
          parentId: 'cat-1',
          productCount: faker.number.int({ min: 15, max: 50 }),
          isActive: true,
        },
      ],
    },
    {
      id: 'cat-2',
      name: 'Raw Materials',
      code: 'RAW',
      productCount: faker.number.int({ min: 30, max: 100 }),
      isActive: true,
      children: [
        { id: 'cat-2-1', name: 'Metals', code: 'RAW-MET', parentId: 'cat-2', productCount: faker.number.int({ min: 10, max: 40 }), isActive: true },
        { id: 'cat-2-2', name: 'Plastics', code: 'RAW-PLA', parentId: 'cat-2', productCount: faker.number.int({ min: 10, max: 30 }), isActive: true },
        { id: 'cat-2-3', name: 'Chemicals', code: 'RAW-CHE', parentId: 'cat-2', productCount: faker.number.int({ min: 5, max: 20 }), isActive: true },
      ],
    },
    {
      id: 'cat-3',
      name: 'Finished Goods',
      code: 'FIN',
      productCount: faker.number.int({ min: 40, max: 150 }),
      isActive: true,
      children: [
        { id: 'cat-3-1', name: 'Consumer Products', code: 'FIN-CON', parentId: 'cat-3', productCount: faker.number.int({ min: 20, max: 60 }), isActive: true },
        { id: 'cat-3-2', name: 'Industrial Products', code: 'FIN-IND', parentId: 'cat-3', productCount: faker.number.int({ min: 15, max: 50 }), isActive: true },
      ],
    },
    {
      id: 'cat-4',
      name: 'Packaging',
      code: 'PKG',
      productCount: faker.number.int({ min: 10, max: 50 }),
      isActive: true,
    },
    {
      id: 'cat-5',
      name: 'Tools & Equipment',
      code: 'TOOL',
      productCount: faker.number.int({ min: 20, max: 80 }),
      isActive: true,
    },
  ];
};

// Product Movement History
export interface ProductMovement {
  id: string;
  productId: string;
  type: 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'return';
  quantity: number;
  direction: 'in' | 'out';
  warehouseId: string;
  warehouseName: string;
  reference: string;
  user: string;
  timestamp: string;
  notes?: string;
}

export const generateMockProductMovements = (
  productId: string,
  count: number = 20
): ProductMovement[] => {
  const types: ProductMovement['type'][] = ['receipt', 'issue', 'transfer', 'adjustment', 'return'];
  const typeDirections: Record<ProductMovement['type'], 'in' | 'out'> = {
    receipt: 'in',
    issue: 'out',
    transfer: faker.helpers.arrayElement(['in', 'out']),
    adjustment: faker.helpers.arrayElement(['in', 'out']),
    return: 'in',
  };

  return Array.from({ length: count }, (_, i) => {
    const type = faker.helpers.arrayElement(types);
    return {
      id: faker.string.uuid(),
      productId,
      type,
      quantity: faker.number.int({ min: 1, max: 100 }),
      direction: typeDirections[type],
      warehouseId: faker.string.uuid(),
      warehouseName: faker.company.name() + ' Warehouse',
      reference: `REF-${faker.string.alphanumeric(8).toUpperCase()}`,
      user: faker.person.fullName(),
      timestamp: new Date(Date.now() - i * faker.number.int({ min: 60, max: 240 }) * 60000).toISOString(),
      notes: faker.datatype.boolean({ probability: 0.3 }) ? faker.lorem.sentence() : undefined,
    };
  });
};

// Warehouse Capacity
export interface WarehouseCapacity {
  warehouseId: string;
  warehouseName: string;
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
  utilizationPercent: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  alerts: {
    type: 'warning' | 'critical';
    message: string;
  }[];
  zoneBreakdown: {
    zoneId: string;
    zoneName: string;
    capacity: number;
    used: number;
    percent: number;
  }[];
}

export const generateMockWarehouseCapacity = (): WarehouseCapacity[] => {
  const warehouses = generateMockWarehouses(5);

  return warehouses.map(wh => {
    const alerts: WarehouseCapacity['alerts'] = [];
    if (wh.utilizationPercent > 90) {
      alerts.push({ type: 'critical', message: 'Capacity critical - over 90% utilized' });
    } else if (wh.utilizationPercent > 75) {
      alerts.push({ type: 'warning', message: 'Capacity warning - over 75% utilized' });
    }

    return {
      warehouseId: wh.id,
      warehouseName: wh.name,
      totalCapacity: wh.capacity,
      usedCapacity: wh.usedSpace,
      availableCapacity: wh.availableSpace,
      utilizationPercent: wh.utilizationPercent,
      trend: faker.helpers.arrayElement(['increasing', 'decreasing', 'stable']),
      alerts,
      zoneBreakdown: wh.zones.map(zone => ({
        zoneId: zone.id,
        zoneName: zone.name,
        capacity: zone.capacity,
        used: zone.usedSpace,
        percent: Math.round((zone.usedSpace / zone.capacity) * 100),
      })),
    };
  });
};

// Warehouse Comparison
export interface WarehouseComparison {
  warehouses: {
    id: string;
    name: string;
    code: string;
  }[];
  metrics: {
    name: string;
    unit: string;
    values: Record<string, number>;
  }[];
  charts: {
    throughput: { date: string; [warehouseId: string]: number | string }[];
    efficiency: { date: string; [warehouseId: string]: number | string }[];
  };
}

export const generateMockWarehouseComparison = (): WarehouseComparison => {
  const warehouses = generateMockWarehouses(3).map(wh => ({
    id: wh.id,
    name: wh.name,
    code: wh.code,
  }));

  const metrics = [
    {
      name: 'Utilization',
      unit: '%',
      values: warehouses.reduce((acc, wh) => {
        acc[wh.id] = faker.number.int({ min: 60, max: 95 });
        return acc;
      }, {} as Record<string, number>),
    },
    {
      name: 'Throughput',
      unit: 'units/day',
      values: warehouses.reduce((acc, wh) => {
        acc[wh.id] = faker.number.int({ min: 500, max: 2000 });
        return acc;
      }, {} as Record<string, number>),
    },
    {
      name: 'Accuracy',
      unit: '%',
      values: warehouses.reduce((acc, wh) => {
        acc[wh.id] = faker.number.float({ min: 95, max: 99.9, fractionDigits: 1 });
        return acc;
      }, {} as Record<string, number>),
    },
    {
      name: 'Avg Pick Time',
      unit: 'mins',
      values: warehouses.reduce((acc, wh) => {
        acc[wh.id] = faker.number.float({ min: 2, max: 8, fractionDigits: 1 });
        return acc;
      }, {} as Record<string, number>),
    },
    {
      name: 'Cost per Unit',
      unit: '$',
      values: warehouses.reduce((acc, wh) => {
        acc[wh.id] = faker.number.float({ min: 0.5, max: 3, fractionDigits: 2 });
        return acc;
      }, {} as Record<string, number>),
    },
  ];

  // Generate time series data for charts
  const generateTimeSeries = (): Array<{ [warehouseId: string]: string | number; date: string }> => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0];
      const data: { [warehouseId: string]: string | number; date: string } = { date };
      warehouses.forEach(wh => {
        data[wh.id] = faker.number.int({ min: 100, max: 500 });
      });
      return data;
    });
  };

  return {
    warehouses,
    metrics,
    charts: {
      throughput: generateTimeSeries(),
      efficiency: generateTimeSeries(),
    },
  };
};

// Stock Movements (for /inventory/movements page)
export interface StockMovement {
  id: string;
  movementNumber: string;
  type: 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'return';
  status: 'pending' | 'completed' | 'cancelled';
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  direction: 'in' | 'out';
  fromWarehouse?: string;
  toWarehouse?: string;
  reference: string;
  reason?: string;
  user: string;
  timestamp: string;
  notes?: string;
}

export const generateMockStockMovements = (count: number = 50): StockMovement[] => {
  const types: StockMovement['type'][] = ['receipt', 'issue', 'transfer', 'adjustment', 'return'];
  const statuses: StockMovement['status'][] = ['pending', 'completed', 'cancelled'];
  const warehouseNames = ['Main Distribution Center', 'East Coast Warehouse', 'West Coast Hub', 'Central Storage'];

  return Array.from({ length: count }, (_, i) => {
    const type = faker.helpers.arrayElement(types);
    const isTransfer = type === 'transfer';

    return {
      id: faker.string.uuid(),
      movementNumber: `MOV-${String(1000 + i).padStart(5, '0')}`,
      type,
      status: faker.helpers.arrayElement(statuses),
      productId: faker.string.uuid(),
      productName: faker.commerce.productName(),
      sku: `SKU-${faker.string.alphanumeric(6).toUpperCase()}`,
      quantity: faker.number.int({ min: 1, max: 500 }),
      direction: ['receipt', 'return'].includes(type) ? 'in' : ['issue'].includes(type) ? 'out' : faker.helpers.arrayElement(['in', 'out']),
      fromWarehouse: isTransfer || type === 'issue' ? faker.helpers.arrayElement(warehouseNames) : undefined,
      toWarehouse: isTransfer || type === 'receipt' ? faker.helpers.arrayElement(warehouseNames) : undefined,
      reference: `REF-${faker.string.alphanumeric(8).toUpperCase()}`,
      reason: type === 'adjustment' ? faker.helpers.arrayElement(['Cycle count correction', 'Damaged goods', 'Quality hold', 'System reconciliation']) : undefined,
      user: faker.person.fullName(),
      timestamp: new Date(Date.now() - i * faker.number.int({ min: 30, max: 180 }) * 60000).toISOString(),
      notes: faker.datatype.boolean({ probability: 0.2 }) ? faker.lorem.sentence() : undefined,
    };
  });
};
