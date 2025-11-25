import {
  LayoutDashboard,
  Boxes,
  Layers,
  ArrowLeftRight,
  MoveRight,
  Warehouse,
  Grid,
  Gauge,
  Columns3,
  Factory,
  Workflow,
  ListTree,
  Cpu,
  CalendarCog,
  ClipboardCheck,
  TriangleAlert,
  FileWarning,
  FileCheck,
  GitBranch,
  CheckCircle,
  Stamp,
  BarChart2,
  PieChart,
  LineChart,
  Users,
  Receipt,
  FileStack,
  User,
  ShieldCheck,
  ListChecks,
  Settings,
  LucideIcon,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationConfig: NavSection[] = [
  {
    title: 'DASHBOARD',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'INVENTORY',
    items: [
      {
        title: 'Products',
        href: '/inventory/products',
        icon: Boxes,
      },
      {
        title: 'Categories',
        href: '/inventory/categories',
        icon: Layers,
      },
      {
        title: 'Transfers',
        href: '/inventory/transfers/new',
        icon: ArrowLeftRight,
      },
      {
        title: 'Stock Movements',
        href: '/inventory/movements',
        icon: MoveRight,
      },
    ],
  },
  {
    title: 'WAREHOUSES',
    items: [
      {
        title: 'Warehouses',
        href: '/warehouses',
        icon: Warehouse,
      },
      {
        title: 'Bins / Zones',
        href: '/warehouses/zones',
        icon: Grid,
      },
      {
        title: 'Capacity',
        href: '/warehouses/capacity',
        icon: Gauge,
      },
      {
        title: 'Comparison',
        href: '/warehouses/comparison',
        icon: Columns3,
      },
    ],
  },
  {
    title: 'MANUFACTURING',
    items: [
      {
        title: 'Production Overview',
        href: '/production',
        icon: Factory,
      },
      {
        title: 'Work Orders',
        href: '/production/work-orders',
        icon: Workflow,
      },
      {
        title: 'BOM',
        href: '/production/bom',
        icon: ListTree,
      },
      {
        title: 'Work Centers',
        href: '/production/work-centers',
        icon: Cpu,
      },
      {
        title: 'Schedule',
        href: '/production/schedule',
        icon: CalendarCog,
      },
    ],
  },
  {
    title: 'QUALITY',
    items: [
      {
        title: 'Inspections',
        href: '/quality/inspections',
        icon: ClipboardCheck,
      },
      {
        title: 'Defects',
        href: '/quality/defects',
        icon: TriangleAlert,
      },
      {
        title: 'NCRs',
        href: '/quality/ncr',
        icon: FileWarning,
      },
      {
        title: 'Certificates',
        href: '/quality/certificates',
        icon: FileCheck,
      },
    ],
  },
  {
    title: 'WORKFLOW & TASKS',
    items: [
      {
        title: 'Workflow Designer',
        href: '/workflows/designer',
        icon: GitBranch,
      },
      {
        title: 'Tasks',
        href: '/tasks',
        icon: CheckCircle,
      },
      {
        title: 'Approvals',
        href: '/tasks/approvals',
        icon: Stamp,
      },
    ],
  },
  {
    title: 'REPORTS',
    items: [
      {
        title: 'Reports',
        href: '/reports',
        icon: BarChart2,
      },
      {
        title: 'Analytics',
        href: '/analytics',
        icon: PieChart,
      },
      {
        title: 'Forecasting',
        href: '/analytics/forecasting',
        icon: LineChart,
      },
    ],
  },
  {
    title: 'SALES / FINANCE',
    items: [
      {
        title: 'Customers',
        href: '/sales/customers',
        icon: Users,
      },
      {
        title: 'Invoices',
        href: '/finance/invoices',
        icon: Receipt,
      },
      {
        title: 'Purchase Orders',
        href: '/procurement/po',
        icon: FileStack,
      },
    ],
  },
  {
    title: 'ADMIN / SETTINGS',
    items: [
      {
        title: 'User Profile',
        href: '/profile',
        icon: User,
      },
      {
        title: 'Roles & Permissions',
        href: '/admin/roles',
        icon: ShieldCheck,
      },
      {
        title: 'Activity Logs',
        href: '/admin/activity-log',
        icon: ListChecks,
      },
      {
        title: 'System Settings',
        href: '/settings',
        icon: Settings,
      },
    ],
  },
];

// Route title mapping for breadcrumbs and page titles
export const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inventory/products': 'Products',
  '/inventory/categories': 'Categories',
  '/inventory/transfers/new': 'Transfers',
  '/inventory/movements': 'Stock Movements',
  '/warehouses': 'Warehouses',
  '/warehouses/zones': 'Bins / Zones',
  '/warehouses/capacity': 'Capacity',
  '/warehouses/comparison': 'Comparison',
  '/production': 'Production Overview',
  '/production/work-orders': 'Work Orders',
  '/production/bom': 'BOM',
  '/production/work-centers': 'Work Centers',
  '/production/schedule': 'Schedule',
  '/quality/inspections': 'Inspections',
  '/quality/defects': 'Defects',
  '/quality/ncr': 'NCRs',
  '/quality/certificates': 'Certificates',
  '/workflows/designer': 'Workflow Designer',
  '/tasks': 'Tasks',
  '/tasks/approvals': 'Approvals',
  '/reports': 'Reports',
  '/analytics': 'Analytics',
  '/analytics/forecasting': 'Forecasting',
  '/sales/customers': 'Customers',
  '/finance/invoices': 'Invoices',
  '/procurement/po': 'Purchase Orders',
  '/profile': 'User Profile',
  '/admin/roles': 'Roles & Permissions',
  '/admin/activity-log': 'Activity Logs',
  '/settings': 'System Settings',
};
