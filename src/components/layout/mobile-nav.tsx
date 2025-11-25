'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui';
import { useAuthStore, useUIStore } from '@/stores';
import {
  Menu,
  X,
  Home,
  Package,
  Factory,
  ClipboardCheck,
  Warehouse,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Building2,
  Bell,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/inventory/products', label: 'Products', icon: Package },
  { href: '/warehouses', label: 'Warehouses', icon: Warehouse },
  { href: '/production', label: 'Production', icon: Factory },
  { href: '/production/work-orders', label: 'Work Orders', icon: FileText },
  { href: '/production/bom', label: 'Bill of Materials', icon: FileText },
  { href: '/quality/inspections', label: 'Quality', icon: ClipboardCheck },
  { href: '/tasks', label: 'Tasks', icon: FileText },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/suppliers', label: 'Suppliers', icon: Building2 },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/help', label: 'Help', icon: HelpCircle },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user, companies, companyId, clearAuth } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentCompany = companies.find(c => c.companyId === companyId);

  const handleLogout = () => {
    clearAuth();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-80 bg-background border-r z-50 md:hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary">
                    <Factory className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold">Manufacturing ERP</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* User Info */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-medium text-primary">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user?.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                {currentCompany && (
                  <div className="mt-3 p-2 rounded-lg bg-muted flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium truncate">{currentCompany.companyName}</span>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Footer Actions */}
              <div className="p-4 border-t space-y-2">
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileNav;
