'use client';

import { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Button, Input, Card, CardContent, Badge, Modal } from '@/components/ui';

interface BinLocation {
  id: string;
  code: string;
  zone: string;
  aisle: string;
  rack: string;
  level: string;
  position: string;
  type: 'standard' | 'bulk' | 'pick' | 'reserve';
  capacity: number;
  used: number;
  products: { sku: string; name: string; quantity: number }[];
}

interface BinLocationManagerProps {
  warehouseId: string;
  bins: BinLocation[];
  onAddBin?: (bin: Partial<BinLocation>) => void;
  onEditBin?: (bin: BinLocation) => void;
  onDeleteBin?: (binId: string) => void;
}

const mockBins: BinLocation[] = [
  {
    id: 'bin-1',
    code: 'A-01-01-A',
    zone: 'A',
    aisle: '01',
    rack: '01',
    level: 'A',
    position: '1',
    type: 'pick',
    capacity: 100,
    used: 75,
    products: [
      { sku: 'SKU-001', name: 'Widget A', quantity: 50 },
      { sku: 'SKU-002', name: 'Widget B', quantity: 25 },
    ],
  },
  {
    id: 'bin-2',
    code: 'A-01-01-B',
    zone: 'A',
    aisle: '01',
    rack: '01',
    level: 'B',
    position: '1',
    type: 'reserve',
    capacity: 200,
    used: 180,
    products: [
      { sku: 'SKU-001', name: 'Widget A', quantity: 180 },
    ],
  },
  {
    id: 'bin-3',
    code: 'B-02-03-A',
    zone: 'B',
    aisle: '02',
    rack: '03',
    level: 'A',
    position: '1',
    type: 'bulk',
    capacity: 500,
    used: 320,
    products: [
      { sku: 'SKU-003', name: 'Raw Material X', quantity: 320 },
    ],
  },
  {
    id: 'bin-4',
    code: 'C-01-02-A',
    zone: 'C',
    aisle: '01',
    rack: '02',
    level: 'A',
    position: '1',
    type: 'standard',
    capacity: 150,
    used: 0,
    products: [],
  },
];

const typeColors = {
  standard: 'default',
  bulk: 'warning',
  pick: 'success',
  reserve: 'secondary',
} as const;

export function BinLocationManager({
  warehouseId,
  bins = mockBins,
  onAddBin,
  onEditBin,
  onDeleteBin,
}: BinLocationManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBin, setSelectedBin] = useState<BinLocation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredBins = bins.filter((bin) => {
    const matchesSearch =
      bin.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.products.some((p) => p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !filterType || bin.type === filterType;
    return matchesSearch && matchesType;
  });

  const getUtilizationLevel = (bin: BinLocation) => {
    const utilization = (bin.used / bin.capacity) * 100;
    if (utilization >= 90) return 'destructive';
    if (utilization >= 70) return 'warning';
    if (utilization > 0) return 'success';
    return 'secondary';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bins or SKUs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === null ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType(null)}
            >
              All
            </Button>
            {Object.keys(typeColors).map((type) => (
              <Button
                key={type}
                variant={filterType === type ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bin
        </Button>
      </div>

      {/* Bin Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBins.map((bin) => (
          <Card key={bin.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-mono font-medium">{bin.code}</span>
                </div>
                <Badge variant={typeColors[bin.type]}>{bin.type}</Badge>
              </div>

              {/* Capacity Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Capacity</span>
                  <span>{bin.used}/{bin.capacity}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${getUtilizationLevel(bin)}`}
                    style={{ width: `${(bin.used / bin.capacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* Products */}
              {bin.products.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Products:</p>
                  {bin.products.slice(0, 2).map((product) => (
                    <div key={product.sku} className="flex items-center gap-2 text-sm">
                      <Package className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate flex-1">{product.name}</span>
                      <span className="text-muted-foreground">{product.quantity}</span>
                    </div>
                  ))}
                  {bin.products.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{bin.products.length - 2} more
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Empty bin</p>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-3 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBin(bin)}
                  className="flex-1"
                >
                  View
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditBin?.(bin)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteBin?.(bin.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBins.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No bins found matching your criteria
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Bin Location"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Zone</label>
              <Input placeholder="A" />
            </div>
            <div>
              <label className="text-sm font-medium">Aisle</label>
              <Input placeholder="01" />
            </div>
            <div>
              <label className="text-sm font-medium">Rack</label>
              <Input placeholder="01" />
            </div>
            <div>
              <label className="text-sm font-medium">Level</label>
              <Input placeholder="A" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Type</label>
            <select className="w-full mt-1 px-3 py-2 border rounded-md">
              <option value="standard">Standard</option>
              <option value="bulk">Bulk</option>
              <option value="pick">Pick</option>
              <option value="reserve">Reserve</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Capacity</label>
            <Input type="number" placeholder="100" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              onAddBin?.({});
              setIsModalOpen(false);
            }}>
              Add Bin
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
