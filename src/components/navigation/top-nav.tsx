'use client';

import { usePathname } from 'next/navigation';
import { useUIStore, useAuthStore, useNotificationStore } from '@/stores';
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui';
import { CompanySwitcher } from '@/components/layout/company-switcher';
import { routeTitles } from './nav-config';
import {
  Bell,
  Search,
  Sun,
  Moon,
  Monitor,
  Menu,
  Command,
  Brain,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export function TopNav() {
  const pathname = usePathname();
  const {
    sidebarCollapsed,
    toggleSidebarMobile,
    theme,
    setTheme,
    toggleCommandBar,
    toggleNotificationPanel,
    toggleAIPanel
  } = useUIStore();
  const { user, clearAuth } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  // Get page title from route
  const getPageTitle = () => {
    // Check exact match first
    if (routeTitles[pathname]) {
      return routeTitles[pathname];
    }
    // Check for dynamic routes
    for (const [route, title] of Object.entries(routeTitles)) {
      if (pathname.startsWith(route) && route !== '/') {
        return title;
      }
    }
    return 'Dashboard';
  };

  // Get breadcrumb segments
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: { label: string; href: string }[] = [];
    let currentPath = '';

    for (const segment of segments) {
      currentPath += `/${segment}`;
      const title = routeTitles[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ label: title, href: currentPath });
    }

    return breadcrumbs;
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <header
      className="fixed top-0 right-0 z-30 h-[60px] border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm"
      style={{
        left: sidebarCollapsed ? '72px' : '240px',
        transition: 'left 0.3s',
      }}
    >
      {/* Mobile Header - shows full width on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-[60px] border-b border-border bg-card/95 backdrop-blur z-30">
        <div className="flex h-full items-center justify-between px-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebarMobile}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Center - Page Title */}
          <h1 className="text-sm font-semibold">{getPageTitle()}</h1>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotificationPanel}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex h-full items-center justify-between px-4">
        {/* Left side - Company Switcher + Breadcrumb */}
        <div className="flex items-center gap-4">
          <CompanySwitcher />

          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center text-sm text-muted-foreground">
            {getBreadcrumbs().map((crumb, index, arr) => (
              <span key={crumb.href} className="flex items-center">
                {index > 0 && <ChevronRight className="h-3 w-3 mx-1" />}
                <span className={index === arr.length - 1 ? 'text-foreground font-medium' : ''}>
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        </div>

        {/* Center - Page Title */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold">
          {getPageTitle()}
        </h1>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Command Bar Trigger */}
          <button
            onClick={toggleCommandBar}
            className="flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-background text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="hidden xl:inline">Search...</span>
            <kbd className="hidden xl:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground ml-2">
              <Command className="h-3 w-3" />K
            </kbd>
          </button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleNotificationPanel}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {/* AI Inspector */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAIPanel}
            title="AI Assistant"
          >
            <Brain className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            title={`Theme: ${theme}`}
          >
            <ThemeIcon className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted transition-colors">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default TopNav;
