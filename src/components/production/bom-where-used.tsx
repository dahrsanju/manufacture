'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Input } from '@/components/ui';
import { Search, Package, ChevronRight, AlertTriangle } from 'lucide-react';

interface WhereUsedItem {
  id: string;
  sku: string;
  name: string;
  type: 'finished' | 'assembly' | 'component';
  quantityPer: number;
  totalDemand: number;
  status: 'active' | 'discontinued';
}

interface BOMWhereUsedProps {
  componentSku: string;
  componentName: string;
  whereUsed: WhereUsedItem[];
  onItemClick?: (item: WhereUsedItem) => void;
}

const mockData: BOMWhereUsedProps = {
  componentSku: 'CP-001',
  componentName: 'Screws M4',
  whereUsed: [
    { id: 'p1', sku: 'FG-001', name: 'Widget Pro X100', type: 'finished', quantityPer: 24, totalDemand: 12000, status: 'active' },
    { id: 'p2', sku: 'FG-002', name: 'Widget Standard', type: 'finished', quantityPer: 18, totalDemand: 9000, status: 'active' },
    { id: 'p3', sku: 'ASM-001', name: 'Motor Assembly', type: 'assembly', quantityPer: 12, totalDemand: 6000, status: 'active' },
    { id: 'p4', sku: 'ASM-002', name: 'Gearbox Unit', type: 'assembly', quantityPer: 16, totalDemand: 4800, status: 'active' },
    { id: 'p5', sku: 'FG-003', name: 'Widget Legacy', type: 'finished', quantityPer: 20, totalDemand: 0, status: 'discontinued' },
  ],
};

const typeColors = {
  finished: 'default',
  assembly: 'secondary',
  component: 'outline',
} as const;

export function BOMWhereUsed({
  componentSku = mockData.componentSku,
  componentName = mockData.componentName,
  whereUsed = mockData.whereUsed,
  onItemClick,
}: Partial<BOMWhereUsedProps>) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = whereUsed.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDemand = whereUsed.reduce((sum, item) => sum + item.totalDemand, 0);
  const activeProducts = whereUsed.filter((item) => item.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-mono text-lg">{componentSku}</h3>
              <p className="text-muted-foreground">{componentName}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{whereUsed.length}</p>
              <p className="text-sm text-muted-foreground">Products</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Total Demand</p>
              <p className="text-lg font-bold">{totalDemand.toLocaleString()} units</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Products</p>
              <p className="text-lg font-bold">{activeProducts} / {whereUsed.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Where Used List */}
      <Card>
        <CardHeader>
          <CardTitle>Used In Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemClick?.(item)}
                className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 ${
                  item.status === 'discontinued' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{item.sku}</span>
                    <Badge variant={typeColors[item.type]}>{item.type}</Badge>
                    {item.status === 'discontinued' && (
                      <Badge variant="secondary">Discontinued</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.name}</p>
                </div>

                <div className="text-right">
                  <p className="font-medium">{item.quantityPer} per unit</p>
                  <p className="text-sm text-muted-foreground">
                    {item.totalDemand.toLocaleString()} total
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No products found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Impact Warning */}
      {activeProducts > 0 && (
        <Card className="border-warning">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="font-medium">Impact Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Changes to this component will affect {activeProducts} active products
                  with a total demand of {totalDemand.toLocaleString()} units.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
