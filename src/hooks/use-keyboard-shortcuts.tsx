'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/ui-store';

interface ShortcutAction {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const router = useRouter();
  const { toggleCommandBar, toggleNotificationPanel, toggleSidebar } = useUIStore();

  const shortcuts: ShortcutAction[] = [
    // Global shortcuts
    {
      key: 'k',
      meta: true,
      action: toggleCommandBar,
      description: 'Open command bar',
    },
    {
      key: 'k',
      ctrl: true,
      action: toggleCommandBar,
      description: 'Open command bar',
    },
    {
      key: 'b',
      meta: true,
      action: toggleSidebar,
      description: 'Toggle sidebar',
    },
    {
      key: 'b',
      ctrl: true,
      action: toggleSidebar,
      description: 'Toggle sidebar',
    },
    {
      key: 'n',
      meta: true,
      shift: true,
      action: toggleNotificationPanel,
      description: 'Toggle notifications',
    },
    // Navigation shortcuts
    {
      key: 'h',
      alt: true,
      action: () => router.push('/dashboard'),
      description: 'Go to dashboard',
    },
    {
      key: 'p',
      alt: true,
      action: () => router.push('/inventory/products'),
      description: 'Go to products',
    },
    {
      key: 'w',
      alt: true,
      action: () => router.push('/warehouses'),
      description: 'Go to warehouses',
    },
    {
      key: 'o',
      alt: true,
      action: () => router.push('/production/work-orders'),
      description: 'Go to work orders',
    },
    {
      key: 't',
      alt: true,
      action: () => router.push('/tasks'),
      description: 'Go to tasks',
    },
    {
      key: 's',
      alt: true,
      action: () => router.push('/settings'),
      description: 'Go to settings',
    },
    // Action shortcuts
    {
      key: 'Escape',
      action: () => {
        // Close any open modals/panels
        const closeEvent = new CustomEvent('closeAllPanels');
        window.dispatchEvent(closeEvent);
      },
      description: 'Close panels',
    },
  ];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape to still work
        if (event.key !== 'Escape') {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey;
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (keyMatch && (metaMatch || ctrlMatch) && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
}

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  return <>{children}</>;
}
