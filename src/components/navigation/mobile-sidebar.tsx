'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUIStore, useAuthStore } from '@/stores';
import { Sheet, SheetContent, ScrollArea } from '@/components/ui';
import { NavSection } from './nav-section';
import { navigationConfig } from './nav-config';
import { brand } from '@/config/brand';
import { LogOut } from 'lucide-react';

export function MobileSidebar() {
  const { sidebarMobileOpen, setSidebarMobileOpen } = useUIStore();
  const { clearAuth, user } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <Sheet open={sidebarMobileOpen} onOpenChange={setSidebarMobileOpen}>
      <SheetContent side="left" className="w-[280px] p-0">
        <div className="flex h-full flex-col">
          {/* Logo Header */}
          <div className="border-b border-border px-4 py-4">
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3"
                onClick={() => setSidebarMobileOpen(false)}
              >
                <Image
                  src={brand.logoMark}
                  alt={brand.name}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
                <span className="text-base font-semibold">{brand.name}</span>
              </Link>
              <p className="text-xs text-muted-foreground pl-9">
                {brand.tagline}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="px-2" onClick={() => setSidebarMobileOpen(false)}>
              {navigationConfig.map((section) => (
                <NavSection
                  key={section.title}
                  section={section}
                  collapsed={false}
                />
              ))}
            </nav>
          </ScrollArea>

          {/* Bottom Section */}
          <div className="border-t border-border p-2">
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>

            {/* User info */}
            {user && (
              <div className="mt-2 px-3 py-2 rounded-md bg-muted/50">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileSidebar;
