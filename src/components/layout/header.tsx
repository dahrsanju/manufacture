'use client';

import { useUIStore, useAuthStore, useNotificationStore } from '@/stores';
import { Button } from '@/components/ui';
import {
  Bell,
  Search,
  Sun,
  Moon,
  Monitor,
  Menu,
  Command,
  Brain,
} from 'lucide-react';

export function Header() {
  const { sidebarCollapsed, toggleSidebar, theme, setTheme, toggleCommandBar, toggleNotificationPanel, toggleAIPanel } = useUIStore();
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <header
      className="fixed top-0 right-0 z-30 h-16 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60"
      style={{
        left: sidebarCollapsed ? '80px' : '280px',
        transition: 'left 0.3s',
      }}
    >
      <div className="flex h-full items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Command Bar Trigger */}
          <button
            onClick={toggleCommandBar}
            className="hidden md:flex items-center gap-2 h-9 px-4 rounded-md border border-input bg-background text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="ml-4 inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              <Command className="h-3 w-3" />K
            </kbd>
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            title={`Theme: ${theme}`}
          >
            <ThemeIcon className="h-5 w-5" />
          </Button>

          {/* AI Inspector */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAIPanel}
            title="AI Inspector"
          >
            <Brain className="h-5 w-5" />
          </Button>

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

          {/* User Avatar */}
          <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
