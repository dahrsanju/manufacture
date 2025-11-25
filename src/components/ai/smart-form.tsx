'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
} from '@/components/ui';
import {
  Sparkles,
  AlertTriangle,
  Package,
  Check,
  X,
  ChevronRight,
  Lightbulb,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormSuggestion {
  field: string;
  value: string;
  confidence: number;
  source: string;
}

interface DuplicateCandidate {
  id: string;
  name: string;
  sku: string;
  similarity: number;
}

interface RelatedProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  relationship: 'similar' | 'complementary' | 'substitute';
}

interface SmartFormSuggestionsProps {
  fieldName: string;
  context?: Record<string, unknown>;
  onApplySuggestion?: (value: string) => void;
  onViewProduct?: (id: string) => void;
}

export function SmartFormSuggestions({
  fieldName,
  context,
  onApplySuggestion,
  onViewProduct,
}: SmartFormSuggestionsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['smart-form', fieldName, context],
    queryFn: async () => {
      const response = await axios.post('/api/v1/ai/smart-form', {
        field: fieldName,
        context,
      });
      return response.data.data;
    },
    enabled: !!fieldName,
  });

  if (isLoading) {
    return (
      <div className="p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 animate-pulse" />
          Loading AI suggestions...
        </div>
      </div>
    );
  }

  const suggestions = data?.suggestions || [];

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Sparkles className="h-4 w-4 text-primary" />
        AI Suggestions
      </div>
      <div className="space-y-1">
        {suggestions.map((suggestion: FormSuggestion, index: number) => (
          <button
            key={index}
            onClick={() => onApplySuggestion?.(suggestion.value)}
            className="w-full flex items-center justify-between p-2 rounded hover:bg-muted transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{suggestion.value}</span>
              <Badge variant="secondary" className="text-xs">
                {suggestion.confidence}%
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">{suggestion.source}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Duplicate Detection Panel
interface DuplicateDetectionProps {
  productName?: string;
  sku?: string;
  onViewDuplicate?: (id: string) => void;
  onDismiss?: () => void;
}

export function DuplicateDetection({
  productName,
  sku,
  onViewDuplicate,
  onDismiss,
}: DuplicateDetectionProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['duplicate-check', productName, sku],
    queryFn: async () => {
      const response = await axios.post('/api/v1/ai/smart-form', {
        field: 'name',
        context: { name: productName, sku },
      });
      return response.data.data;
    },
    enabled: !!(productName || sku),
  });

  const duplicates = data?.duplicates || [];

  if (isLoading || duplicates.length === 0) return null;

  return (
    <Card className="border-warning">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm text-warning">
          <AlertTriangle className="h-4 w-4" />
          Potential Duplicates Detected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {duplicates.map((dup: DuplicateCandidate) => (
          <div
            key={dup.id}
            className="flex items-center justify-between p-2 bg-muted/50 rounded"
          >
            <div>
              <p className="text-sm font-medium">{dup.name}</p>
              <p className="text-xs text-muted-foreground">SKU: {dup.sku}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={dup.similarity >= 90 ? 'destructive' : 'warning'}
                className="text-xs"
              >
                {dup.similarity}% match
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDuplicate?.(dup.id)}
              >
                View
              </Button>
            </div>
          </div>
        ))}
        <Button variant="ghost" size="sm" onClick={onDismiss} className="w-full">
          Dismiss
        </Button>
      </CardContent>
    </Card>
  );
}

// Related Products Panel
interface RelatedProductsPanelProps {
  productId?: string;
  category?: string;
  onSelectProduct?: (id: string) => void;
}

export function RelatedProductsPanel({
  productId,
  category,
  onSelectProduct,
}: RelatedProductsPanelProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['related-products', productId, category],
    queryFn: async () => {
      const response = await axios.post('/api/v1/ai/smart-form', {
        field: 'related',
        context: { productId, category },
      });
      return response.data.data;
    },
    enabled: !!(productId || category),
  });

  const relatedProducts = data?.relatedProducts || [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4 animate-pulse" />
            Finding related products...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (relatedProducts.length === 0) return null;

  const relationshipLabels = {
    similar: 'Similar',
    complementary: 'Complements',
    substitute: 'Alternative',
  };

  const relationshipColors = {
    similar: 'bg-primary/10 text-primary',
    complementary: 'bg-success/10 text-success',
    substitute: 'bg-warning/10 text-warning',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Lightbulb className="h-4 w-4 text-primary" />
          Related Products
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {relatedProducts.map((product: RelatedProduct) => (
          <button
            key={product.id}
            onClick={() => onSelectProduct?.(product.id)}
            className="w-full flex items-center justify-between p-2 rounded hover:bg-muted transition-colors text-left"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.sku}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn('text-xs', relationshipColors[product.relationship])}
              >
                {relationshipLabels[product.relationship]}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

// Smart Field Input with AI suggestions inline
interface SmartFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SmartField({
  name,
  value,
  onChange,
  placeholder,
  className,
}: SmartFieldProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<FormSuggestion[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['field-suggestions', name],
    queryFn: async () => {
      const response = await axios.post('/api/v1/ai/smart-form', {
        field: name,
      });
      return response.data.data.suggestions || [];
    },
    enabled: showSuggestions,
  });

  useEffect(() => {
    if (data) {
      setSuggestions(data);
    }
  }, [data]);

  const applySuggestion = (suggestion: FormSuggestion) => {
    onChange(suggestion.value);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm',
            className
          )}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="shrink-0"
        >
          <Sparkles className={cn('h-4 w-4', showSuggestions && 'text-primary')} />
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg">
          <div className="p-2 border-b">
            <span className="text-xs font-medium text-muted-foreground">
              AI Suggestions
            </span>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => applySuggestion(suggestion)}
                className="w-full flex items-center justify-between p-2 hover:bg-muted transition-colors text-left"
              >
                <span className="text-sm">{suggestion.value}</span>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.confidence}%
                  </Badge>
                  <Copy className="h-3 w-3 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartFormSuggestions;
