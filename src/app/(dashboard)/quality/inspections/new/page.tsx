'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Select,
  Badge,
  Breadcrumb,
} from '@/components/ui';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  FileText,
  ClipboardCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock inspection template
const inspectionChecklist = [
  {
    id: 'cat-1',
    category: 'Visual Inspection',
    items: [
      { id: 'vi-1', name: 'Surface finish quality', type: 'pass_fail', required: true },
      { id: 'vi-2', name: 'Color consistency', type: 'pass_fail', required: true },
      { id: 'vi-3', name: 'No visible defects or scratches', type: 'pass_fail', required: true },
      { id: 'vi-4', name: 'Label placement and readability', type: 'pass_fail', required: false },
    ],
  },
  {
    id: 'cat-2',
    category: 'Dimensional Checks',
    items: [
      { id: 'dc-1', name: 'Length (mm)', type: 'measurement', required: true, spec: { min: 99.5, max: 100.5, unit: 'mm' } },
      { id: 'dc-2', name: 'Width (mm)', type: 'measurement', required: true, spec: { min: 49.5, max: 50.5, unit: 'mm' } },
      { id: 'dc-3', name: 'Height (mm)', type: 'measurement', required: true, spec: { min: 24.5, max: 25.5, unit: 'mm' } },
      { id: 'dc-4', name: 'Weight (g)', type: 'measurement', required: true, spec: { min: 95, max: 105, unit: 'g' } },
    ],
  },
  {
    id: 'cat-3',
    category: 'Functional Tests',
    items: [
      { id: 'ft-1', name: 'Assembly fit test', type: 'pass_fail', required: true },
      { id: 'ft-2', name: 'Movement/operation test', type: 'pass_fail', required: true },
      { id: 'ft-3', name: 'Electrical continuity (if applicable)', type: 'pass_fail', required: false },
    ],
  },
  {
    id: 'cat-4',
    category: 'Documentation',
    items: [
      { id: 'doc-1', name: 'Serial number recorded', type: 'pass_fail', required: true },
      { id: 'doc-2', name: 'Batch/lot number verified', type: 'pass_fail', required: true },
      { id: 'doc-3', name: 'Traceability documentation complete', type: 'pass_fail', required: false },
    ],
  },
];

const workOrders = [
  { value: 'wo-890', label: 'WO-2024-0890 - Widget Pro X100' },
  { value: 'wo-875', label: 'WO-2024-0875 - Assembly Kit AK-50' },
  { value: 'wo-862', label: 'WO-2024-0862 - Component A-123' },
];

const inspectionTypes = [
  { value: 'incoming', label: 'Incoming Inspection' },
  { value: 'in_process', label: 'In-Process Inspection' },
  { value: 'final', label: 'Final Inspection' },
  { value: 'outgoing', label: 'Outgoing Inspection' },
];

type CheckResult = 'pass' | 'fail' | 'na' | null;
type ChecklistResults = Record<string, { result: CheckResult; value?: string; notes?: string }>;

export default function NewInspectionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workOrderId, setWorkOrderId] = useState('');
  const [inspectionType, setInspectionType] = useState('');
  const [sampleSize, setSampleSize] = useState('5');
  const [results, setResults] = useState<ChecklistResults>({});
  const [overallNotes, setOverallNotes] = useState('');

  const updateResult = (itemId: string, result: CheckResult, value?: string, notes?: string) => {
    setResults(prev => ({
      ...prev,
      [itemId]: { result, value: value ?? prev[itemId]?.value, notes: notes ?? prev[itemId]?.notes }
    }));
  };

  const getResultStats = () => {
    const allItems = inspectionChecklist.flatMap(cat => cat.items);
    const answered = Object.keys(results).filter(id => results[id]?.result !== null);
    const passed = answered.filter(id => results[id]?.result === 'pass');
    const failed = answered.filter(id => results[id]?.result === 'fail');

    return {
      total: allItems.length,
      answered: answered.length,
      passed: passed.length,
      failed: failed.length,
      completion: Math.round((answered.length / allItems.length) * 100)
    };
  };

  const stats = getResultStats();

  const isWithinSpec = (value: string, spec: { min: number; max: number }) => {
    const num = parseFloat(value);
    if (isNaN(num)) return null;
    return num >= spec.min && num <= spec.max;
  };

  const handleSubmit = async () => {
    if (!workOrderId || !inspectionType) {
      toast.error('Please select work order and inspection type');
      return;
    }

    const requiredItems = inspectionChecklist
      .flatMap(cat => cat.items)
      .filter(item => item.required);

    const missingRequired = requiredItems.filter(item => !results[item.id]?.result);

    if (missingRequired.length > 0) {
      toast.error(`Please complete all required checks (${missingRequired.length} remaining)`);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const overallResult = stats.failed === 0 ? 'PASSED' : 'FAILED';
    toast.success(`Inspection completed: ${overallResult}`);
    router.push('/quality/inspections');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Quality Inspection</h1>
          <p className="text-muted-foreground">Perform quality checks and record results</p>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Completion</p>
              <p className="text-2xl font-bold">{stats.completion}%</p>
              <p className="text-xs text-muted-foreground">{stats.answered}/{stats.total} checks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Passed</p>
              <p className="text-2xl font-bold text-success">{stats.passed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold">{stats.total - stats.answered}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inspection Details */}
      <Card>
        <CardHeader>
          <CardTitle>Inspection Details</CardTitle>
          <CardDescription>Select work order and inspection parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Select
              label="Work Order *"
              options={workOrders}
              value={workOrderId}
              onChange={(e) => setWorkOrderId(e.target.value)}
              placeholder="Select work order"
            />
            <Select
              label="Inspection Type *"
              options={inspectionTypes}
              value={inspectionType}
              onChange={(e) => setInspectionType(e.target.value)}
              placeholder="Select type"
            />
            <Input
              type="number"
              label="Sample Size"
              value={sampleSize}
              onChange={(e) => setSampleSize(e.target.value)}
              min={1}
            />
          </div>
        </CardContent>
      </Card>

      {/* Inspection Checklist */}
      {inspectionChecklist.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.items.map((item) => {
                const itemResult = results[item.id];

                return (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          {item.required && (
                            <Badge variant="secondary" className="text-xs">Required</Badge>
                          )}
                        </div>
                        {item.type === 'measurement' && 'spec' in item && item.spec && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Spec: {item.spec.min} - {item.spec.max} {item.spec.unit}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {item.type === 'pass_fail' ? (
                          <>
                            <Button
                              size="sm"
                              variant={itemResult?.result === 'pass' ? 'primary' : 'outline'}
                              onClick={() => updateResult(item.id, 'pass')}
                              className={itemResult?.result === 'pass' ? 'bg-success hover:bg-success/90' : ''}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Pass
                            </Button>
                            <Button
                              size="sm"
                              variant={itemResult?.result === 'fail' ? 'primary' : 'outline'}
                              onClick={() => updateResult(item.id, 'fail')}
                              className={itemResult?.result === 'fail' ? 'bg-destructive hover:bg-destructive/90' : ''}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Fail
                            </Button>
                            {!item.required && (
                              <Button
                                size="sm"
                                variant={itemResult?.result === 'na' ? 'secondary' : 'ghost'}
                                onClick={() => updateResult(item.id, 'na')}
                              >
                                N/A
                              </Button>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Value"
                              className="w-24"
                              value={itemResult?.value || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                const spec = 'spec' in item ? item.spec : null;
                                const inSpec = spec ? isWithinSpec(value, spec) : null;
                                updateResult(
                                  item.id,
                                  inSpec === null ? null : inSpec ? 'pass' : 'fail',
                                  value
                                );
                              }}
                            />
                            {'spec' in item && item.spec && itemResult?.value && (
                              isWithinSpec(itemResult.value, item.spec) ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                              ) : (
                                <XCircle className="h-5 w-5 text-destructive" />
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {itemResult?.result === 'fail' && (
                      <div className="mt-3">
                        <Input
                          placeholder="Add notes about the failure..."
                          value={itemResult?.notes || ''}
                          onChange={(e) => updateResult(item.id, 'fail', undefined, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Overall Notes & Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Overall Notes</label>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Add any additional observations or notes..."
              value={overallNotes}
              onChange={(e) => setOverallNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Add Photos
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Attach Documents
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submit Actions */}
      <div className="flex justify-between items-center">
        <div>
          {stats.failed > 0 && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>{stats.failed} check(s) failed - inspection will be marked as FAILED</span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Inspection'}
          </Button>
        </div>
      </div>
    </div>
  );
}
