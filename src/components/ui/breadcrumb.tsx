'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

// Route label mapping
const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  inventory: 'Inventory',
  products: 'Products',
  stock: 'Stock Levels',
  movements: 'Movements',
  warehouses: 'Warehouses',
  manufacturing: 'Manufacturing',
  'work-orders': 'Work Orders',
  bom: 'Bill of Materials',
  production: 'Production',
  quality: 'Quality',
  workflow: 'Workflows',
  designer: 'Designer',
  tasks: 'Tasks',
  settings: 'Settings',
  notifications: 'Notifications',
};

export function Breadcrumb({
  items,
  className,
  showHome = true,
}: BreadcrumbProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    const segments = pathname.split('/').filter(Boolean);
    let currentPath = '';

    return segments.map((segment) => {
      currentPath += `/${segment}`;
      return {
        label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
      };
    });
  })();

  // Remove href from last item (current page)
  if (breadcrumbItems.length > 0) {
    breadcrumbItems[breadcrumbItems.length - 1].href = undefined;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center gap-1 text-sm">
        {showHome && (
          <>
            <li>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
              </Link>
            </li>
            {breadcrumbItems.length > 0 && (
              <li>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </li>
            )}
          </>
        )}

        {breadcrumbItems.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1">
            {item.href ? (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{item.label}</span>
            )}

            {index < breadcrumbItems.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
