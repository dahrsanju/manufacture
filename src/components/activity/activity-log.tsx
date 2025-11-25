'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  Input,
} from '@/components/ui';
import {
  Activity,
  Search,
  Filter,
  User,
  Package,
  FileText,
  Settings,
  Truck,
  Factory,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Eye,
  Download,
  RefreshCw,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface ActivityItem {
  id: string;
  type: 'create' | 'update' | 'delete' | 'view' | 'approve' | 'reject' | 'transfer' | 'export';
  entity: 'product' | 'order' | 'user' | 'warehouse' | 'work_order' | 'bom' | 'inspection' | 'transfer';
  entityId: string;
  entityName: string;
  description: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface ActivityLogProps {
  activities?: ActivityItem[];
  title?: string;
  description?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  maxItems?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const typeIcons: Record<string, typeof Plus> = {
  create: Plus,
  update: Edit,
  delete: Trash2,
  view: Eye,
  approve: CheckCircle,
  reject: XCircle,
  transfer: Truck,
  export: Download,
};

const typeColors: Record<string, string> = {
  create: 'text-success',
  update: 'text-primary',
  delete: 'text-destructive',
  view: 'text-muted-foreground',
  approve: 'text-success',
  reject: 'text-destructive',
  transfer: 'text-primary',
  export: 'text-primary',
};

const entityIcons: Record<string, typeof Package> = {
  product: Package,
  order: FileText,
  user: User,
  warehouse: Factory,
  work_order: Factory,
  bom: FileText,
  inspection: CheckCircle,
  transfer: Truck,
};

// Default mock activities
const defaultActivities: ActivityItem[] = [
  {
    id: 'act-001',
    type: 'create',
    entity: 'work_order',
    entityId: 'wo-890',
    entityName: 'WO-2024-0890',
    description: 'Created work order for Widget Pro X100',
    user: { id: 'user-001', name: 'John Smith' },
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'act-002',
    type: 'approve',
    entity: 'order',
    entityId: 'po-567',
    entityName: 'PO-2024-0567',
    description: 'Approved purchase order for raw materials',
    user: { id: 'user-002', name: 'Jane Doe' },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'act-003',
    type: 'update',
    entity: 'product',
    entityId: 'prod-001',
    entityName: 'SKU-001',
    description: 'Updated stock quantity from 150 to 200',
    user: { id: 'user-003', name: 'Bob Wilson' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'act-004',
    type: 'transfer',
    entity: 'transfer',
    entityId: 'tr-123',
    entityName: 'TR-2024-0123',
    description: 'Transferred 500 units to Secondary Warehouse',
    user: { id: 'user-001', name: 'John Smith' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'act-005',
    type: 'reject',
    entity: 'inspection',
    entityId: 'qc-458',
    entityName: 'QC-2024-0458',
    description: 'Rejected inspection due to surface defects',
    user: { id: 'user-004', name: 'Alice Brown' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'act-006',
    type: 'create',
    entity: 'bom',
    entityId: 'bom-005',
    entityName: 'Custom Assembly CA-100',
    description: 'Created new bill of materials',
    user: { id: 'user-004', name: 'Alice Brown' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'act-007',
    type: 'export',
    entity: 'product',
    entityId: 'export-001',
    entityName: 'Product Inventory',
    description: 'Exported product list to CSV',
    user: { id: 'user-002', name: 'Jane Doe' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'act-008',
    type: 'delete',
    entity: 'product',
    entityId: 'prod-old',
    entityName: 'SKU-OLD-001',
    description: 'Deleted discontinued product',
    user: { id: 'user-001', name: 'John Smith' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function ActivityLog({
  activities = defaultActivities,
  title = 'Activity Log',
  description = 'Recent actions and changes',
  showFilters = true,
  showSearch = true,
  maxItems,
  onLoadMore,
  hasMore = false,
}: ActivityLogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  const filteredActivities = activities.filter(activity => {
    if (typeFilter !== 'all' && activity.type !== typeFilter) return false;
    if (entityFilter !== 'all' && activity.entity !== entityFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        activity.description.toLowerCase().includes(search) ||
        activity.entityName.toLowerCase().includes(search) ||
        activity.user.name.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const displayedActivities = maxItems
    ? filteredActivities.slice(0, maxItems)
    : filteredActivities;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="flex flex-wrap gap-3">
            {showSearch && (
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
            {showFilters && (
              <div className="flex gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm bg-background"
                >
                  <option value="all">All Actions</option>
                  <option value="create">Created</option>
                  <option value="update">Updated</option>
                  <option value="delete">Deleted</option>
                  <option value="approve">Approved</option>
                  <option value="reject">Rejected</option>
                  <option value="transfer">Transferred</option>
                </select>
                <select
                  value={entityFilter}
                  onChange={(e) => setEntityFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm bg-background"
                >
                  <option value="all">All Types</option>
                  <option value="product">Products</option>
                  <option value="order">Orders</option>
                  <option value="work_order">Work Orders</option>
                  <option value="bom">BOMs</option>
                  <option value="inspection">Inspections</option>
                  <option value="transfer">Transfers</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Activity List */}
        <div className="space-y-3">
          {displayedActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No activities found</p>
            </div>
          ) : (
            displayedActivities.map((activity) => {
              const TypeIcon = typeIcons[activity.type] || Activity;
              const EntityIcon = entityIcons[activity.entity] || FileText;

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-full bg-muted ${typeColors[activity.type]}`}>
                    <TypeIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            <EntityIcon className="h-3 w-3 mr-1" />
                            {activity.entityName}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {activity.user.name}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Load More */}
        {(hasMore || (maxItems && filteredActivities.length > maxItems)) && (
          <div className="text-center pt-2">
            <Button variant="outline" size="sm" onClick={onLoadMore}>
              Load More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ActivityLog;
