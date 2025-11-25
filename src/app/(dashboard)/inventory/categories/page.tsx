'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Layers, Plus, Search, Filter, ChevronRight, ChevronDown, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  children?: Category[];
  productCount: number;
  isActive: boolean;
}

function CategoryNode({ category, level = 0 }: { category: Category; level?: number }) {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-3 hover:bg-muted/50 rounded-md cursor-pointer',
          level > 0 && 'ml-6'
        )}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )
        ) : (
          <div className="w-4" />
        )}
        <Layers className="h-4 w-4 text-primary" />
        <span className="font-medium">{category.name}</span>
        <span className="text-xs text-muted-foreground ml-2">({category.code})</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Package className="h-3 w-3" />
            {category.productCount}
          </span>
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              category.isActive
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
            )}
          >
            {category.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      {hasChildren && expanded && (
        <div>
          {category.children!.map((child) => (
            <CategoryNode key={child.id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/product-categories');
      return response.data.data as Category[];
    },
  });

  const filteredCategories = data?.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Product Categories</h1>
          <p className="text-muted-foreground mt-1">
            Organize and manage your product category hierarchy
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-md bg-background"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Category Tree */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Category Tree
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-destructive">Failed to load categories</p>
            </div>
          ) : filteredCategories && filteredCategories.length > 0 ? (
            <div className="space-y-1">
              {filteredCategories.map((category) => (
                <CategoryNode key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No categories found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
