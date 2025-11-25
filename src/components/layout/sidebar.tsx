'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUIStore, useAuthStore } from '@/stores';
import { cn } from '@/lib/utils';
import { brand } from '@/config/brand';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Factory,
  ClipboardCheck,
  GitBranch,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Inventory',
    href: '/inventory',
    icon: Package,
    children: [
      { title: 'Products', href: '/inventory/products' },
      { title: 'Stock Levels', href: '/inventory/stock' },
      { title: 'Movements', href: '/inventory/movements' },
    ],
  },
  {
    title: 'Warehouses',
    href: '/warehouses',
    icon: Warehouse,
  },
  {
    title: 'Manufacturing',
    href: '/production',
    icon: Factory,
    children: [
      { title: 'Work Orders', href: '/production/work-orders' },
      { title: 'BOM', href: '/production/bom' },
      { title: 'Production', href: '/production' },
    ],
  },
  {
    title: 'Quality',
    href: '/quality/inspections',
    icon: ClipboardCheck,
  },
  {
    title: 'Workflows',
    href: '/workflows/designer',
    icon: GitBranch,
    children: [
      { title: 'Designer', href: '/workflows/designer' },
      { title: 'Tasks', href: '/tasks' },
    ],
  },
];

const bottomItems = [
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { clearAuth, user } = useAuthStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300',
        sidebarCollapsed ? 'w-[80px]' : 'w-[280px]'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!sidebarCollapsed ? (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={100}
                height={25}
                className="h-7 w-auto object-contain dark:brightness-100 brightness-0"
              />
            </Link>
          ) : (
            <Link href="/dashboard" className="flex items-center justify-center">
              <Image
                src="/branding/flowsense/icon-32x32.png"
                alt={brand.name}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-muted"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  title={sidebarCollapsed ? item.title : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-border py-4 px-3">
          <ul className="space-y-1">
            {bottomItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  title={sidebarCollapsed ? item.title : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                </Link>
              </li>
            ))}

            {/* User & Logout */}
            <li>
              <button
                onClick={() => {
                  clearAuth();
                  window.location.href = '/login';
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title={sidebarCollapsed ? 'Sign out' : undefined}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Sign out</span>}
              </button>
            </li>
          </ul>

          {/* User info */}
          {!sidebarCollapsed && user && (
            <div className="mt-4 px-3 py-2 rounded-md bg-muted/50">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
