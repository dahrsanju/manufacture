'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui';
import { Copy, Calendar, Hash, Settings, ArrowRight } from 'lucide-react';

interface WorkOrderCloneProps {
  sourceWorkOrder: {
    id: string;
    number: string;
    product: string;
    quantity: number;
    priority: string;
    dueDate: string;
    operations: { name: string; duration: number }[];
  };
  onClone?: (options: CloneOptions) => void;
  onCancel?: () => void;
}

interface CloneOptions {
  newNumber: string;
  quantity: number;
  dueDate: string;
  includeOperations: boolean;
  includeMaterials: boolean;
  includeAttachments: boolean;
  copies: number;
}

export function WorkOrderClone({
  sourceWorkOrder,
  onClone,
  onCancel,
}: WorkOrderCloneProps) {
  const [options, setOptions] = useState<CloneOptions>({
    newNumber: `${sourceWorkOrder.number}-COPY`,
    quantity: sourceWorkOrder.quantity,
    dueDate: sourceWorkOrder.dueDate,
    includeOperations: true,
    includeMaterials: true,
    includeAttachments: false,
    copies: 1,
  });

  const handleClone = () => {
    onClone?.(options);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Copy className="h-5 w-5" />
          Clone Work Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Source Work Order Info */}
        <div className="p-4 bg-muted/50 rounded-lg mb-6">
          <p className="text-sm text-muted-foreground mb-1">Source Work Order</p>
          <div className="flex items-center gap-3">
            <span className="font-bold">{sourceWorkOrder.number}</span>
            <Badge variant="outline">{sourceWorkOrder.product}</Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>Qty: {sourceWorkOrder.quantity}</span>
            <span>Operations: {sourceWorkOrder.operations.length}</span>
            <span>Due: {new Date(sourceWorkOrder.dueDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Clone Options */}
        <div className="space-y-4">
          {/* New Work Order Number */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Hash className="h-4 w-4" />
              New Work Order Number
            </label>
            <Input
              value={options.newNumber}
              onChange={(e) => setOptions({ ...options, newNumber: e.target.value })}
              className="mt-1"
            />
          </div>

          {/* Quantity and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                value={options.quantity}
                onChange={(e) => setOptions({ ...options, quantity: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </label>
              <Input
                type="date"
                value={options.dueDate.split('T')[0]}
                onChange={(e) => setOptions({ ...options, dueDate: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          {/* Number of Copies */}
          <div>
            <label className="text-sm font-medium">Number of Copies</label>
            <Input
              type="number"
              min={1}
              max={10}
              value={options.copies}
              onChange={(e) => setOptions({ ...options, copies: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)) })}
              className="mt-1 w-32"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {options.copies > 1 && `Will create ${options.copies} work orders with sequential numbers`}
            </p>
          </div>

          {/* Include Options */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Settings className="h-4 w-4" />
              Include in Clone
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.includeOperations}
                  onChange={(e) => setOptions({ ...options, includeOperations: e.target.checked })}
                  className="rounded border-input"
                />
                <span className="text-sm">Operations ({sourceWorkOrder.operations.length} steps)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.includeMaterials}
                  onChange={(e) => setOptions({ ...options, includeMaterials: e.target.checked })}
                  className="rounded border-input"
                />
                <span className="text-sm">Materials & BOM</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.includeAttachments}
                  onChange={(e) => setOptions({ ...options, includeAttachments: e.target.checked })}
                  className="rounded border-input"
                />
                <span className="text-sm">Attachments & Documents</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleClone}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Clone Work Order{options.copies > 1 ? 's' : ''}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
