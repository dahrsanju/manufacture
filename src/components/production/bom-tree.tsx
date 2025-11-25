'use client';

import { useState } from 'react';
import { Button, Badge } from '@/components/ui';
import {
  ChevronRight,
  ChevronDown,
  Package,
  Layers,
  CircleDot,
} from 'lucide-react';

interface BOMItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  type: 'assembly' | 'component' | 'raw';
  children?: BOMItem[];
}

interface BOMTreeProps {
  items: BOMItem[];
  onItemClick?: (item: BOMItem) => void;
  showCosts?: boolean;
}

interface BOMTreeNodeProps {
  item: BOMItem;
  level: number;
  onItemClick?: (item: BOMItem) => void;
  showCosts?: boolean;
}

function BOMTreeNode({ item, level, onItemClick, showCosts }: BOMTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = item.children && item.children.length > 0;
  const totalCost = item.unitCost * item.quantity;

  const typeConfig = {
    assembly: {
      icon: Layers,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      label: 'Assembly',
    },
    component: {
      icon: Package,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      label: 'Component',
    },
    raw: {
      icon: CircleDot,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      label: 'Raw Material',
    },
  };

  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted/50 cursor-pointer ${
          level === 0 ? 'bg-muted/30' : ''
        }`}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
        onClick={() => onItemClick?.(item)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-muted rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <div className={`p-1.5 rounded ${config.bgColor}`}>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{item.name}</span>
            <span className="text-xs text-muted-foreground font-mono">{item.sku}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <span className="font-medium">{item.quantity}</span>
            <span className="text-muted-foreground ml-1">{item.unit}</span>
          </div>
          {showCosts && (
            <div className="text-right w-24">
              <span className="font-medium">${totalCost.toFixed(2)}</span>
            </div>
          )}
          <Badge variant="secondary" className="text-xs">
            {config.label}
          </Badge>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {item.children!.map((child) => (
            <BOMTreeNode
              key={child.id}
              item={child}
              level={level + 1}
              onItemClick={onItemClick}
              showCosts={showCosts}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function BOMTree({ items, onItemClick, showCosts = true }: BOMTreeProps) {
  const calculateTotalCost = (items: BOMItem[]): number => {
    return items.reduce((sum, item) => {
      const itemCost = item.unitCost * item.quantity;
      const childrenCost = item.children ? calculateTotalCost(item.children) : 0;
      return sum + itemCost + childrenCost;
    }, 0);
  };

  const totalCost = calculateTotalCost(items);

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted rounded-lg text-sm font-medium">
        <span>Component</span>
        <div className="flex items-center gap-4">
          <span>Qty</span>
          {showCosts && <span className="w-24 text-right">Cost</span>}
          <span className="w-20">Type</span>
        </div>
      </div>

      {/* Tree */}
      <div className="border rounded-lg divide-y">
        {items.map((item) => (
          <BOMTreeNode
            key={item.id}
            item={item}
            level={0}
            onItemClick={onItemClick}
            showCosts={showCosts}
          />
        ))}
      </div>

      {/* Total */}
      {showCosts && (
        <div className="flex justify-end items-center gap-2 px-3 py-2 bg-primary/5 rounded-lg">
          <span className="font-medium">Total Cost:</span>
          <span className="text-lg font-bold">${totalCost.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}

// Sample BOM data for demo
export const sampleBOMData: BOMItem[] = [
  {
    id: 'asm-001',
    sku: 'ASM-WIDGET-PRO',
    name: 'Widget Pro Assembly',
    quantity: 1,
    unit: 'EA',
    unitCost: 0,
    type: 'assembly',
    children: [
      {
        id: 'comp-001',
        sku: 'COMP-HOUSING',
        name: 'Housing Unit',
        quantity: 1,
        unit: 'EA',
        unitCost: 25.00,
        type: 'component',
        children: [
          {
            id: 'raw-001',
            sku: 'RAW-ALU-SHEET',
            name: 'Aluminum Sheet 2mm',
            quantity: 0.5,
            unit: 'M2',
            unitCost: 15.00,
            type: 'raw',
          },
          {
            id: 'raw-002',
            sku: 'RAW-SCREWS',
            name: 'M3 Screws',
            quantity: 8,
            unit: 'EA',
            unitCost: 0.10,
            type: 'raw',
          },
        ],
      },
      {
        id: 'comp-002',
        sku: 'COMP-PCB',
        name: 'Control PCB',
        quantity: 1,
        unit: 'EA',
        unitCost: 35.00,
        type: 'component',
        children: [
          {
            id: 'raw-003',
            sku: 'RAW-PCB-BLANK',
            name: 'PCB Blank',
            quantity: 1,
            unit: 'EA',
            unitCost: 5.00,
            type: 'raw',
          },
          {
            id: 'raw-004',
            sku: 'RAW-CAPACITOR',
            name: 'Capacitors 100uF',
            quantity: 10,
            unit: 'EA',
            unitCost: 0.25,
            type: 'raw',
          },
          {
            id: 'raw-005',
            sku: 'RAW-RESISTOR',
            name: 'Resistors Assorted',
            quantity: 20,
            unit: 'EA',
            unitCost: 0.05,
            type: 'raw',
          },
        ],
      },
      {
        id: 'comp-003',
        sku: 'COMP-MOTOR',
        name: 'DC Motor 12V',
        quantity: 2,
        unit: 'EA',
        unitCost: 12.50,
        type: 'component',
      },
      {
        id: 'raw-006',
        sku: 'RAW-WIRING',
        name: 'Wiring Harness',
        quantity: 1,
        unit: 'SET',
        unitCost: 8.00,
        type: 'raw',
      },
    ],
  },
];

export default BOMTree;
