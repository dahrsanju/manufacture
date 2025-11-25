import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  visible: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
}

interface WidgetState {
  widgets: WidgetConfig[];
  isEditMode: boolean;

  // Actions
  setWidgets: (widgets: WidgetConfig[]) => void;
  toggleWidget: (id: string) => void;
  updateWidgetPosition: (id: string, position: number) => void;
  updateWidgetSize: (id: string, size: WidgetConfig['size']) => void;
  toggleEditMode: () => void;
  resetWidgets: () => void;
}

// Default widget configuration
const defaultWidgets: WidgetConfig[] = [
  { id: 'kpi-products', type: 'kpi', title: 'Total Products', visible: true, position: 0, size: 'small' },
  { id: 'kpi-lowstock', type: 'kpi', title: 'Low Stock Items', visible: true, position: 1, size: 'small' },
  { id: 'kpi-orders', type: 'kpi', title: 'Pending Orders', visible: true, position: 2, size: 'small' },
  { id: 'kpi-workorders', type: 'kpi', title: 'Active Work Orders', visible: true, position: 3, size: 'small' },
  { id: 'chart-revenue', type: 'chart', title: 'Revenue & Orders Trend', visible: true, position: 4, size: 'medium' },
  { id: 'chart-production', type: 'chart', title: 'Weekly Production', visible: true, position: 5, size: 'medium' },
  { id: 'chart-inventory', type: 'chart', title: 'Inventory by Category', visible: true, position: 6, size: 'small' },
  { id: 'activity-feed', type: 'activity', title: 'Recent Activity', visible: true, position: 7, size: 'large' },
  { id: 'quick-actions', type: 'actions', title: 'Quick Actions', visible: true, position: 8, size: 'large' },
];

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set) => ({
      widgets: defaultWidgets,
      isEditMode: false,

      setWidgets: (widgets) => set({ widgets }),

      toggleWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, visible: !w.visible } : w
          ),
        })),

      updateWidgetPosition: (id, position) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, position } : w
          ),
        })),

      updateWidgetSize: (id, size) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, size } : w
          ),
        })),

      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),

      resetWidgets: () => set({ widgets: defaultWidgets }),
    }),
    {
      name: 'widget-storage',
    }
  )
);
