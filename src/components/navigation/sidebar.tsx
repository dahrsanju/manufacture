'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUIStore, useAuthStore } from '@/stores';
import { cn } from '@/lib/utils';
import { ScrollArea, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui';
import { NavSection } from './nav-section';
import { navigationConfig } from './nav-config';
import { brand } from '@/config/brand';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { clearAuth, user } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 hidden lg:block',
          sidebarCollapsed ? 'w-[72px]' : 'w-[240px]'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Header */}
          <div className={cn(
            'border-b border-border',
            sidebarCollapsed ? 'flex h-[60px] items-center justify-center px-2' : 'px-4 py-3'
          )}>
            {!sidebarCollapsed && (
              <Link href="/dashboard" className="block">
                <img
                  src={brand.logoFull}
                  alt={`${brand.name} - ${brand.tagline}`}
                  className="h-14 w-auto object-contain invert dark:invert-0"
                />
              </Link>
            )}
            {sidebarCollapsed && (
              <Link href="/dashboard">
                <img
                  src={brand.logoMark}
                  alt={brand.name}
                  className="h-8 w-8 object-contain"
                />
              </Link>
            )}
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className={cn('px-2', sidebarCollapsed && 'px-1')}>
              {navigationConfig.map((section) => (
                <NavSection
                  key={section.title}
                  section={section}
                  collapsed={sidebarCollapsed}
                />
              ))}
            </nav>
          </ScrollArea>

          {/* Bottom Section */}
          <div className="border-t border-border p-2">
            {/* Collapse Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    sidebarCollapsed && 'justify-center px-2'
                  )}
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <>
                      <ChevronLeft className="h-4 w-4" />
                      <span>Collapse</span>
                    </>
                  )}
                </button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">
                  Expand sidebar
                </TooltipContent>
              )}
            </Tooltip>

            {/* Logout */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    'text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
                    sidebarCollapsed && 'justify-center px-2'
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  {!sidebarCollapsed && <span>Sign out</span>}
                </button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">
                  Sign out
                </TooltipContent>
              )}
            </Tooltip>

            {/* User info - only when expanded */}
            {!sidebarCollapsed && user && (
              <div className="mt-2 px-3 py-2 rounded-md bg-muted/50">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

export default Sidebar;
