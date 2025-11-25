'use client';

import { Button } from '@/components/ui';
import { Printer, Download, CheckCircle } from 'lucide-react';

interface QualityCertificateProps {
  certificateNumber: string;
  batchNumber: string;
  productName: string;
  productSku: string;
  quantity: number;
  unit: string;
  inspectionDate: string;
  expiryDate?: string;
  inspector: string;
  specifications: { name: string; required: string; actual: string; status: 'pass' | 'fail' }[];
  onPrint?: () => void;
  onDownload?: () => void;
}

const mockCertificate: QualityCertificateProps = {
  certificateNumber: 'QC-2024-00891',
  batchNumber: 'B-2024-089',
  productName: 'Widget Pro X100',
  productSku: 'FG-001',
  quantity: 500,
  unit: 'pcs',
  inspectionDate: '2024-11-24',
  expiryDate: '2025-11-24',
  inspector: 'Emily Davis',
  specifications: [
    { name: 'Dimension A (mm)', required: '50.0 ± 0.1', actual: '50.02', status: 'pass' },
    { name: 'Dimension B (mm)', required: '30.0 ± 0.05', actual: '29.98', status: 'pass' },
    { name: 'Weight (g)', required: '125 ± 2', actual: '124.5', status: 'pass' },
    { name: 'Surface Finish (Ra)', required: '≤ 1.6', actual: '1.2', status: 'pass' },
    { name: 'Hardness (HRC)', required: '58-62', actual: '60', status: 'pass' },
    { name: 'Visual Inspection', required: 'No defects', actual: 'Pass', status: 'pass' },
  ],
};

export function QualityCertificate({
  certificateNumber = mockCertificate.certificateNumber,
  batchNumber = mockCertificate.batchNumber,
  productName = mockCertificate.productName,
  productSku = mockCertificate.productSku,
  quantity = mockCertificate.quantity,
  unit = mockCertificate.unit,
  inspectionDate = mockCertificate.inspectionDate,
  expiryDate = mockCertificate.expiryDate,
  inspector = mockCertificate.inspector,
  specifications = mockCertificate.specifications,
  onPrint,
  onDownload,
}: Partial<QualityCertificateProps>) {
  const handlePrint = () => {
    window.print();
    onPrint?.();
  };

  const allPassed = specifications.every((spec) => spec.status === 'pass');

  return (
    <div>
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mb-4 print:hidden">
        <Button variant="outline" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      {/* Certificate */}
      <div className="bg-white p-8 border rounded-lg print:border-0 print:p-0">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-black">
          <h1 className="text-3xl font-bold">CERTIFICATE OF QUALITY</h1>
          <p className="text-lg mt-2">Certificate No: {certificateNumber}</p>
        </div>

        {/* Company Info */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold">Manufacturing Company Name</h2>
          <p className="text-sm text-muted-foreground">
            123 Manufacturing Street, City, State 12345
          </p>
          <p className="text-sm text-muted-foreground">
            ISO 9001:2015 Certified
          </p>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Product:</span>
              <span>{productName}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">SKU:</span>
              <span className="font-mono">{productSku}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Batch Number:</span>
              <span className="font-mono">{batchNumber}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Quantity:</span>
              <span>{quantity} {unit}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Inspection Date:</span>
              <span>{new Date(inspectionDate).toLocaleDateString()}</span>
            </div>
            {expiryDate && (
              <div className="flex justify-between border-b pb-1">
                <span className="font-medium">Valid Until:</span>
                <span>{new Date(expiryDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Specifications Table */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Test Results</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2">Parameter</th>
                <th className="text-center py-2">Specification</th>
                <th className="text-center py-2">Result</th>
                <th className="text-center py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {specifications.map((spec, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{spec.name}</td>
                  <td className="py-2 text-center">{spec.required}</td>
                  <td className="py-2 text-center font-medium">{spec.actual}</td>
                  <td className="py-2 text-center">
                    {spec.status === 'pass' ? (
                      <span className="text-success font-bold">✓ PASS</span>
                    ) : (
                      <span className="text-destructive font-bold">✗ FAIL</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Certification Statement */}
        <div className="mb-8 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm">
            This is to certify that the above-mentioned product has been inspected and tested
            in accordance with the applicable quality standards and specifications. The product
            {allPassed ? (
              <span className="font-bold text-success"> MEETS ALL REQUIREMENTS</span>
            ) : (
              <span className="font-bold text-destructive"> DOES NOT MEET ALL REQUIREMENTS</span>
            )}
            and is {allPassed ? 'approved' : 'not approved'} for release.
          </p>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-12">
          <div className="text-center">
            <div className="border-t border-black pt-2">
              <p className="font-medium">{inspector}</p>
              <p className="text-sm text-muted-foreground">Quality Inspector</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black pt-2">
              <p className="font-medium">Quality Manager</p>
              <p className="text-sm text-muted-foreground">Approved By</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
          <p>This certificate is valid only for the batch specified above.</p>
          <p>Document generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
