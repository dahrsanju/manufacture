'use client';

import { useRouter, useParams } from 'next/navigation';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Breadcrumb,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui';
import {
  ArrowLeft,
  Edit,
  MapPin,
  Phone,
  Mail,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
} from 'lucide-react';

// Mock warehouse data
const warehouseData = {
  id: 'wh-001',
  code: 'WH-MAIN',
  name: 'Main Warehouse',
  type: 'MAIN',
  address: '123 Industrial Ave',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'USA',
  manager: 'John Smith',
  phone: '+1 555-0100',
  email: 'main@warehouse.com',
  capacity: 10000,
  usedSpace: 7500,
  isActive: true,
  zones: [
    { id: 'z-1', name: 'Zone A - Raw Materials', bins: 50, usedBins: 45 },
    { id: 'z-2', name: 'Zone B - Components', bins: 100, usedBins: 78 },
    { id: 'z-3', name: 'Zone C - Finished Goods', bins: 75, usedBins: 60 },
    { id: 'z-4', name: 'Zone D - Shipping', bins: 25, usedBins: 15 },
  ],
  stockItems: [
    { id: '1', sku: 'SKU-001', name: 'Widget Pro X100', quantity: 1500, location: 'A-01-01' },
    { id: '2', sku: 'SKU-002', name: 'Component A-123', quantity: 3200, location: 'B-02-05' },
    { id: '3', sku: 'SKU-003', name: 'Raw Material RM-001', quantity: 500, location: 'A-03-02' },
    { id: '4', sku: 'SKU-004', name: 'Finished Product FP-01', quantity: 800, location: 'C-01-01' },
    { id: '5', sku: 'SKU-005', name: 'Packaging Box PB-100', quantity: 2000, location: 'D-01-01' },
  ],
  recentActivity: [
    { id: '1', action: 'Stock Received', item: 'SKU-001', quantity: '+500', time: '2 hours ago' },
    { id: '2', action: 'Stock Transferred', item: 'SKU-003', quantity: '-200', time: '4 hours ago' },
    { id: '3', action: 'Bin Relocated', item: 'SKU-002', quantity: '3200', time: '1 day ago' },
    { id: '4', action: 'Stock Picked', item: 'SKU-004', quantity: '-100', time: '1 day ago' },
  ],
};

const typeColors: Record<string, string> = {
  MAIN: 'bg-primary text-primary-foreground',
  BRANCH: 'bg-accent text-accent-foreground',
  TRANSIT: 'bg-warning text-warning-foreground',
  QUARANTINE: 'bg-destructive text-destructive-foreground',
};

export default function WarehouseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const warehouse = warehouseData;

  const capacityPct = Math.round((warehouse.usedSpace / warehouse.capacity) * 100);

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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{warehouse.name}</h1>
              <Badge className={typeColors[warehouse.type]}>{warehouse.type}</Badge>
              <Badge variant={warehouse.isActive ? 'success' : 'secondary'}>
                {warehouse.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-muted-foreground font-mono">{warehouse.code}</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/warehouses/${params.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Warehouse
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Capacity</p>
                <p className="text-2xl font-bold">{warehouse.capacity.toLocaleString()}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Used Space</p>
                <p className="text-2xl font-bold">{warehouse.usedSpace.toLocaleString()}</p>
              </div>
              <span className="text-sm text-muted-foreground">{capacityPct}%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Zones</p>
                <p className="text-2xl font-bold">{warehouse.zones.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stock Items</p>
                <p className="text-2xl font-bold">{warehouse.stockItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="zones">Zones & Bins</TabsTrigger>
          <TabsTrigger value="stock">Stock Levels</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Warehouse Info */}
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {warehouse.address}<br />
                      {warehouse.city}, {warehouse.state} {warehouse.zipCode}<br />
                      {warehouse.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Manager</p>
                    <p className="text-sm text-muted-foreground">{warehouse.manager}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{warehouse.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{warehouse.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capacity Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Capacity Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Utilization</span>
                    <span className="font-medium">{capacityPct}%</span>
                  </div>
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getCapacityColor(capacityPct)} transition-all`}
                      style={{ width: `${capacityPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {warehouse.usedSpace.toLocaleString()} / {warehouse.capacity.toLocaleString()} units
                  </p>
                </div>

                {warehouse.zones.map((zone) => {
                  const zonePct = Math.round((zone.usedBins / zone.bins) * 100);
                  return (
                    <div key={zone.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{zone.name}</span>
                        <span>{zonePct}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getCapacityColor(zonePct)} transition-all`}
                          style={{ width: `${zonePct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Zones Tab */}
        <TabsContent value="zones">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Zones & Bins</CardTitle>
                <CardDescription>Manage warehouse zones and bin locations</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Zone
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {warehouse.zones.map((zone) => {
                  const zonePct = Math.round((zone.usedBins / zone.bins) * 100);
                  return (
                    <div
                      key={zone.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="font-medium">{zone.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {zone.usedBins} / {zone.bins} bins used
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getCapacityColor(zonePct)} transition-all`}
                              style={{ width: `${zonePct}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{zonePct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Tab */}
        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>Stock Levels</CardTitle>
              <CardDescription>Current inventory in this warehouse</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">SKU</th>
                      <th className="text-left py-3 px-4 font-medium">Product Name</th>
                      <th className="text-right py-3 px-4 font-medium">Quantity</th>
                      <th className="text-left py-3 px-4 font-medium">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warehouse.stockItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-xs">{item.sku}</td>
                        <td className="py-3 px-4">{item.name}</td>
                        <td className="py-3 px-4 text-right font-medium">
                          {item.quantity.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs">{item.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest operations in this warehouse</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {warehouse.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.quantity.startsWith('+') ? 'bg-success' :
                        activity.quantity.startsWith('-') ? 'bg-destructive' : 'bg-primary'
                      }`} />
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.item}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        activity.quantity.startsWith('+') ? 'text-success' :
                        activity.quantity.startsWith('-') ? 'text-destructive' : ''
                      }`}>
                        {activity.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
