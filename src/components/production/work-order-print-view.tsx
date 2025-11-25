'use client';

import { Button } from '@/components/ui';
import { Printer, Download } from 'lucide-react';

interface WorkOrder {
  id: string;
  number: string;
  product: string;
  quantity: number;
  unit: string;
  status: string;
  priority: string;
  startDate: string;
  dueDate: string;
  assignee: string;
  notes: string;
  operations: { name: string; duration: string; machine: string }[];
  materials: { sku: string; name: string; quantity: number; unit: string }[];
}

interface WorkOrderPrintViewProps {
  workOrder: WorkOrder;
  onPrint?: () => void;
  onDownload?: () => void;
}

const mockWorkOrder: WorkOrder = {
  id: 'wo-1',
  number: 'WO-2024-0891',
  product: 'Widget Pro X100',
  quantity: 500,
  unit: 'pcs',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  startDate: '2024-11-24',
  dueDate: '2024-11-26',
  assignee: 'John Smith',
  notes: 'Priority order for ABC Manufacturing. Ensure quality inspection on each batch.',
  operations: [
    { name: 'Material Prep', duration: '1h', machine: '-' },
    { name: 'CNC Machining', duration: '4h', machine: 'CNC Mill #1' },
    { name: 'Assembly', duration: '2h', machine: 'Assembly Line 1' },
    { name: 'Quality Check', duration: '1h', machine: 'QC Station' },
    { name: 'Packaging', duration: '30m', machine: 'Packaging Line' },
  ],
  materials: [
    { sku: 'RM-001', name: 'Aluminum Sheet', quantity: 50, unit: 'kg' },
    { sku: 'RM-002', name: 'Steel Rod', quantity: 25, unit: 'pcs' },
    { sku: 'CP-001', name: 'Screws M4', quantity: 1000, unit: 'pcs' },
    { sku: 'CP-002', name: 'Bearings', quantity: 500, unit: 'pcs' },
  ],
};

export function WorkOrderPrintView({
  workOrder = mockWorkOrder,
  onPrint,
  onDownload,
}: WorkOrderPrintViewProps) {
  const handlePrint = () => {
    window.print();
    onPrint?.();
  };

  return (
    <div>
      {/* Action Buttons - Hide on print */}
      <div className="flex justify-end gap-2 mb-4 print:hidden">
        <Button variant="outline" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      {/* Print Content */}
      <div className="bg-white p-8 border rounded-lg print:border-0 print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold">Work Order</h1>
            <p className="text-xl font-mono">{workOrder.number}</p>
          </div>
          <div className="text-right">
            <p className="font-bold">Company Name</p>
            <p className="text-sm text-muted-foreground">123 Manufacturing St</p>
            <p className="text-sm text-muted-foreground">City, State 12345</p>
          </div>
        </div>

        {/* Work Order Details */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Product:</span>
              <span>{workOrder.product}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Quantity:</span>
              <span>{workOrder.quantity} {workOrder.unit}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Priority:</span>
              <span>{workOrder.priority}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Start Date:</span>
              <span>{new Date(workOrder.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Due Date:</span>
              <span>{new Date(workOrder.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Assigned To:</span>
              <span>{workOrder.assignee}</span>
            </div>
          </div>
        </div>

        {/* Operations */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b pb-2">Operations</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">#</th>
                <th className="text-left py-2">Operation</th>
                <th className="text-left py-2">Duration</th>
                <th className="text-left py-2">Machine</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {workOrder.operations.map((op, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">{op.name}</td>
                  <td className="py-2">{op.duration}</td>
                  <td className="py-2">{op.machine}</td>
                  <td className="py-2">☐</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Materials */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b pb-2">Materials Required</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">SKU</th>
                <th className="text-left py-2">Material</th>
                <th className="text-right py-2">Qty Required</th>
                <th className="text-right py-2">Qty Issued</th>
              </tr>
            </thead>
            <tbody>
              {workOrder.materials.map((mat) => (
                <tr key={mat.sku} className="border-b">
                  <td className="py-2 font-mono">{mat.sku}</td>
                  <td className="py-2">{mat.name}</td>
                  <td className="py-2 text-right">{mat.quantity} {mat.unit}</td>
                  <td className="py-2 text-right">_______</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        {workOrder.notes && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3 border-b pb-2">Notes</h2>
            <p className="text-sm">{workOrder.notes}</p>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="border-t border-black pt-2">
              <p className="text-sm font-medium">Prepared By</p>
              <p className="text-xs text-muted-foreground">Date: ___________</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black pt-2">
              <p className="text-sm font-medium">Approved By</p>
              <p className="text-xs text-muted-foreground">Date: ___________</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black pt-2">
              <p className="text-sm font-medium">Completed By</p>
              <p className="text-xs text-muted-foreground">Date: ___________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
