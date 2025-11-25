'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

interface BomImportExportProps {
  bomId?: string;
  bomName?: string;
  onImport?: (file: File, format: string) => Promise<ImportResult>;
  onExport?: (format: string) => void;
}

const exportFormats = [
  { id: 'csv', name: 'CSV', description: 'Comma-separated values' },
  { id: 'xlsx', name: 'Excel', description: 'Microsoft Excel format' },
  { id: 'json', name: 'JSON', description: 'JavaScript Object Notation' },
  { id: 'xml', name: 'XML', description: 'Extensible Markup Language' },
];

export function BomImportExport({
  bomId,
  bomName,
  onImport,
  onExport,
}: BomImportExportProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('export');
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [dragActive, setDragActive] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImportFile(e.dataTransfer.files[0]);
      setImportResult(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!importFile || !onImport) return;
    setImporting(true);
    try {
      const result = await onImport(importFile, selectedFormat);
      setImportResult(result);
    } catch (error) {
      setImportResult({
        success: 0,
        failed: 1,
        errors: ['Import failed. Please check the file format.'],
      });
    } finally {
      setImporting(false);
    }
  };

  const handleExport = () => {
    onExport?.(selectedFormat);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          BOM Import/Export
        </CardTitle>
        {bomName && (
          <p className="text-sm text-muted-foreground">{bomName}</p>
        )}
      </CardHeader>
      <CardContent>
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'export' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('export')}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button
            variant={activeTab === 'import' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('import')}
          >
            <Upload className="h-4 w-4 mr-1" />
            Import
          </Button>
        </div>

        {activeTab === 'export' ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select a format to export the BOM data
            </p>
            <div className="grid grid-cols-2 gap-3">
              {exportFormats.map((format) => (
                <div
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    selectedFormat === format.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="font-medium">{format.name}</span>
                  <p className="text-xs text-muted-foreground">{format.description}</p>
                </div>
              ))}
            </div>
            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export as {exportFormats.find((f) => f.id === selectedFormat)?.name}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
            >
              <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium">
                Drag and drop your file here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.json,.xml"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ position: 'relative' }}
              />
            </div>

            {/* Selected File */}
            {importFile && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">{importFile.name}</span>
                  <Badge variant="outline">
                    {(importFile.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setImportFile(null);
                    setImportResult(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Import Result */}
            {importResult && (
              <div className={`p-4 rounded-lg ${
                importResult.failed === 0 ? 'bg-success/10' : 'bg-destructive/10'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {importResult.failed === 0 ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                  <span className="font-medium">
                    {importResult.failed === 0 ? 'Import Successful' : 'Import Completed with Errors'}
                  </span>
                </div>
                <p className="text-sm">
                  {importResult.success} items imported successfully
                  {importResult.failed > 0 && `, ${importResult.failed} failed`}
                </p>
                {importResult.errors.length > 0 && (
                  <ul className="mt-2 text-xs text-destructive">
                    {importResult.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Format Selection */}
            <div>
              <label className="text-sm font-medium">File Format</label>
              <div className="flex gap-2 mt-2">
                {exportFormats.map((format) => (
                  <Button
                    key={format.id}
                    variant={selectedFormat === format.id ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFormat(format.id)}
                  >
                    {format.name}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleImport}
              disabled={!importFile || importing}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? 'Importing...' : 'Import BOM'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
