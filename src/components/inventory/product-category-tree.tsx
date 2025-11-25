'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Package } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  productCount: number;
  children?: Category[];
}

interface ProductCategoryTreeProps {
  categories: Category[];
  selectedId?: string;
  onSelect?: (category: Category) => void;
  onExpand?: (categoryId: string) => void;
}

const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    productCount: 45,
    children: [
      {
        id: 'cat-1-1',
        name: 'Components',
        productCount: 20,
        children: [
          { id: 'cat-1-1-1', name: 'Resistors', productCount: 8 },
          { id: 'cat-1-1-2', name: 'Capacitors', productCount: 12 },
        ],
      },
      { id: 'cat-1-2', name: 'Cables', productCount: 15 },
      { id: 'cat-1-3', name: 'Connectors', productCount: 10 },
    ],
  },
  {
    id: 'cat-2',
    name: 'Raw Materials',
    productCount: 32,
    children: [
      { id: 'cat-2-1', name: 'Metals', productCount: 18 },
      { id: 'cat-2-2', name: 'Plastics', productCount: 14 },
    ],
  },
  {
    id: 'cat-3',
    name: 'Finished Goods',
    productCount: 28,
    children: [
      { id: 'cat-3-1', name: 'Assemblies', productCount: 15 },
      { id: 'cat-3-2', name: 'Products', productCount: 13 },
    ],
  },
  {
    id: 'cat-4',
    name: 'Packaging',
    productCount: 12,
  },
];

function CategoryNode({
  category,
  level = 0,
  selectedId,
  onSelect,
  expandedIds,
  onToggle,
}: {
  category: Category;
  level?: number;
  selectedId?: string;
  onSelect?: (category: Category) => void;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);
  const isSelected = selectedId === category.id;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted ${
          isSelected ? 'bg-primary/10 text-primary' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect?.(category)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(category.id);
            }}
            className="p-0.5 hover:bg-muted-foreground/20 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}

        {hasChildren ? (
          isExpanded ? (
            <FolderOpen className="h-4 w-4 text-warning" />
          ) : (
            <Folder className="h-4 w-4 text-warning" />
          )
        ) : (
          <Package className="h-4 w-4 text-muted-foreground" />
        )}

        <span className="flex-1 text-sm">{category.name}</span>
        <span className="text-xs text-muted-foreground">{category.productCount}</span>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {category.children!.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductCategoryTree({
  categories = mockCategories,
  selectedId,
  onSelect,
  onExpand,
}: ProductCategoryTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['cat-1']));

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        onExpand?.(id);
      }
      return next;
    });
  };

  return (
    <div className="py-2">
      {categories.map((category) => (
        <CategoryNode
          key={category.id}
          category={category}
          selectedId={selectedId}
          onSelect={onSelect}
          expandedIds={expandedIds}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
