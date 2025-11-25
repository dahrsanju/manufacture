'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores';
import { Input } from '@/components/ui';
import {
  Search,
  Home,
  Package,
  Factory,
  ClipboardCheck,
  GitBranch,
  Settings,
  Plus,
  FileText,
  Warehouse,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  icon: React.ElementType;
  label: string;
  description?: string;
  shortcut?: string;
  action: () => void;
  category: 'navigation' | 'action' | 'recent';
}

export function CommandBar() {
  const router = useRouter();
  const { commandBarOpen, setCommandBarOpen } = useUIStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command items
  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      icon: Home,
      label: 'Go to Dashboard',
      shortcut: 'G D',
      action: () => router.push('/dashboard'),
      category: 'navigation',
    },
    {
      id: 'nav-products',
      icon: Package,
      label: 'Go to Products',
      shortcut: 'G P',
      action: () => router.push('/inventory/products'),
      category: 'navigation',
    },
    {
      id: 'nav-warehouses',
      icon: Warehouse,
      label: 'Go to Warehouses',
      shortcut: 'G W',
      action: () => router.push('/warehouses'),
      category: 'navigation',
    },
    {
      id: 'nav-manufacturing',
      icon: Factory,
      label: 'Go to Manufacturing',
      shortcut: 'G M',
      action: () => router.push('/manufacturing'),
      category: 'navigation',
    },
    {
      id: 'nav-quality',
      icon: ClipboardCheck,
      label: 'Go to Quality',
      shortcut: 'G Q',
      action: () => router.push('/quality'),
      category: 'navigation',
    },
    {
      id: 'nav-workflows',
      icon: GitBranch,
      label: 'Go to Workflows',
      shortcut: 'G F',
      action: () => router.push('/workflow'),
      category: 'navigation',
    },
    {
      id: 'nav-settings',
      icon: Settings,
      label: 'Go to Settings',
      shortcut: 'G S',
      action: () => router.push('/settings'),
      category: 'navigation',
    },
    // Actions
    {
      id: 'action-new-product',
      icon: Plus,
      label: 'Create New Product',
      description: 'Add a new product to inventory',
      action: () => router.push('/inventory/products/new'),
      category: 'action',
    },
    {
      id: 'action-new-work-order',
      icon: Plus,
      label: 'Create Work Order',
      description: 'Start a new production order',
      action: () => router.push('/production/work-orders/new'),
      category: 'action',
    },
    {
      id: 'action-new-inspection',
      icon: Plus,
      label: 'Start QC Inspection',
      description: 'Run a quality check',
      action: () => router.push('/quality/inspections/new'),
      category: 'action',
    },
    {
      id: 'action-reports',
      icon: FileText,
      label: 'Generate Report',
      description: 'Create inventory or production report',
      action: () => router.push('/reports'),
      category: 'action',
    },
  ];

  // Filter commands based on query
  const filteredCommands = query
    ? commands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          cmd.description?.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open command bar with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandBarOpen(!commandBarOpen);
      }

      // Close with Escape
      if (e.key === 'Escape' && commandBarOpen) {
        setCommandBarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandBarOpen, setCommandBarOpen]);

  // Handle navigation within command bar
  useEffect(() => {
    if (!commandBarOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandBarOpen, filteredCommands, selectedIndex]);

  // Focus input when opened
  useEffect(() => {
    if (commandBarOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [commandBarOpen]);

  const executeCommand = (command: CommandItem) => {
    command.action();
    setCommandBarOpen(false);
  };

  if (!commandBarOpen) return null;

  const categoryLabels: Record<string, string> = {
    navigation: 'Navigation',
    action: 'Actions',
    recent: 'Recent',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
      onClick={() => setCommandBarOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-card rounded-lg shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 h-14 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 font-mono text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {Object.entries(groupedCommands).map(([category, items]) => (
            <div key={category} className="mb-4">
              <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                {categoryLabels[category]}
              </p>
              {items.map((command, index) => {
                const globalIndex = filteredCommands.indexOf(command);
                return (
                  <button
                    key={command.id}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors',
                      globalIndex === selectedIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                    onClick={() => executeCommand(command)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                  >
                    <command.icon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{command.label}</p>
                      {command.description && (
                        <p
                          className={cn(
                            'text-sm truncate',
                            globalIndex === selectedIndex
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          )}
                        >
                          {command.description}
                        </p>
                      )}
                    </div>
                    {command.shortcut && (
                      <kbd
                        className={cn(
                          'hidden sm:inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px]',
                          globalIndex === selectedIndex
                            ? 'border-primary-foreground/30 text-primary-foreground/70'
                            : 'border-border text-muted-foreground'
                        )}
                      >
                        {command.shortcut}
                      </kbd>
                    )}
                    <ArrowRight
                      className={cn(
                        'h-4 w-4 flex-shrink-0',
                        globalIndex === selectedIndex
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground'
                      )}
                    />
                  </button>
                );
              })}
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <p className="px-4 py-8 text-center text-muted-foreground">
              No commands found for &quot;{query}&quot;
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="px-1 border rounded">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1 border rounded">↵</kbd> Select
            </span>
          </div>
          <span>AI-powered search</span>
        </div>
      </div>
    </div>
  );
}
