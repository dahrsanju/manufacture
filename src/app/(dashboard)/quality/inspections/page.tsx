'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Breadcrumb,
  DataTable,
  type Column,
} from '@/components/ui';
import {
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ClipboardCheck,
} from 'lucide-react';

// Mock inspection data
const inspections = [
  {
    id: 'qc-001',
    inspectionNumber: 'QC-2024-0456',
    workOrder: 'WO-2024-0891',
    productName: 'Widget Pro X100',
    batchNumber: 'B-2024-1120',
    sampleSize: 50,
    passedQty: 48,
    failedQty: 2,
    result: 'PASSED',
    inspector: 'Tom Brown',
    inspectionDate: '2024-11-20',
    defectRate: 4,
  },
  {
    id: 'qc-002',
    inspectionNumber: 'QC-2024-0457',
    workOrder: 'WO-2024-0892',
    productName: 'Component A-123',
    batchNumber: 'B-2024-1121',
    sampleSize: 100,
    passedQty: 100,
    failedQty: 0,
    result: 'PASSED',
    inspector: 'Lisa Chen',
    inspectionDate: '2024-11-21',
    defectRate: 0,
  },
  {
    id: 'qc-003',
    inspectionNumber: 'QC-2024-0458',
    workOrder: 'WO-2024-0893',
    productName: 'Assembly Kit AK-50',
    batchNumber: 'B-2024-1122',
    sampleSize: 30,
    passedQty: 0,
    failedQty: 0,
    result: 'PENDING',
    inspector: 'Tom Brown',
    inspectionDate: '2024-11-22',
    defectRate: 0,
  },
  {
    id: 'qc-004',
    inspectionNumber: 'QC-2024-0459',
    workOrder: 'WO-2024-0894',
    productName: 'Finished Product FP-01',
    batchNumber: 'B-2024-1123',
    sampleSize: 25,
    passedQty: 18,
    failedQty: 7,
    result: 'FAILED',
    inspector: 'Mike Johnson',
    inspectionDate: '2024-11-19',
    defectRate: 28,
  },
  {
    id: 'qc-005',
    inspectionNumber: 'QC-2024-0460',
    workOrder: 'WO-2024-0895',
    productName: 'Custom Order CO-100',
    batchNumber: 'B-2024-1124',
    sampleSize: 50,
    passedQty: 47,
    failedQty: 3,
    result: 'PASSED',
    inspector: 'Lisa Chen',
    inspectionDate: '2024-11-20',
    defectRate: 6,
  },
];

type Inspection = typeof inspections[0];

const resultConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary'; icon: typeof CheckCircle2 }> = {
  PENDING: { label: 'Pending', variant: 'secondary', icon: Clock },
  PASSED: { label: 'Passed', variant: 'success', icon: CheckCircle2 },
  FAILED: { label: 'Failed', variant: 'destructive', icon: XCircle },
  ON_HOLD: { label: 'On Hold', variant: 'warning', icon: AlertTriangle },
};

export default function InspectionsPage() {
  const router = useRouter();
  const [resultFilter, setResultFilter] = useState<string>('all');

  const filteredInspections = resultFilter === 'all'
    ? inspections
    : inspections.filter(insp => insp.result === resultFilter);

  const columns: Column<Inspection>[] = [
    {
      key: 'inspectionNumber',
      header: 'Inspection #',
      sortable: true,
      render: (_, row) => (
        <span className="font-mono font-medium">{row.inspectionNumber}</span>
      ),
    },
    {
      key: 'workOrder',
      header: 'Work Order',
      sortable: true,
      render: (_, row) => (
        <span className="font-mono text-sm">{row.workOrder}</span>
      ),
    },
    {
      key: 'productName',
      header: 'Product',
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-medium">{row.productName}</p>
          <p className="text-xs text-muted-foreground font-mono">{row.batchNumber}</p>
        </div>
      ),
    },
    {
      key: 'sampleSize',
      header: 'Sample',
      render: (_, row) => (
        <div className="text-center">
          <p className="font-medium">{row.sampleSize}</p>
          <p className="text-xs text-muted-foreground">units</p>
        </div>
      ),
    },
    {
      key: 'passedQty',
      header: 'Pass/Fail',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <span className="text-success">{row.passedQty}</span>
          <span>/</span>
          <span className="text-destructive">{row.failedQty}</span>
        </div>
      ),
    },
    {
      key: 'defectRate',
      header: 'Defect Rate',
      sortable: true,
      render: (_, row) => {
        const rate = row.defectRate;
        const color = rate === 0 ? 'text-success' : rate < 5 ? 'text-warning' : 'text-destructive';
        return (
          <span className={`font-medium ${color}`}>
            {rate}%
          </span>
        );
      },
    },
    {
      key: 'result',
      header: 'Result',
      sortable: true,
      render: (_, row) => {
        const config = resultConfig[row.result];
        const Icon = config.icon;
        return (
          <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'inspector',
      header: 'Inspector',
      sortable: true,
    },
    {
      key: 'inspectionDate',
      header: 'Date',
      sortable: true,
      render: (_, row) => (
        <span>{new Date(row.inspectionDate).toLocaleDateString()}</span>
      ),
    },
  ];

  // Calculate stats
  const stats = {
    total: inspections.length,
    passed: inspections.filter(i => i.result === 'PASSED').length,
    failed: inspections.filter(i => i.result === 'FAILED').length,
    avgDefectRate: Math.round(
      inspections.reduce((sum, i) => sum + i.defectRate, 0) / inspections.length
    ),
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quality Inspections</h1>
          <p className="text-muted-foreground">
            Manage quality control inspections and defect tracking
          </p>
        </div>
        <Button onClick={() => router.push('/quality/inspections/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Inspection
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Inspections</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Passed</p>
                <p className="text-2xl font-bold">{stats.passed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Defect Rate</p>
                <p className="text-2xl font-bold">{stats.avgDefectRate}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'PENDING', 'PASSED', 'FAILED'].map((result) => (
          <Button
            key={result}
            variant={resultFilter === result ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setResultFilter(result)}
          >
            {result === 'all' ? 'All' : resultConfig[result]?.label || result}
          </Button>
        ))}
      </div>

      {/* Inspections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredInspections}
            keyField="id"
            searchable
            searchPlaceholder="Search inspections..."
            onRowClick={(row) => router.push(`/quality/inspections/${row.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
