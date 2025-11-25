import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;

  // Theme
  theme: 'light' | 'dark' | 'system';

  // Panels
  commandBarOpen: boolean;
  aiPanelOpen: boolean;
  notificationPanelOpen: boolean;

  // Loading states
  globalLoading: boolean;
  loadingMessage: string | null;

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarMobile: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setTheme: (theme: UIState['theme']) => void;
  toggleCommandBar: () => void;
  setCommandBarOpen: (open: boolean) => void;
  toggleAIPanel: () => void;
  setAIPanelOpen: (open: boolean) => void;
  toggleNotificationPanel: () => void;
  setNotificationPanelOpen: (open: boolean) => void;
  setGlobalLoading: (loading: boolean, message?: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      theme: 'system',
      commandBarOpen: false,
      aiPanelOpen: false,
      notificationPanelOpen: false,
      globalLoading: false,
      loadingMessage: null,

      // Sidebar actions
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebarMobile: () => set((state) => ({ sidebarMobileOpen: !state.sidebarMobileOpen })),
      setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),

      // Theme actions
      setTheme: (theme) => set({ theme }),

      // Panel actions
      toggleCommandBar: () => set((state) => ({ commandBarOpen: !state.commandBarOpen })),
      setCommandBarOpen: (open) => set({ commandBarOpen: open }),
      toggleAIPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
      setAIPanelOpen: (open) => set({ aiPanelOpen: open }),
      toggleNotificationPanel: () =>
        set((state) => ({ notificationPanelOpen: !state.notificationPanelOpen })),
      setNotificationPanelOpen: (open) => set({ notificationPanelOpen: open }),

      // Loading actions
      setGlobalLoading: (loading, message) =>
        set({ globalLoading: loading, loadingMessage: message || null }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
