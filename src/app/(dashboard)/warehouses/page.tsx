'use client';

import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Breadcrumb,
} from '@/components/ui';
import { Plus, Warehouse, MapPin, Phone, Mail, Users } from 'lucide-react';

// Mock warehouse data
const warehouses = [
  {
    id: 'wh-001',
    code: 'WH-MAIN',
    name: 'Main Warehouse',
    type: 'MAIN',
    address: '123 Industrial Ave',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    manager: 'John Smith',
    phone: '+1 555-0100',
    email: 'main@warehouse.com',
    capacity: 10000,
    usedSpace: 7500,
    isActive: true,
  },
  {
    id: 'wh-002',
    code: 'WH-SEC',
    name: 'Secondary Warehouse',
    type: 'BRANCH',
    address: '456 Commerce St',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    manager: 'Jane Doe',
    phone: '+1 555-0200',
    email: 'secondary@warehouse.com',
    capacity: 5000,
    usedSpace: 3200,
    isActive: true,
  },
  {
    id: 'wh-003',
    code: 'WH-TRANSIT',
    name: 'Transit Hub',
    type: 'TRANSIT',
    address: '789 Logistics Blvd',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    manager: 'Bob Wilson',
    phone: '+1 555-0300',
    email: 'transit@warehouse.com',
    capacity: 2000,
    usedSpace: 800,
    isActive: true,
  },
  {
    id: 'wh-004',
    code: 'WH-QC',
    name: 'Quality Control',
    type: 'QUARANTINE',
    address: '321 Quality Lane',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    manager: 'Alice Brown',
    phone: '+1 555-0400',
    email: 'qc@warehouse.com',
    capacity: 1000,
    usedSpace: 450,
    isActive: true,
  },
];

const typeColors: Record<string, string> = {
  MAIN: 'bg-primary text-primary-foreground',
  BRANCH: 'bg-accent text-accent-foreground',
  TRANSIT: 'bg-warning text-warning-foreground',
  QUARANTINE: 'bg-destructive text-destructive-foreground',
};

export default function WarehousesPage() {
  const router = useRouter();

  const getCapacityPercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Warehouses</h1>
          <p className="text-muted-foreground">
            Manage your warehouse locations and capacity
          </p>
        </div>
        <Button onClick={() => router.push('/warehouses/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Warehouse
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Locations</p>
                <p className="text-2xl font-bold">{warehouses.length}</p>
              </div>
              <Warehouse className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Capacity</p>
                <p className="text-2xl font-bold">
                  {warehouses.reduce((sum, w) => sum + w.capacity, 0).toLocaleString()}
                </p>
              </div>
              <span className="text-sm text-muted-foreground">units</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Used Space</p>
                <p className="text-2xl font-bold">
                  {warehouses.reduce((sum, w) => sum + w.usedSpace, 0).toLocaleString()}
                </p>
              </div>
              <span className="text-sm text-muted-foreground">units</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Utilization</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    (warehouses.reduce((sum, w) => sum + w.usedSpace, 0) /
                      warehouses.reduce((sum, w) => sum + w.capacity, 0)) *
                      100
                  )}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {warehouses.map((warehouse) => {
          const capacityPct = getCapacityPercentage(warehouse.usedSpace, warehouse.capacity);

          return (
            <Card
              key={warehouse.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => router.push(`/warehouses/${warehouse.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {warehouse.name}
                      <Badge className={typeColors[warehouse.type]} size="sm">
                        {warehouse.type}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="font-mono">{warehouse.code}</CardDescription>
                  </div>
                  <Badge variant={warehouse.isActive ? 'success' : 'secondary'}>
                    {warehouse.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p>{warehouse.address}</p>
                    <p className="text-muted-foreground">
                      {warehouse.city}, {warehouse.state}, {warehouse.country}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{warehouse.manager}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{warehouse.phone}</span>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Capacity</span>
                    <span>
                      {warehouse.usedSpace.toLocaleString()} / {warehouse.capacity.toLocaleString()} ({capacityPct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getCapacityColor(capacityPct)} transition-all`}
                      style={{ width: `${capacityPct}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
