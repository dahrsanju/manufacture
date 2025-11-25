'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import {
  ArrowUp,
  ArrowDown,
  Minus,
  Warehouse,
  Package,
  TrendingUp,
  Users
} from 'lucide-react';

interface WarehouseStats {
  id: string;
  name: string;
  code: string;
  location: string;
  capacity: number;
  used: number;
  products: number;
  zones: number;
  staff: number;
  turnoverRate: number;
  accuracy: number;
  fillRate: number;
}

interface WarehouseComparisonProps {
  warehouses: WarehouseStats[];
  selectedIds?: string[];
  onSelect?: (ids: string[]) => void;
}

const mockWarehouses: WarehouseStats[] = [
  {
    id: 'wh-1',
    name: 'Main Warehouse',
    code: 'WH-001',
    location: 'New York, NY',
    capacity: 10000,
    used: 7500,
    products: 1250,
    zones: 8,
    staff: 45,
    turnoverRate: 12.5,
    accuracy: 99.2,
    fillRate: 95.8,
  },
  {
    id: 'wh-2',
    name: 'West Coast DC',
    code: 'WH-002',
    location: 'Los Angeles, CA',
    capacity: 8000,
    used: 6800,
    products: 980,
    zones: 6,
    staff: 38,
    turnoverRate: 14.2,
    accuracy: 98.7,
    fillRate: 94.2,
  },
  {
    id: 'wh-3',
    name: 'Regional Hub',
    code: 'WH-003',
    location: 'Chicago, IL',
    capacity: 5000,
    used: 3200,
    products: 650,
    zones: 4,
    staff: 22,
    turnoverRate: 10.8,
    accuracy: 99.5,
    fillRate: 96.5,
  },
];

interface MetricComparisonProps {
  label: string;
  values: (number | string)[];
  unit?: string;
  higherIsBetter?: boolean;
  format?: (value: number) => string;
}

function MetricComparison({
  label,
  values,
  unit = '',
  higherIsBetter = true,
  format = (v) => v.toString()
}: MetricComparisonProps) {
  const numericValues = values.map(v => typeof v === 'number' ? v : parseFloat(v as string));
  const maxValue = Math.max(...numericValues);
  const minValue = Math.min(...numericValues);

  const getIndicator = (value: number) => {
    if (numericValues.length < 2) return null;
    if (value === maxValue && value !== minValue) {
      return higherIsBetter ? (
        <ArrowUp className="h-3 w-3 text-success" />
      ) : (
        <ArrowDown className="h-3 w-3 text-destructive" />
      );
    }
    if (value === minValue && value !== maxValue) {
      return higherIsBetter ? (
        <ArrowDown className="h-3 w-3 text-destructive" />
      ) : (
        <ArrowUp className="h-3 w-3 text-success" />
      );
    }
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <div className="grid grid-cols-[150px_repeat(auto-fit,minmax(120px,1fr))] gap-4 py-2 border-b last:border-0">
      <span className="text-sm font-medium">{label}</span>
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-1 justify-end">
          <span className="text-sm">
            {typeof value === 'number' ? format(value) : value}{unit}
          </span>
          {getIndicator(numericValues[index])}
        </div>
      ))}
    </div>
  );
}

export function WarehouseComparison({
  warehouses = mockWarehouses,
  selectedIds,
  onSelect,
}: WarehouseComparisonProps) {
  const [selected, setSelected] = useState<string[]>(
    selectedIds || warehouses.slice(0, 3).map(w => w.id)
  );

  const selectedWarehouses = warehouses.filter(w => selected.includes(w.id));

  const handleToggle = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <div className="space-y-6">
      {/* Warehouse Selector */}
      <div className="flex flex-wrap gap-2">
        {warehouses.map((warehouse) => (
          <button
            key={warehouse.id}
            onClick={() => handleToggle(warehouse.id)}
            className={`px-3 py-2 rounded-md text-sm border transition-colors ${
              selected.includes(warehouse.id)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-muted border-border'
            }`}
          >
            {warehouse.name}
          </button>
        ))}
      </div>

      {selectedWarehouses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Headers */}
            <div className="grid grid-cols-[150px_repeat(auto-fit,minmax(120px,1fr))] gap-4 pb-3 border-b font-medium">
              <span>Metric</span>
              {selectedWarehouses.map((wh) => (
                <span key={wh.id} className="text-right">{wh.code}</span>
              ))}
            </div>

            {/* Capacity */}
            <MetricComparison
              label="Capacity"
              values={selectedWarehouses.map(w => w.capacity)}
              unit=" units"
              format={(v) => v.toLocaleString()}
            />

            {/* Utilization */}
            <MetricComparison
              label="Utilization"
              values={selectedWarehouses.map(w => Math.round((w.used / w.capacity) * 100))}
              unit="%"
              higherIsBetter={false}
            />

            {/* Products */}
            <MetricComparison
              label="Products"
              values={selectedWarehouses.map(w => w.products)}
              format={(v) => v.toLocaleString()}
            />

            {/* Zones */}
            <MetricComparison
              label="Zones"
              values={selectedWarehouses.map(w => w.zones)}
            />

            {/* Staff */}
            <MetricComparison
              label="Staff"
              values={selectedWarehouses.map(w => w.staff)}
            />

            {/* Turnover Rate */}
            <MetricComparison
              label="Turnover Rate"
              values={selectedWarehouses.map(w => w.turnoverRate)}
              unit="x"
              format={(v) => v.toFixed(1)}
            />

            {/* Accuracy */}
            <MetricComparison
              label="Accuracy"
              values={selectedWarehouses.map(w => w.accuracy)}
              unit="%"
              format={(v) => v.toFixed(1)}
            />

            {/* Fill Rate */}
            <MetricComparison
              label="Fill Rate"
              values={selectedWarehouses.map(w => w.fillRate)}
              unit="%"
              format={(v) => v.toFixed(1)}
            />
          </CardContent>
        </Card>
      )}

      {selectedWarehouses.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Select warehouses to compare
        </div>
      )}
    </div>
  );
}
