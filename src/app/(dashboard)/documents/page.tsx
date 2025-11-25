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
  Input,
  Breadcrumb,
} from '@/components/ui';
import {
  Plus,
  Search,
  Upload,
  Download,
  FileText,
  Image,
  FileSpreadsheet,
  File,
  Folder,
  MoreVertical,
  Trash2,
  Eye,
  Share2,
  Clock,
  User,
  Grid,
  List,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'spreadsheet' | 'document' | 'other';
  size: string;
  folder: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
}

// Mock documents
const documents: Document[] = [
  {
    id: 'doc-001',
    name: 'Product Specifications Q4.pdf',
    type: 'pdf',
    size: '2.4 MB',
    folder: 'Products',
    uploadedBy: 'John Smith',
    uploadedAt: '2024-11-20T10:30:00',
    tags: ['specs', 'q4', 'products'],
  },
  {
    id: 'doc-002',
    name: 'Supplier Contract - Steel Corp.pdf',
    type: 'pdf',
    size: '1.8 MB',
    folder: 'Contracts',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2024-11-18T14:15:00',
    tags: ['contract', 'supplier'],
  },
  {
    id: 'doc-003',
    name: 'Inventory Report November.xlsx',
    type: 'spreadsheet',
    size: '856 KB',
    folder: 'Reports',
    uploadedBy: 'Mike Wilson',
    uploadedAt: '2024-11-15T09:00:00',
    tags: ['report', 'inventory', 'monthly'],
  },
  {
    id: 'doc-004',
    name: 'Quality Certificate - Batch B-089.pdf',
    type: 'pdf',
    size: '524 KB',
    folder: 'Quality',
    uploadedBy: 'Emily Davis',
    uploadedAt: '2024-11-14T16:45:00',
    tags: ['certificate', 'quality'],
  },
  {
    id: 'doc-005',
    name: 'Product Images - Widget Pro.zip',
    type: 'image',
    size: '15.2 MB',
    folder: 'Products',
    uploadedBy: 'John Smith',
    uploadedAt: '2024-11-12T11:20:00',
    tags: ['images', 'product'],
  },
  {
    id: 'doc-006',
    name: 'Work Order Template.docx',
    type: 'document',
    size: '128 KB',
    folder: 'Templates',
    uploadedBy: 'Robert Brown',
    uploadedAt: '2024-11-10T08:30:00',
    tags: ['template', 'work-order'],
  },
  {
    id: 'doc-007',
    name: 'Safety Guidelines 2024.pdf',
    type: 'pdf',
    size: '3.1 MB',
    folder: 'Compliance',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2024-11-08T13:00:00',
    tags: ['safety', 'compliance', 'guidelines'],
  },
  {
    id: 'doc-008',
    name: 'BOM - Assembly Unit A.xlsx',
    type: 'spreadsheet',
    size: '456 KB',
    folder: 'Production',
    uploadedBy: 'Mike Wilson',
    uploadedAt: '2024-11-05T10:15:00',
    tags: ['bom', 'production'],
  },
];

const folders = ['All', 'Products', 'Contracts', 'Reports', 'Quality', 'Templates', 'Compliance', 'Production'];

const typeIcons = {
  pdf: FileText,
  image: Image,
  spreadsheet: FileSpreadsheet,
  document: FileText,
  other: File,
};

const typeColors = {
  pdf: 'text-destructive',
  image: 'text-success',
  spreadsheet: 'text-primary',
  document: 'text-primary',
  other: 'text-muted-foreground',
};

export default function DocumentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFolder = selectedFolder === 'All' || doc.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  // Calculate stats
  const totalSize = documents.reduce((sum, doc) => {
    const size = parseFloat(doc.size);
    const unit = doc.size.includes('MB') ? 1024 : 1;
    return sum + size * unit;
  }, 0);

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage files and documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{documents.length}</p>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Folder className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{folders.length - 1}</p>
                <p className="text-sm text-muted-foreground">Folders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Download className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(totalSize / 1024).toFixed(1)} MB</p>
                <p className="text-sm text-muted-foreground">Total Size</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {documents.filter((d) => {
                    const uploadDate = new Date(d.uploadedAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return uploadDate > weekAgo;
                  }).length}
                </p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {folders.map((folder) => (
                <Button
                  key={folder}
                  variant={selectedFolder === folder ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFolder(folder)}
                >
                  {folder}
                </Button>
              ))}
            </div>
            <div className="flex gap-1 border rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-muted' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-muted' : ''}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Files</CardTitle>
          <CardDescription>
            {filteredDocuments.length} documents found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredDocuments.map((doc) => {
                const Icon = typeIcons[doc.type];
                return (
                  <div
                    key={doc.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg bg-muted ${typeColors[doc.type]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3">
                      <p className="font-medium text-sm truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{doc.size}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {doc.uploadedBy}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => {
                const Icon = typeIcons[doc.type];
                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg bg-muted ${typeColors[doc.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{doc.size}</span>
                        <span>{doc.folder}</span>
                        <span>{doc.uploadedBy}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
                    </div>
                    <div className="flex gap-1">
                      <button className="p-2 hover:bg-muted rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 hover:text-destructive rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No documents found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
