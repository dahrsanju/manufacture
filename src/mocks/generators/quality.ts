import { faker } from '@faker-js/faker';

// Quality Inspection Types
export interface QualityInspection {
  id: string;
  inspectionNumber: string;
  type: 'incoming' | 'in_process' | 'final' | 'audit';
  status: 'scheduled' | 'in_progress' | 'passed' | 'failed' | 'on_hold';
  productId: string;
  productName: string;
  productSku: string;
  workOrderId?: string;
  workOrderNumber?: string;
  batchNumber?: string;
  lotNumber?: string;
  sampleSize: number;
  inspectedQuantity: number;
  passedQuantity: number;
  failedQuantity: number;
  defectRate: number;
  inspector: string;
  checklist: InspectionChecklist;
  scheduledDate: string;
  completedDate?: string;
  notes?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InspectionChecklist {
  id: string;
  name: string;
  sections: ChecklistSection[];
  totalItems: number;
  completedItems: number;
  passedItems: number;
  failedItems: number;
}

export interface ChecklistSection {
  id: string;
  name: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  name: string;
  description?: string;
  type: 'boolean' | 'measurement' | 'visual' | 'document';
  required: boolean;
  status: 'pending' | 'pass' | 'fail' | 'na';
  value?: string | number | boolean;
  specification?: {
    min?: number;
    max?: number;
    target?: number;
    unit?: string;
  };
  notes?: string;
  imageUrl?: string;
}

// Defect Types
export interface Defect {
  id: string;
  defectNumber: string;
  inspectionId: string;
  productId: string;
  productName: string;
  type: 'dimensional' | 'visual' | 'functional' | 'material' | 'documentation';
  severity: 'minor' | 'major' | 'critical';
  category: string;
  description: string;
  cause?: string;
  correctiveAction?: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  quantity: number;
  reportedBy: string;
  assignedTo?: string;
  images: string[];
  createdAt: string;
  resolvedAt?: string;
}

// Non-Conformance Report Types
export interface NonConformanceReport {
  id: string;
  ncrNumber: string;
  type: 'product' | 'process' | 'supplier' | 'customer';
  status: 'open' | 'investigating' | 'containment' | 'corrective_action' | 'verification' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  productId?: string;
  productName?: string;
  supplierId?: string;
  supplierName?: string;
  description: string;
  rootCause?: string;
  containmentAction?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  verificationResult?: string;
  costImpact?: number;
  assignedTo: string;
  team: string[];
  dueDate: string;
  activities: NCRActivity[];
  attachments: string[];
  createdBy: string;
  createdAt: string;
  closedAt?: string;
}

export interface NCRActivity {
  id: string;
  ncrId: string;
  type: 'created' | 'status_change' | 'comment' | 'assignment' | 'attachment' | 'action_added';
  description: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Quality Metrics Types
export interface QualityMetrics {
  defectRate: number;
  firstPassYield: number;
  inspectionCompliance: number;
  openNCRs: number;
  avgResolutionTime: number;
  topDefectTypes: Array<{ type: string; count: number }>;
  trendData: Array<{ date: string; defectRate: number; yield: number }>;
  severityDistribution: Array<{ severity: string; count: number }>;
  categoryBreakdown: Array<{ category: string; count: number }>;
}

// Quality Certificate Types
export interface QualityCertificate {
  id: string;
  certificateNumber: string;
  type: 'coc' | 'coa' | 'test_report' | 'material_cert';
  productId: string;
  productName: string;
  batchNumber: string;
  lotNumber?: string;
  inspectionId: string;
  issuedDate: string;
  expiryDate?: string;
  issuedBy: string;
  approvedBy: string;
  specifications: Array<{
    parameter: string;
    specification: string;
    result: string;
    status: 'pass' | 'fail';
  }>;
  notes?: string;
  signatureUrl?: string;
}

// Inspection History Event
export interface InspectionEvent {
  id: string;
  inspectionId: string;
  type: 'scheduled' | 'started' | 'sampled' | 'inspected' | 'completed' | 'approved' | 'rejected';
  description: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Generators
export const generateMockInspections = (count: number = 20): QualityInspection[] => {
  const types: QualityInspection['type'][] = ['incoming', 'in_process', 'final', 'audit'];
  const statuses: QualityInspection['status'][] = ['scheduled', 'in_progress', 'passed', 'failed', 'on_hold'];

  return Array.from({ length: count }, (_, i) => {
    const status = faker.helpers.arrayElement(statuses);
    const sampleSize = faker.number.int({ min: 5, max: 100 });
    const inspectedQuantity = status === 'scheduled' ? 0 : faker.number.int({ min: 1, max: sampleSize });
    const failedQuantity = faker.number.int({ min: 0, max: Math.floor(inspectedQuantity * 0.15) });
    const passedQuantity = inspectedQuantity - failedQuantity;

    return {
      id: faker.string.uuid(),
      inspectionNumber: `INS-${String(i + 1).padStart(5, '0')}`,
      type: faker.helpers.arrayElement(types),
      status,
      productId: faker.string.uuid(),
      productName: faker.commerce.productName(),
      productSku: `SKU-${faker.string.alphanumeric(6).toUpperCase()}`,
      workOrderId: faker.datatype.boolean() ? faker.string.uuid() : undefined,
      workOrderNumber: faker.datatype.boolean() ? `WO-${faker.string.numeric(5)}` : undefined,
      batchNumber: `BATCH-${faker.string.alphanumeric(6).toUpperCase()}`,
      lotNumber: faker.datatype.boolean() ? `LOT-${faker.string.alphanumeric(4).toUpperCase()}` : undefined,
      sampleSize,
      inspectedQuantity,
      passedQuantity,
      failedQuantity,
      defectRate: inspectedQuantity > 0 ? Math.round((failedQuantity / inspectedQuantity) * 100 * 10) / 10 : 0,
      inspector: faker.person.fullName(),
      checklist: generateMockChecklist(),
      scheduledDate: faker.date.soon({ days: 14 }).toISOString(),
      completedDate: ['passed', 'failed'].includes(status) ? faker.date.recent({ days: 7 }).toISOString() : undefined,
      notes: faker.datatype.boolean({ probability: 0.3 }) ? faker.lorem.sentence() : undefined,
      attachments: faker.datatype.boolean({ probability: 0.4 })
        ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.image.url())
        : [],
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      updatedAt: faker.date.recent({ days: 7 }).toISOString(),
    };
  });
};

export const generateMockChecklist = (): InspectionChecklist => {
  const sections = generateMockChecklistSections(faker.number.int({ min: 2, max: 4 }));
  const allItems = sections.flatMap((s) => s.items);

  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(['Standard QC Checklist', 'Incoming Inspection', 'Final QC', 'Visual Inspection']),
    sections,
    totalItems: allItems.length,
    completedItems: allItems.filter((i) => i.status !== 'pending').length,
    passedItems: allItems.filter((i) => i.status === 'pass').length,
    failedItems: allItems.filter((i) => i.status === 'fail').length,
  };
};

export const generateMockChecklistSections = (count: number = 3): ChecklistSection[] => {
  const sectionNames = ['Visual Inspection', 'Dimensional Check', 'Functional Test', 'Documentation Review', 'Material Verification'];

  return Array.from({ length: count }, (_, i) => ({
    id: faker.string.uuid(),
    name: sectionNames[i % sectionNames.length],
    items: generateMockChecklistItems(faker.number.int({ min: 3, max: 6 })),
  }));
};

export const generateMockChecklistItems = (count: number = 4): ChecklistItem[] => {
  const itemNames = [
    'Surface finish quality',
    'Color consistency',
    'Label accuracy',
    'Dimension A tolerance',
    'Dimension B tolerance',
    'Weight verification',
    'Functionality test',
    'Documentation complete',
    'Packaging integrity',
    'Serial number present',
  ];

  return Array.from({ length: count }, (_, i) => {
    const type = faker.helpers.arrayElement(['boolean', 'measurement', 'visual', 'document'] as const);
    const status = faker.helpers.arrayElement(['pending', 'pass', 'fail', 'na'] as const);

    return {
      id: faker.string.uuid(),
      name: itemNames[i % itemNames.length],
      description: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
      type,
      required: faker.datatype.boolean({ probability: 0.8 }),
      status,
      value: status !== 'pending' && status !== 'na'
        ? type === 'measurement'
          ? faker.number.float({ min: 0, max: 100, fractionDigits: 2 })
          : type === 'boolean'
            ? status === 'pass'
            : faker.lorem.word()
        : undefined,
      specification: type === 'measurement'
        ? {
            min: faker.number.float({ min: 0, max: 50, fractionDigits: 2 }),
            max: faker.number.float({ min: 50, max: 100, fractionDigits: 2 }),
            target: faker.number.float({ min: 25, max: 75, fractionDigits: 2 }),
            unit: faker.helpers.arrayElement(['mm', 'cm', 'kg', 'g', '°C', '%']),
          }
        : undefined,
      notes: faker.datatype.boolean({ probability: 0.2 }) ? faker.lorem.sentence() : undefined,
      imageUrl: faker.datatype.boolean({ probability: 0.2 }) ? faker.image.url() : undefined,
    };
  });
};

export const generateMockDefects = (count: number = 15): Defect[] => {
  const types: Defect['type'][] = ['dimensional', 'visual', 'functional', 'material', 'documentation'];
  const severities: Defect['severity'][] = ['minor', 'major', 'critical'];
  const categories = ['Scratch', 'Dent', 'Misalignment', 'Color variation', 'Missing part', 'Wrong dimension', 'Contamination'];

  return Array.from({ length: count }, (_, i) => {
    const status = faker.helpers.arrayElement(['open', 'investigating', 'resolved', 'closed'] as const);

    return {
      id: faker.string.uuid(),
      defectNumber: `DEF-${String(i + 1).padStart(5, '0')}`,
      inspectionId: faker.string.uuid(),
      productId: faker.string.uuid(),
      productName: faker.commerce.productName(),
      type: faker.helpers.arrayElement(types),
      severity: faker.helpers.arrayElement(severities),
      category: faker.helpers.arrayElement(categories),
      description: faker.lorem.sentence(),
      cause: faker.datatype.boolean({ probability: 0.6 }) ? faker.lorem.sentence() : undefined,
      correctiveAction: faker.datatype.boolean({ probability: 0.5 }) ? faker.lorem.sentence() : undefined,
      status,
      quantity: faker.number.int({ min: 1, max: 10 }),
      reportedBy: faker.person.fullName(),
      assignedTo: faker.datatype.boolean({ probability: 0.7 }) ? faker.person.fullName() : undefined,
      images: faker.datatype.boolean({ probability: 0.5 })
        ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.image.url())
        : [],
      createdAt: faker.date.recent({ days: 30 }).toISOString(),
      resolvedAt: ['resolved', 'closed'].includes(status) ? faker.date.recent({ days: 7 }).toISOString() : undefined,
    };
  });
};

export const generateMockNCRs = (count: number = 10): NonConformanceReport[] => {
  const types: NonConformanceReport['type'][] = ['product', 'process', 'supplier', 'customer'];
  const statuses: NonConformanceReport['status'][] = ['open', 'investigating', 'containment', 'corrective_action', 'verification', 'closed'];
  const priorities: NonConformanceReport['priority'][] = ['low', 'medium', 'high', 'critical'];

  return Array.from({ length: count }, (_, i) => {
    const type = faker.helpers.arrayElement(types);
    const status = faker.helpers.arrayElement(statuses);

    return {
      id: faker.string.uuid(),
      ncrNumber: `NCR-${String(i + 1).padStart(5, '0')}`,
      type,
      status,
      priority: faker.helpers.arrayElement(priorities),
      productId: ['product', 'supplier'].includes(type) ? faker.string.uuid() : undefined,
      productName: ['product', 'supplier'].includes(type) ? faker.commerce.productName() : undefined,
      supplierId: type === 'supplier' ? faker.string.uuid() : undefined,
      supplierName: type === 'supplier' ? faker.company.name() : undefined,
      description: faker.lorem.paragraph(),
      rootCause: ['investigating', 'containment', 'corrective_action', 'verification', 'closed'].includes(status)
        ? faker.lorem.sentence()
        : undefined,
      containmentAction: ['containment', 'corrective_action', 'verification', 'closed'].includes(status)
        ? faker.lorem.sentence()
        : undefined,
      correctiveAction: ['corrective_action', 'verification', 'closed'].includes(status) ? faker.lorem.sentence() : undefined,
      preventiveAction: ['verification', 'closed'].includes(status) ? faker.lorem.sentence() : undefined,
      verificationResult: status === 'closed' ? faker.lorem.sentence() : undefined,
      costImpact: faker.datatype.boolean({ probability: 0.6 })
        ? faker.number.float({ min: 100, max: 10000, fractionDigits: 2 })
        : undefined,
      assignedTo: faker.person.fullName(),
      team: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => faker.person.fullName()),
      dueDate: faker.date.soon({ days: 30 }).toISOString(),
      activities: generateMockNCRActivities(faker.string.uuid(), faker.number.int({ min: 3, max: 8 })),
      attachments: faker.datatype.boolean({ probability: 0.5 })
        ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.system.fileName())
        : [],
      createdBy: faker.person.fullName(),
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      closedAt: status === 'closed' ? faker.date.recent({ days: 14 }).toISOString() : undefined,
    };
  });
};

export const generateMockNCRActivities = (ncrId: string, count: number = 5): NCRActivity[] => {
  const types: NCRActivity['type'][] = ['created', 'status_change', 'comment', 'assignment', 'attachment', 'action_added'];

  return Array.from({ length: count }, (_, i) => ({
    id: faker.string.uuid(),
    ncrId,
    type: i === 0 ? 'created' : faker.helpers.arrayElement(types),
    description: faker.lorem.sentence(),
    user: faker.person.fullName(),
    timestamp: new Date(Date.now() - i * faker.number.int({ min: 30, max: 120 }) * 60000).toISOString(),
    metadata: faker.datatype.boolean({ probability: 0.3 }) ? { reference: faker.string.alphanumeric(8) } : undefined,
  }));
};

export const generateMockQualityMetrics = (): QualityMetrics => {
  return {
    defectRate: faker.number.float({ min: 0.5, max: 5, fractionDigits: 2 }),
    firstPassYield: faker.number.float({ min: 90, max: 99, fractionDigits: 1 }),
    inspectionCompliance: faker.number.float({ min: 85, max: 100, fractionDigits: 1 }),
    openNCRs: faker.number.int({ min: 0, max: 15 }),
    avgResolutionTime: faker.number.float({ min: 1, max: 10, fractionDigits: 1 }),
    topDefectTypes: [
      { type: 'Visual', count: faker.number.int({ min: 10, max: 50 }) },
      { type: 'Dimensional', count: faker.number.int({ min: 5, max: 30 }) },
      { type: 'Functional', count: faker.number.int({ min: 3, max: 20 }) },
      { type: 'Material', count: faker.number.int({ min: 1, max: 15 }) },
      { type: 'Documentation', count: faker.number.int({ min: 1, max: 10 }) },
    ],
    trendData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      defectRate: faker.number.float({ min: 0.5, max: 5, fractionDigits: 2 }),
      yield: faker.number.float({ min: 90, max: 99, fractionDigits: 1 }),
    })),
    severityDistribution: [
      { severity: 'Critical', count: faker.number.int({ min: 1, max: 10 }) },
      { severity: 'Major', count: faker.number.int({ min: 5, max: 30 }) },
      { severity: 'Minor', count: faker.number.int({ min: 10, max: 50 }) },
    ],
    categoryBreakdown: [
      { category: 'Scratch', count: faker.number.int({ min: 5, max: 25 }) },
      { category: 'Dent', count: faker.number.int({ min: 3, max: 20 }) },
      { category: 'Misalignment', count: faker.number.int({ min: 2, max: 15 }) },
      { category: 'Color variation', count: faker.number.int({ min: 1, max: 10 }) },
      { category: 'Other', count: faker.number.int({ min: 1, max: 10 }) },
    ],
  };
};

export const generateMockCertificate = (inspectionId?: string): QualityCertificate => {
  return {
    id: faker.string.uuid(),
    certificateNumber: `CERT-${faker.string.alphanumeric(8).toUpperCase()}`,
    type: faker.helpers.arrayElement(['coc', 'coa', 'test_report', 'material_cert'] as const),
    productId: faker.string.uuid(),
    productName: faker.commerce.productName(),
    batchNumber: `BATCH-${faker.string.alphanumeric(6).toUpperCase()}`,
    lotNumber: faker.datatype.boolean() ? `LOT-${faker.string.alphanumeric(4).toUpperCase()}` : undefined,
    inspectionId: inspectionId || faker.string.uuid(),
    issuedDate: faker.date.recent({ days: 30 }).toISOString(),
    expiryDate: faker.datatype.boolean({ probability: 0.7 }) ? faker.date.future({ years: 1 }).toISOString() : undefined,
    issuedBy: faker.person.fullName(),
    approvedBy: faker.person.fullName(),
    specifications: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
      parameter: faker.helpers.arrayElement(['Dimension A', 'Dimension B', 'Weight', 'Hardness', 'Tensile Strength', 'Color', 'pH Level']),
      specification: `${faker.number.float({ min: 10, max: 50, fractionDigits: 1 })} ± ${faker.number.float({ min: 0.1, max: 2, fractionDigits: 1 })} ${faker.helpers.arrayElement(['mm', 'kg', 'HRC', 'MPa', ''])}`,
      result: `${faker.number.float({ min: 10, max: 50, fractionDigits: 2 })}`,
      status: faker.helpers.weightedArrayElement([
        { value: 'pass' as const, weight: 0.95 },
        { value: 'fail' as const, weight: 0.05 },
      ]),
    })),
    notes: faker.datatype.boolean({ probability: 0.3 }) ? faker.lorem.sentence() : undefined,
    signatureUrl: faker.datatype.boolean({ probability: 0.8 }) ? faker.image.url() : undefined,
  };
};

export const generateMockInspectionEvents = (inspectionId: string, count: number = 6): InspectionEvent[] => {
  const eventTypes: InspectionEvent['type'][] = ['scheduled', 'started', 'sampled', 'inspected', 'completed', 'approved'];

  return Array.from({ length: count }, (_, i) => ({
    id: faker.string.uuid(),
    inspectionId,
    type: eventTypes[i % eventTypes.length],
    description: faker.lorem.sentence(),
    user: faker.person.fullName(),
    timestamp: new Date(Date.now() - (count - 1 - i) * faker.number.int({ min: 30, max: 120 }) * 60000).toISOString(),
    metadata: faker.datatype.boolean({ probability: 0.3 })
      ? { quantity: faker.number.int({ min: 1, max: 100 }) }
      : undefined,
  }));
};
