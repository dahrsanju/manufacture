'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Select,
  Breadcrumb,
  Badge,
} from '@/components/ui';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Truck,
  Package,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data
const warehouses = [
  { value: 'wh-001', label: 'Main Warehouse' },
  { value: 'wh-002', label: 'Secondary Warehouse' },
  { value: 'wh-003', label: 'Transit Hub' },
  { value: 'wh-004', label: 'Quality Control' },
];

const products = [
  { id: 'prod-001', sku: 'SKU-001', name: 'Widget Pro X100', stock: 1500 },
  { id: 'prod-002', sku: 'SKU-002', name: 'Component A-123', stock: 3200 },
  { id: 'prod-003', sku: 'SKU-003', name: 'Raw Material RM-001', stock: 500 },
  { id: 'prod-004', sku: 'SKU-004', name: 'Finished Product FP-01', stock: 800 },
];

interface TransferItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  availableStock: number;
}

export default function NewTransferPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [sourceWarehouse, setSourceWarehouse] = useState('');
  const [destWarehouse, setDestWarehouse] = useState('');
  const [transferItems, setTransferItems] = useState<TransferItem[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = (product: typeof products[0]) => {
    if (transferItems.find(item => item.productId === product.id)) {
      toast.error('Product already added');
      return;
    }
    setTransferItems([
      ...transferItems,
      {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        quantity: 1,
        availableStock: product.stock,
      },
    ]);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setTransferItems(
      transferItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setTransferItems(transferItems.filter(item => item.productId !== productId));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Stock transfer created successfully');
    router.push('/inventory/transfers');
  };

  const canProceed = () => {
    if (step === 1) return sourceWarehouse && destWarehouse && sourceWarehouse !== destWarehouse;
    if (step === 2) return transferItems.length > 0 && transferItems.every(item => item.quantity > 0 && item.quantity <= item.availableStock);
    return true;
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
          <h1 className="text-3xl font-bold">New Stock Transfer</h1>
          <p className="text-muted-foreground">Transfer inventory between warehouses</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                s < step
                  ? 'bg-success text-success-foreground'
                  : s === step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {s < step ? <Check className="h-5 w-5" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-20 h-1 mx-2 ${s < step ? 'bg-success' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-16 text-sm text-muted-foreground">
        <span>Locations</span>
        <span>Products</span>
        <span>Review</span>
      </div>

      {/* Step 1: Select Warehouses */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Select Locations
            </CardTitle>
            <CardDescription>Choose source and destination warehouses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Select
                  label="Source Warehouse"
                  options={warehouses.filter(w => w.value !== destWarehouse)}
                  value={sourceWarehouse}
                  onChange={(e) => setSourceWarehouse(e.target.value)}
                  placeholder="Select source..."
                />
              </div>
              <div>
                <Select
                  label="Destination Warehouse"
                  options={warehouses.filter(w => w.value !== sourceWarehouse)}
                  value={destWarehouse}
                  onChange={(e) => setDestWarehouse(e.target.value)}
                  placeholder="Select destination..."
                />
              </div>
            </div>
            {sourceWarehouse && destWarehouse && (
              <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <p className="font-medium">{warehouses.find(w => w.value === sourceWarehouse)?.label}</p>
                  <p className="text-xs text-muted-foreground">Source</p>
                </div>
                <Truck className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <p className="font-medium">{warehouses.find(w => w.value === destWarehouse)?.label}</p>
                  <p className="text-xs text-muted-foreground">Destination</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Products */}
      {step === 2 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Available Products
              </CardTitle>
              <CardDescription>Select products to transfer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => addItem(product)}
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{product.stock}</p>
                      <p className="text-xs text-muted-foreground">available</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transfer Items</CardTitle>
              <CardDescription>
                {transferItems.length} item(s) selected
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transferItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Click on products to add them to the transfer
                </p>
              ) : (
                <div className="space-y-3">
                  {transferItems.map((item) => (
                    <div key={item.productId} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.productId)}
                          className="text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          max={item.availableStock}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">
                          / {item.availableStock} available
                        </span>
                      </div>
                      {item.quantity > item.availableStock && (
                        <p className="text-xs text-destructive mt-1">Exceeds available stock</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Transfer</CardTitle>
            <CardDescription>Confirm the transfer details before submitting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Transfer Route */}
            <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <p className="font-medium">{warehouses.find(w => w.value === sourceWarehouse)?.label}</p>
                <p className="text-xs text-muted-foreground">Source</p>
              </div>
              <Truck className="h-6 w-6 text-primary" />
              <div className="text-center">
                <p className="font-medium">{warehouses.find(w => w.value === destWarehouse)?.label}</p>
                <p className="text-xs text-muted-foreground">Destination</p>
              </div>
            </div>

            {/* Items Summary */}
            <div>
              <h4 className="font-medium mb-3">Transfer Items</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Product</th>
                    <th className="text-right py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {transferItems.map((item) => (
                    <tr key={item.productId} className="border-b">
                      <td className="py-2">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                      </td>
                      <td className="py-2 text-right font-medium">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="py-2 font-medium">Total Items</td>
                    <td className="py-2 text-right font-bold">
                      {transferItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notes (optional)</label>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Add any notes for this transfer..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Transfer'}
            <Check className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
