'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@/components/ui';
import { Search, Plus, FileText, Star, Download, Eye } from 'lucide-react';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'simple' | 'moderate' | 'complex';
  steps: number;
  uses: number;
  rating: number;
  tags: string[];
}

interface WorkflowTemplateLibraryProps {
  templates?: WorkflowTemplate[];
  onUseTemplate?: (template: WorkflowTemplate) => void;
  onPreview?: (template: WorkflowTemplate) => void;
}

const mockTemplates: WorkflowTemplate[] = [
  { id: 't1', name: 'Purchase Order Approval', description: 'Standard PO approval workflow with manager and finance approval steps', category: 'Procurement', complexity: 'moderate', steps: 5, uses: 234, rating: 4.8, tags: ['approval', 'finance', 'purchasing'] },
  { id: 't2', name: 'Employee Onboarding', description: 'Complete onboarding process including IT setup, HR paperwork, and training', category: 'HR', complexity: 'complex', steps: 12, uses: 156, rating: 4.6, tags: ['hr', 'onboarding', 'training'] },
  { id: 't3', name: 'Quality Inspection', description: 'Quality check workflow with pass/fail branching and retest options', category: 'Quality', complexity: 'simple', steps: 4, uses: 312, rating: 4.9, tags: ['quality', 'inspection', 'manufacturing'] },
  { id: 't4', name: 'Work Order Processing', description: 'End-to-end work order management from creation to completion', category: 'Production', complexity: 'moderate', steps: 7, uses: 189, rating: 4.7, tags: ['production', 'work-order', 'manufacturing'] },
  { id: 't5', name: 'Document Approval', description: 'Simple document review and approval workflow', category: 'General', complexity: 'simple', steps: 3, uses: 445, rating: 4.5, tags: ['approval', 'documents', 'review'] },
  { id: 't6', name: 'Inventory Transfer', description: 'Inter-warehouse transfer with approval and verification steps', category: 'Inventory', complexity: 'moderate', steps: 6, uses: 98, rating: 4.4, tags: ['inventory', 'transfer', 'warehouse'] },
];

const complexityColors = {
  simple: 'success',
  moderate: 'warning',
  complex: 'destructive',
};

export function WorkflowTemplateLibrary({
  templates = mockTemplates,
  onUseTemplate,
  onPreview,
}: WorkflowTemplateLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(templates.map((t) => t.category))];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === null ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <Badge variant={complexityColors[template.complexity] as any}>
                  {template.complexity}
                </Badge>
              </div>

              <h3 className="font-medium mb-1">{template.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {template.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{template.steps} steps</span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  {template.rating}
                </span>
                <span>{template.uses} uses</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onPreview?.(template)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onUseTemplate?.(template)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Use
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No templates found matching your criteria
        </div>
      )}
    </div>
  );
}
