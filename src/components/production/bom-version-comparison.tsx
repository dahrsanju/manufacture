'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { ArrowRight, Plus, Minus, Edit } from 'lucide-react';

interface BOMItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
}

interface BOMVersion {
  version: string;
  date: string;
  author: string;
  items: BOMItem[];
  totalCost: number;
}

interface BOMVersionComparisonProps {
  oldVersion: BOMVersion;
  newVersion: BOMVersion;
}

const mockOldVersion: BOMVersion = {
  version: 'v1.0',
  date: '2024-10-15',
  author: 'John Smith',
  items: [
    { id: 'i1', sku: 'RM-001', name: 'Aluminum Sheet', quantity: 50, unit: 'kg', cost: 250 },
    { id: 'i2', sku: 'RM-002', name: 'Steel Rod', quantity: 25, unit: 'pcs', cost: 125 },
    { id: 'i3', sku: 'CP-001', name: 'Screws M4', quantity: 1000, unit: 'pcs', cost: 50 },
  ],
  totalCost: 425,
};

const mockNewVersion: BOMVersion = {
  version: 'v1.1',
  date: '2024-11-20',
  author: 'Sarah Johnson',
  items: [
    { id: 'i1', sku: 'RM-001', name: 'Aluminum Sheet', quantity: 45, unit: 'kg', cost: 225 },
    { id: 'i2', sku: 'RM-002', name: 'Steel Rod', quantity: 25, unit: 'pcs', cost: 125 },
    { id: 'i3', sku: 'CP-001', name: 'Screws M4', quantity: 1200, unit: 'pcs', cost: 60 },
    { id: 'i4', sku: 'CP-002', name: 'Bearings', quantity: 500, unit: 'pcs', cost: 150 },
  ],
  totalCost: 560,
};

export function BOMVersionComparison({
  oldVersion = mockOldVersion,
  newVersion = mockNewVersion,
}: BOMVersionComparisonProps) {
  // Find changes
  const changes: {
    type: 'added' | 'removed' | 'modified';
    item: BOMItem;
    oldItem?: BOMItem;
  }[] = [];

  // Check for modified and removed items
  oldVersion.items.forEach((oldItem) => {
    const newItem = newVersion.items.find((i) => i.sku === oldItem.sku);
    if (!newItem) {
      changes.push({ type: 'removed', item: oldItem });
    } else if (oldItem.quantity !== newItem.quantity || oldItem.cost !== newItem.cost) {
      changes.push({ type: 'modified', item: newItem, oldItem });
    }
  });

  // Check for added items
  newVersion.items.forEach((newItem) => {
    const oldItem = oldVersion.items.find((i) => i.sku === newItem.sku);
    if (!oldItem) {
      changes.push({ type: 'added', item: newItem });
    }
  });

  const costDiff = newVersion.totalCost - oldVersion.totalCost;
  const costDiffPercent = ((costDiff / oldVersion.totalCost) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Version Headers */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="secondary">{oldVersion.version}</Badge>
                <p className="text-sm text-muted-foreground mt-1">{oldVersion.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${oldVersion.totalCost}</p>
                <p className="text-xs text-muted-foreground">by {oldVersion.author}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="default">{newVersion.version}</Badge>
                <p className="text-sm text-muted-foreground mt-1">{newVersion.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${newVersion.totalCost}</p>
                <p className="text-xs text-muted-foreground">by {newVersion.author}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Cost Impact</span>
            <span className={`text-lg font-bold ${costDiff > 0 ? 'text-destructive' : 'text-success'}`}>
              {costDiff > 0 ? '+' : ''}{costDiff} ({costDiff > 0 ? '+' : ''}{costDiffPercent}%)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Changes */}
      <Card>
        <CardHeader>
          <CardTitle>Changes ({changes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {changes.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No changes detected</p>
          ) : (
            <div className="space-y-3">
              {changes.map((change, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    change.type === 'added'
                      ? 'bg-success/10 border-success/30'
                      : change.type === 'removed'
                      ? 'bg-destructive/10 border-destructive/30'
                      : 'bg-warning/10 border-warning/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {change.type === 'added' && <Plus className="h-4 w-4 text-success" />}
                    {change.type === 'removed' && <Minus className="h-4 w-4 text-destructive" />}
                    {change.type === 'modified' && <Edit className="h-4 w-4 text-warning" />}
                    <span className="font-medium capitalize">{change.type}</span>
                  </div>

                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="font-mono">{change.item.sku}</span>
                      <span>{change.item.name}</span>
                    </div>

                    {change.type === 'modified' && change.oldItem && (
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="text-muted-foreground">
                          Qty: {change.oldItem.quantity} → {change.item.quantity}
                        </span>
                        <span className="text-muted-foreground">|</span>
                        <span className="text-muted-foreground">
                          Cost: ${change.oldItem.cost} → ${change.item.cost}
                        </span>
                      </div>
                    )}

                    {change.type !== 'modified' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Qty: {change.item.quantity} {change.item.unit} | Cost: ${change.item.cost}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
