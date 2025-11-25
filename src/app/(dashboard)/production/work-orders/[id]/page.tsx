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
  Play,
  Pause,
  CheckCircle2,
  Package,
  Clock,
  Users,
  AlertTriangle,
  FileText,
} from 'lucide-react';

// Mock work order detail data
const workOrderData = {
  id: 'wo-001',
  orderNumber: 'WO-2024-0891',
  productName: 'Widget Pro X100',
  productSku: 'SKU-001',
  quantity: 500,
  completedQty: 350,
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  startDate: '2024-11-20',
  dueDate: '2024-11-25',
  assignee: 'John Smith',
  warehouse: 'Main Warehouse',
  notes: 'Rush order for client ABC Corp. Requires priority handling.',
  materials: [
    { id: '1', name: 'Raw Material A', required: 1000, allocated: 1000, consumed: 700, unit: 'pcs' },
    { id: '2', name: 'Component B', required: 500, allocated: 500, consumed: 350, unit: 'pcs' },
    { id: '3', name: 'Fastener C', required: 2000, allocated: 2000, consumed: 1400, unit: 'pcs' },
  ],
  operations: [
    { id: '1', name: 'Cutting', sequence: 1, status: 'COMPLETED', duration: '2h', operator: 'Mike Johnson' },
    { id: '2', name: 'Assembly', sequence: 2, status: 'IN_PROGRESS', duration: '4h', operator: 'Sarah Lee' },
    { id: '3', name: 'Quality Check', sequence: 3, status: 'PENDING', duration: '1h', operator: 'Tom Brown' },
    { id: '4', name: 'Packaging', sequence: 4, status: 'PENDING', duration: '1h', operator: 'Lisa Chen' },
  ],
  timeline: [
    { id: '1', event: 'Work order created', time: '2024-11-19 09:00', user: 'Admin' },
    { id: '2', event: 'Materials allocated', time: '2024-11-19 14:00', user: 'John Smith' },
    { id: '3', event: 'Production started', time: '2024-11-20 08:00', user: 'John Smith' },
    { id: '4', event: 'Cutting operation completed', time: '2024-11-20 10:00', user: 'Mike Johnson' },
    { id: '5', event: 'Assembly operation started', time: '2024-11-20 10:30', user: 'Sarah Lee' },
  ],
};

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  IN_PROGRESS: { label: 'In Progress', variant: 'default' },
  ON_HOLD: { label: 'On Hold', variant: 'warning' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Low', color: 'text-muted-foreground' },
  MEDIUM: { label: 'Medium', color: 'text-primary' },
  HIGH: { label: 'High', color: 'text-warning' },
  URGENT: { label: 'Urgent', color: 'text-destructive' },
};

export default function WorkOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workOrder = workOrderData;

  const progressPct = Math.round((workOrder.completedQty / workOrder.quantity) * 100);

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
              <h1 className="text-3xl font-bold font-mono">{workOrder.orderNumber}</h1>
              <Badge variant={statusConfig[workOrder.status].variant}>
                {statusConfig[workOrder.status].label}
              </Badge>
              <span className={`text-sm font-medium ${priorityConfig[workOrder.priority].color}`}>
                {priorityConfig[workOrder.priority].label} Priority
              </span>
            </div>
            <p className="text-muted-foreground">{workOrder.productName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {workOrder.status === 'IN_PROGRESS' && (
            <Button variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          {workOrder.status === 'PENDING' && (
            <Button>
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push(`/production/work-orders/${params.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Progress Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Production Progress</p>
              <p className="text-3xl font-bold">
                {workOrder.completedQty} / {workOrder.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-primary">{progressPct}%</p>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                progressPct === 100 ? 'bg-success' : 'bg-primary'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Product</p>
                <p className="font-medium">{workOrder.productSku}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">{new Date(workOrder.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Assignee</p>
                <p className="font-medium">{workOrder.assignee}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Warehouse</p>
                <p className="font-medium">{workOrder.warehouse}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="operations">
        <TabsList>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Operations Tab */}
        <TabsContent value="operations">
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Production steps and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workOrder.operations.map((op, index) => (
                  <div
                    key={op.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      op.status === 'IN_PROGRESS' ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      op.status === 'COMPLETED' ? 'bg-success text-success-foreground' :
                      op.status === 'IN_PROGRESS' ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {op.status === 'COMPLETED' ? <CheckCircle2 className="h-4 w-4" /> : op.sequence}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{op.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {op.operator} • {op.duration}
                      </p>
                    </div>
                    <Badge variant={statusConfig[op.status]?.variant || 'secondary'}>
                      {statusConfig[op.status]?.label || op.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Bill of Materials</CardTitle>
              <CardDescription>Required materials and consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Material</th>
                    <th className="text-right py-3 px-4 font-medium">Required</th>
                    <th className="text-right py-3 px-4 font-medium">Allocated</th>
                    <th className="text-right py-3 px-4 font-medium">Consumed</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workOrder.materials.map((mat) => {
                    const consumedPct = Math.round((mat.consumed / mat.required) * 100);
                    const isShort = mat.allocated < mat.required;
                    return (
                      <tr key={mat.id} className="border-b">
                        <td className="py-3 px-4 font-medium">{mat.name}</td>
                        <td className="py-3 px-4 text-right">{mat.required} {mat.unit}</td>
                        <td className={`py-3 px-4 text-right ${isShort ? 'text-destructive' : ''}`}>
                          {mat.allocated} {mat.unit}
                        </td>
                        <td className="py-3 px-4 text-right">{mat.consumed} {mat.unit}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${consumedPct}%` }}
                              />
                            </div>
                            <span className="text-xs">{consumedPct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>History of work order events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l-2 border-muted space-y-6">
                {workOrder.timeline.map((event, index) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">{event.event}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.time} • {event.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notes */}
      {workOrder.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{workOrder.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
