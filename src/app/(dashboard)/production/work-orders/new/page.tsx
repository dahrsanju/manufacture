'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Breadcrumb,
} from '@/components/ui';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

// Validation schema
const workOrderSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  priority: z.string().min(1, 'Priority is required'),
  warehouseId: z.string().min(1, 'Warehouse is required'),
  assigneeId: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

const products = [
  { value: 'prod-001', label: 'Widget Pro X100 (SKU-001)' },
  { value: 'prod-002', label: 'Component A-123 (SKU-002)' },
  { value: 'prod-003', label: 'Assembly Kit AK-50 (SKU-003)' },
  { value: 'prod-004', label: 'Finished Product FP-01 (SKU-004)' },
];

const warehouses = [
  { value: 'wh-001', label: 'Main Warehouse' },
  { value: 'wh-002', label: 'Secondary Warehouse' },
];

const priorities = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

const assignees = [
  { value: 'user-001', label: 'John Smith' },
  { value: 'user-002', label: 'Jane Doe' },
  { value: 'user-003', label: 'Bob Wilson' },
  { value: 'user-004', label: 'Alice Brown' },
];

export default function NewWorkOrderPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      priority: 'MEDIUM',
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: WorkOrderFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Work order created successfully');
    router.push('/production/work-orders');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Work Order</h1>
          <p className="text-muted-foreground">Create a new production work order</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Select product and quantity to produce</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Product *"
                options={products}
                error={errors.productId?.message}
                {...register('productId')}
              />
              <Input
                type="number"
                label="Quantity *"
                placeholder="Enter quantity"
                error={errors.quantity?.message}
                {...register('quantity', { valueAsNumber: true })}
              />
              <Select
                label="Priority *"
                options={priorities}
                error={errors.priority?.message}
                {...register('priority')}
              />
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
              <CardDescription>Set location and responsible person</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Warehouse *"
                options={warehouses}
                error={errors.warehouseId?.message}
                {...register('warehouseId')}
              />
              <Select
                label="Assignee"
                options={assignees}
                placeholder="Select assignee (optional)"
                {...register('assigneeId')}
              />
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>Set production timeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="date"
                label="Start Date *"
                error={errors.startDate?.message}
                {...register('startDate')}
              />
              <Input
                type="date"
                label="Due Date *"
                error={errors.dueDate?.message}
                {...register('dueDate')}
              />
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Add notes or special instructions</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter any notes or special instructions..."
                  {...register('notes')}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Creating...' : 'Create Work Order'}
          </Button>
        </div>
      </form>
    </div>
  );
}
