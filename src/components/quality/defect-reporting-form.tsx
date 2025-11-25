'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { Camera, Upload, AlertTriangle, X } from 'lucide-react';

const defectSchema = z.object({
  workOrderId: z.string().min(1, 'Work order is required'),
  batchNumber: z.string().min(1, 'Batch number is required'),
  defectType: z.string().min(1, 'Defect type is required'),
  severity: z.enum(['minor', 'major', 'critical']),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  rootCause: z.string().optional(),
  correctiveAction: z.string().optional(),
});

type DefectFormData = z.infer<typeof defectSchema>;

interface DefectReportingFormProps {
  onSubmit?: (data: DefectFormData) => void;
  onCancel?: () => void;
}

const defectTypes = [
  'Dimensional Error',
  'Surface Defect',
  'Material Defect',
  'Assembly Error',
  'Functional Failure',
  'Cosmetic Issue',
  'Packaging Damage',
  'Other',
];

export function DefectReportingForm({ onSubmit, onCancel }: DefectReportingFormProps) {
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DefectFormData>({
    resolver: zodResolver(defectSchema),
    defaultValues: {
      severity: 'minor',
      quantity: 1,
    },
  });

  const severity = watch('severity');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onFormSubmit = (data: DefectFormData) => {
    onSubmit?.(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Report Defect
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Work Order & Batch */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Work Order *</label>
              <Input
                {...register('workOrderId')}
                placeholder="WO-2024-0891"
                className={errors.workOrderId ? 'border-destructive' : ''}
              />
              {errors.workOrderId && (
                <p className="text-xs text-destructive mt-1">{errors.workOrderId.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Batch Number *</label>
              <Input
                {...register('batchNumber')}
                placeholder="B-2024-089"
                className={errors.batchNumber ? 'border-destructive' : ''}
              />
              {errors.batchNumber && (
                <p className="text-xs text-destructive mt-1">{errors.batchNumber.message}</p>
              )}
            </div>
          </div>

          {/* Defect Type & Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Defect Type *</label>
              <select
                {...register('defectType')}
                className={`w-full mt-1 px-3 py-2 border rounded-md bg-background ${
                  errors.defectType ? 'border-destructive' : ''
                }`}
              >
                <option value="">Select type</option>
                {defectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.defectType && (
                <p className="text-xs text-destructive mt-1">{errors.defectType.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Severity *</label>
              <div className="flex gap-2 mt-1">
                {['minor', 'major', 'critical'].map((level) => (
                  <label
                    key={level}
                    className={`flex-1 py-2 px-3 border rounded-md text-center cursor-pointer text-sm ${
                      severity === level
                        ? level === 'critical'
                          ? 'bg-destructive text-white border-destructive'
                          : level === 'major'
                          ? 'bg-warning text-white border-warning'
                          : 'bg-secondary text-secondary-foreground border-secondary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('severity')}
                      value={level}
                      className="sr-only"
                    />
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-sm font-medium">Defective Quantity *</label>
            <Input
              type="number"
              {...register('quantity', { valueAsNumber: true })}
              min={1}
              className={errors.quantity ? 'border-destructive' : ''}
            />
            {errors.quantity && (
              <p className="text-xs text-destructive mt-1">{errors.quantity.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description *</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Describe the defect in detail..."
              className={`w-full mt-1 px-3 py-2 border rounded-md bg-background ${
                errors.description ? 'border-destructive' : ''
              }`}
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="text-sm font-medium">Attach Photos</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={img}
                    alt={`Defect ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 p-0.5 bg-destructive text-white rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-muted">
                <Camera className="h-6 w-6 text-muted-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Root Cause */}
          <div>
            <label className="text-sm font-medium">Root Cause (Optional)</label>
            <textarea
              {...register('rootCause')}
              rows={2}
              placeholder="Initial assessment of root cause..."
              className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
            />
          </div>

          {/* Corrective Action */}
          <div>
            <label className="text-sm font-medium">Corrective Action (Optional)</label>
            <textarea
              {...register('correctiveAction')}
              rows={2}
              placeholder="Recommended corrective action..."
              className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Submit Report
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
