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
  Badge,
  Breadcrumb,
} from '@/components/ui';
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  FileText,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

type ImportStep = 'upload' | 'mapping' | 'preview' | 'importing' | 'complete';

interface ImportRow {
  id: number;
  data: Record<string, string>;
  status: 'valid' | 'error' | 'warning';
  errors: string[];
}

// Mock imported data
const mockImportData: ImportRow[] = [
  { id: 1, data: { sku: 'SKU-101', name: 'Widget A', category: 'Components', price: '99.99', stock: '150' }, status: 'valid', errors: [] },
  { id: 2, data: { sku: 'SKU-102', name: 'Widget B', category: 'Components', price: '149.99', stock: '75' }, status: 'valid', errors: [] },
  { id: 3, data: { sku: 'SKU-103', name: 'Gadget X', category: 'Electronics', price: 'invalid', stock: '50' }, status: 'error', errors: ['Invalid price format'] },
  { id: 4, data: { sku: 'SKU-001', name: 'Existing Product', category: 'Components', price: '89.99', stock: '200' }, status: 'warning', errors: ['SKU already exists - will update'] },
  { id: 5, data: { sku: 'SKU-104', name: 'Assembly Kit', category: 'Kits', price: '299.99', stock: '25' }, status: 'valid', errors: [] },
];

const columnMappings = [
  { file: 'Product SKU', system: 'sku', required: true },
  { file: 'Product Name', system: 'name', required: true },
  { file: 'Category', system: 'category', required: false },
  { file: 'Price ($)', system: 'price', required: true },
  { file: 'Stock Qty', system: 'stock', required: false },
];

export default function ProductImportPage() {
  const router = useRouter();
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const [importProgress, setImportProgress] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      toast.success('File uploaded successfully');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      toast.success('File uploaded successfully');
    }
  };

  const handleNextStep = async () => {
    if (step === 'upload' && file) {
      setStep('mapping');
    } else if (step === 'mapping') {
      setImportData(mockImportData);
      setStep('preview');
    } else if (step === 'preview') {
      setStep('importing');
      // Simulate import progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setImportProgress(i);
      }
      setStep('complete');
    }
  };

  const validRows = importData.filter(r => r.status === 'valid' || r.status === 'warning');
  const errorRows = importData.filter(r => r.status === 'error');

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
          <h1 className="text-3xl font-bold">Import Products</h1>
          <p className="text-muted-foreground">Bulk import products from CSV or Excel file</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {['upload', 'mapping', 'preview', 'complete'].map((s, index) => {
          const stepIndex = ['upload', 'mapping', 'preview', 'importing', 'complete'].indexOf(step);
          const isActive = s === step || (s === 'complete' && step === 'importing');
          const isCompleted = ['upload', 'mapping', 'preview', 'importing', 'complete'].indexOf(s) < stepIndex;

          return (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-success text-white' :
                  isActive ? 'bg-primary text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className="text-xs mt-1 capitalize">{s === 'complete' ? 'Done' : s}</span>
              </div>
              {index < 3 && (
                <div className={`w-20 h-1 mx-2 ${isCompleted ? 'bg-success' : 'bg-muted'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>Upload a CSV or Excel file containing product data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                file ? 'border-success bg-success/5' : 'border-muted-foreground/25 hover:border-primary'
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-12 w-12 text-success mb-4" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                    className="mt-2"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="font-medium">Drag and drop your file here</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <span className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                      Browse Files
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Download Template */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Download Template</p>
                  <p className="text-sm text-muted-foreground">Use our template for best results</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNextStep} disabled={!file}>
                Next: Map Columns
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'mapping' && (
        <Card>
          <CardHeader>
            <CardTitle>Map Columns</CardTitle>
            <CardDescription>Match your file columns to system fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {columnMappings.map((mapping) => (
                <div key={mapping.system} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{mapping.file}</span>
                    {mapping.required && (
                      <Badge variant="secondary" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <select className="px-3 py-1.5 border rounded-md text-sm bg-background">
                      <option value={mapping.system}>{mapping.system}</option>
                      <option value="">-- Skip --</option>
                    </select>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button onClick={handleNextStep}>
                Next: Preview Data
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'preview' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Preview Import</CardTitle>
                <CardDescription>Review data before importing</CardDescription>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-success">{validRows.length} valid</span>
                <span className="text-destructive">{errorRows.length} errors</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="text-left py-2 px-3">SKU</th>
                    <th className="text-left py-2 px-3">Name</th>
                    <th className="text-left py-2 px-3">Category</th>
                    <th className="text-right py-2 px-3">Price</th>
                    <th className="text-right py-2 px-3">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {importData.map((row) => (
                    <tr key={row.id} className={`border-b ${row.status === 'error' ? 'bg-destructive/5' : row.status === 'warning' ? 'bg-warning/5' : ''}`}>
                      <td className="py-2 px-3">
                        {row.status === 'valid' && <CheckCircle className="h-4 w-4 text-success" />}
                        {row.status === 'error' && <XCircle className="h-4 w-4 text-destructive" />}
                        {row.status === 'warning' && <AlertTriangle className="h-4 w-4 text-warning" />}
                      </td>
                      <td className="py-2 px-3 font-mono">{row.data.sku}</td>
                      <td className="py-2 px-3">{row.data.name}</td>
                      <td className="py-2 px-3">{row.data.category}</td>
                      <td className="py-2 px-3 text-right">{row.data.price}</td>
                      <td className="py-2 px-3 text-right">{row.data.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {errorRows.length > 0 && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="font-medium text-destructive mb-2">Errors Found</p>
                <ul className="text-sm space-y-1">
                  {errorRows.map((row) => (
                    <li key={row.id}>Row {row.id}: {row.errors.join(', ')}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('mapping')}>
                Back
              </Button>
              <Button onClick={handleNextStep} disabled={errorRows.length > 0}>
                Import {validRows.length} Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'importing' && (
        <Card>
          <CardContent className="py-12 text-center">
            <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">Importing Products...</p>
            <p className="text-muted-foreground mb-4">Please wait while we process your data</p>
            <div className="max-w-xs mx-auto">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{importProgress}%</p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'complete' && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <p className="text-2xl font-bold mb-2">Import Complete!</p>
            <p className="text-muted-foreground mb-6">
              Successfully imported {validRows.length} products
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => router.push('/inventory/products')}>
                View Products
              </Button>
              <Button onClick={() => {
                setStep('upload');
                setFile(null);
                setImportData([]);
              }}>
                Import More
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
