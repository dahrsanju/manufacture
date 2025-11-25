'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Breadcrumb,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui';
import { ArrowLeft, Save } from 'lucide-react';
import { productService } from '@/services';
import toast from 'react-hot-toast';

// Validation schema
const productSchema = z.object({
  sku: z.string().min(1, 'SKU is required').max(50),
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  barcode: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  cost: z.number().min(0, 'Cost must be positive'),
  taxRate: z.number().min(0).max(100).optional(),
  unit: z.string().optional(),
  minStock: z.number().int().min(0).optional(),
  maxStock: z.number().int().min(0).optional(),
  reorderPoint: z.number().int().min(0).optional(),
  leadTime: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'components', label: 'Components' },
  { value: 'raw-materials', label: 'Raw Materials' },
  { value: 'finished-goods', label: 'Finished Goods' },
  { value: 'packaging', label: 'Packaging' },
];

const units = [
  { value: 'PC', label: 'Piece (PC)' },
  { value: 'KG', label: 'Kilogram (KG)' },
  { value: 'L', label: 'Liter (L)' },
  { value: 'M', label: 'Meter (M)' },
  { value: 'BOX', label: 'Box' },
  { value: 'SET', label: 'Set' },
];

export default function NewProductPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      unit: 'PC',
      taxRate: 0,
      minStock: 0,
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => productService.createProduct(data),
    onSuccess: (product) => {
      toast.success('Product created successfully');
      router.push(`/inventory/products/${product.id}`);
    },
    onError: () => {
      toast.error('Failed to create product');
    },
  });

  const onSubmit = (data: ProductFormData) => {
    createMutation.mutate(data);
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
          <h1 className="text-3xl font-bold">New Product</h1>
          <p className="text-muted-foreground">Add a new product to your inventory</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the product details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="SKU *"
                    placeholder="e.g., PROD-001"
                    error={errors.sku?.message}
                    {...register('sku')}
                  />
                  <Input
                    label="Barcode"
                    placeholder="e.g., 1234567890123"
                    error={errors.barcode?.message}
                    {...register('barcode')}
                  />
                </div>

                <Input
                  label="Product Name *"
                  placeholder="Enter product name"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Select
                    label="Category"
                    options={categories}
                    placeholder="Select category"
                    {...register('category')}
                  />
                  <Input
                    label="Brand"
                    placeholder="Enter brand name"
                    {...register('brand')}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">Description</label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Enter product description"
                    {...register('description')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set product pricing and costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    type="number"
                    step="0.01"
                    label="Price *"
                    placeholder="0.00"
                    error={errors.price?.message}
                    {...register('price', { valueAsNumber: true })}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    label="Cost *"
                    placeholder="0.00"
                    error={errors.cost?.message}
                    {...register('cost', { valueAsNumber: true })}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    type="number"
                    step="0.01"
                    label="Tax Rate (%)"
                    placeholder="0"
                    error={errors.taxRate?.message}
                    {...register('taxRate', { valueAsNumber: true })}
                  />
                  <Select
                    label="Unit of Measure"
                    options={units}
                    {...register('unit')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Settings</CardTitle>
                <CardDescription>Configure stock management rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    type="number"
                    label="Minimum Stock"
                    placeholder="0"
                    error={errors.minStock?.message}
                    {...register('minStock', { valueAsNumber: true })}
                  />
                  <Input
                    type="number"
                    label="Maximum Stock"
                    placeholder="Optional"
                    {...register('maxStock', { valueAsNumber: true })}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    type="number"
                    label="Reorder Point"
                    placeholder="Optional"
                    {...register('reorderPoint', { valueAsNumber: true })}
                  />
                  <Input
                    type="number"
                    label="Lead Time (days)"
                    placeholder="Optional"
                    {...register('leadTime', { valueAsNumber: true })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="h-4 w-4 rounded border-input"
                    {...register('isActive')}
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Product is active and available
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting || createMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}
