'use client';

import { useState } from 'react';
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
  Copy,
  Trash2,
  Package,
  Layers,
  DollarSign,
  Clock,
  User,
  Plus,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

// Mock BOM detail data
const bomDetail = {
  id: 'bom-001',
  name: 'Widget Pro X100 Assembly',
  productSku: 'SKU-001',
  productName: 'Widget Pro X100',
  version: '2.1',
  status: 'ACTIVE',
  description: 'Complete assembly BOM for Widget Pro X100 including all sub-assemblies and raw materials.',
  totalCost: 45.50,
  laborCost: 12.00,
  overheadCost: 5.50,
  lastModified: '2024-11-20',
  createdAt: '2024-08-15',
  createdBy: 'John Smith',
  modifiedBy: 'Jane Doe',
  notes: 'Updated component quantities for Q4 production run.',
};

const components = [
  {
    id: 'comp-001',
    sku: 'RAW-001',
    name: 'Steel Plate 10mm',
    category: 'Raw Material',
    quantity: 2,
    unit: 'pcs',
    unitCost: 8.50,
    totalCost: 17.00,
    leadTime: 3,
    supplier: 'Steel Corp',
    inStock: 150,
    required: 200,
  },
  {
    id: 'comp-002',
    sku: 'RAW-002',
    name: 'Aluminum Rod 5mm',
    category: 'Raw Material',
    quantity: 4,
    unit: 'pcs',
    unitCost: 2.25,
    totalCost: 9.00,
    leadTime: 2,
    supplier: 'Metal Supplies Inc',
    inStock: 500,
    required: 400,
  },
  {
    id: 'comp-003',
    sku: 'COMP-001',
    name: 'Bearing Assembly',
    category: 'Component',
    quantity: 2,
    unit: 'pcs',
    unitCost: 4.50,
    totalCost: 9.00,
    leadTime: 5,
    supplier: 'Precision Parts',
    inStock: 80,
    required: 200,
  },
  {
    id: 'comp-004',
    sku: 'COMP-002',
    name: 'Control Circuit Board',
    category: 'Component',
    quantity: 1,
    unit: 'pcs',
    unitCost: 6.00,
    totalCost: 6.00,
    leadTime: 7,
    supplier: 'Electronics Pro',
    inStock: 45,
    required: 100,
  },
  {
    id: 'comp-005',
    sku: 'CONS-001',
    name: 'Screws M4x10',
    category: 'Consumable',
    quantity: 8,
    unit: 'pcs',
    unitCost: 0.05,
    totalCost: 0.40,
    leadTime: 1,
    supplier: 'Hardware World',
    inStock: 5000,
    required: 800,
  },
  {
    id: 'comp-006',
    sku: 'CONS-002',
    name: 'Lubricant Grease',
    category: 'Consumable',
    quantity: 10,
    unit: 'ml',
    unitCost: 0.01,
    totalCost: 0.10,
    leadTime: 1,
    supplier: 'Chemical Supplies',
    inStock: 10000,
    required: 1000,
  },
];

const revisionHistory = [
  {
    version: '2.1',
    date: '2024-11-20',
    author: 'Jane Doe',
    changes: 'Updated steel plate quantity from 3 to 2',
  },
  {
    version: '2.0',
    date: '2024-10-15',
    author: 'John Smith',
    changes: 'Added control circuit board, removed manual switch',
  },
  {
    version: '1.5',
    date: '2024-09-01',
    author: 'John Smith',
    changes: 'Optimized bearing assembly specifications',
  },
  {
    version: '1.0',
    date: '2024-08-15',
    author: 'John Smith',
    changes: 'Initial BOM creation',
  },
];

const whereUsed = [
  { id: 'wo-001', type: 'Work Order', reference: 'WO-2024-0890', status: 'In Progress', quantity: 50 },
  { id: 'wo-002', type: 'Work Order', reference: 'WO-2024-0875', status: 'Completed', quantity: 100 },
  { id: 'wo-003', type: 'Sales Order', reference: 'SO-2024-1234', status: 'Pending', quantity: 25 },
];

const statusConfig: Record<string, { label: string; variant: 'success' | 'secondary' | 'warning' }> = {
  ACTIVE: { label: 'Active', variant: 'success' },
  DRAFT: { label: 'Draft', variant: 'warning' },
  ARCHIVED: { label: 'Archived', variant: 'secondary' },
};

export default function BOMDetailPage() {
  const router = useRouter();
  const params = useParams();

  const materialCost = components.reduce((sum, c) => sum + c.totalCost, 0);
  const totalComponents = components.length;
  const lowStockItems = components.filter(c => c.inStock < c.required);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{bomDetail.name}</h1>
              <Badge variant={statusConfig[bomDetail.status].variant}>
                {statusConfig[bomDetail.status].label}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {bomDetail.productName} ({bomDetail.productSku}) • Version {bomDetail.version}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Components</p>
                <p className="text-2xl font-bold">{totalComponents}</p>
              </div>
              <Layers className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Material Cost</p>
                <p className="text-2xl font-bold">${materialCost.toFixed(2)}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold">${bomDetail.totalCost.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${lowStockItems.length > 0 ? 'text-warning' : 'text-muted-foreground'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="components">
        <TabsList>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="costs">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="history">Revision History</TabsTrigger>
          <TabsTrigger value="where-used">Where Used</TabsTrigger>
        </TabsList>

        {/* Components Tab */}
        <TabsContent value="components">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Component List</CardTitle>
                  <CardDescription>Materials and parts required for assembly</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Component
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Component</th>
                      <th className="text-left py-3 px-4 font-medium">Category</th>
                      <th className="text-right py-3 px-4 font-medium">Qty</th>
                      <th className="text-right py-3 px-4 font-medium">Unit Cost</th>
                      <th className="text-right py-3 px-4 font-medium">Total</th>
                      <th className="text-left py-3 px-4 font-medium">Stock Status</th>
                      <th className="text-left py-3 px-4 font-medium">Supplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {components.map((comp) => {
                      const isLowStock = comp.inStock < comp.required;
                      return (
                        <tr key={comp.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{comp.name}</p>
                              <p className="text-sm text-muted-foreground">{comp.sku}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary">{comp.category}</Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {comp.quantity} {comp.unit}
                          </td>
                          <td className="py-3 px-4 text-right">${comp.unitCost.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-medium">${comp.totalCost.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <div className={isLowStock ? 'text-warning' : 'text-success'}>
                              <p className="font-medium">{comp.inStock} in stock</p>
                              <p className="text-xs">{comp.required} required</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{comp.supplier}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/50">
                      <td colSpan={4} className="py-3 px-4 font-medium text-right">Total Material Cost:</td>
                      <td className="py-3 px-4 text-right font-bold">${materialCost.toFixed(2)}</td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost Breakdown Tab */}
        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
              <CardDescription>Detailed cost analysis for this BOM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Material Cost</span>
                    <span className="font-medium">${materialCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Labor Cost</span>
                    <span className="font-medium">${bomDetail.laborCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Overhead Cost</span>
                    <span className="font-medium">${bomDetail.overheadCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 bg-muted/50 px-2 rounded">
                    <span className="font-bold">Total Unit Cost</span>
                    <span className="font-bold text-lg">${bomDetail.totalCost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 pt-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Cost by Category</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Raw Materials</span>
                        <span>$26.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Components</span>
                        <span>$15.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Consumables</span>
                        <span>$0.50</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Cost Trends</p>
                    <div className="mt-3">
                      <p className="text-lg font-bold text-success">-5.2%</p>
                      <p className="text-xs text-muted-foreground">vs. previous version</p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Margin Analysis</p>
                    <div className="mt-3">
                      <p className="text-lg font-bold">38.5%</p>
                      <p className="text-xs text-muted-foreground">at $74.00 selling price</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revision History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Revision History</CardTitle>
              <CardDescription>Track changes made to this BOM over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revisionHistory.map((rev, index) => (
                  <div key={rev.version} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted-foreground'}`} />
                      {index < revisionHistory.length - 1 && (
                        <div className="w-px h-full bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={index === 0 ? 'default' : 'secondary'}>v{rev.version}</Badge>
                          <span className="text-sm text-muted-foreground">{rev.date}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{rev.author}</span>
                      </div>
                      <p className="mt-1 text-sm">{rev.changes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Where Used Tab */}
        <TabsContent value="where-used">
          <Card>
            <CardHeader>
              <CardTitle>Where Used</CardTitle>
              <CardDescription>Orders and work orders using this BOM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {whereUsed.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{item.type}</Badge>
                      <span className="font-medium">{item.reference}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">Qty: {item.quantity}</span>
                      <Badge variant={item.status === 'Completed' ? 'success' : item.status === 'In Progress' ? 'default' : 'warning'}>
                        {item.status}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Metadata */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4 text-sm">
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{new Date(bomDetail.createdAt).toLocaleDateString()}</p>
              <p className="text-muted-foreground">{bomDetail.createdBy}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Modified</p>
              <p className="font-medium">{new Date(bomDetail.lastModified).toLocaleDateString()}</p>
              <p className="text-muted-foreground">{bomDetail.modifiedBy}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground">Notes</p>
              <p>{bomDetail.notes}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
