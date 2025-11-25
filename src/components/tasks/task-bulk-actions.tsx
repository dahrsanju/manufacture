'use client';

import { useState } from 'react';
import { Button, Badge } from '@/components/ui';
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Clock,
  Trash2,
  Tag,
  User,
  X
} from 'lucide-react';

interface TaskBulkActionsProps {
  selectedCount: number;
  onApprove?: () => void;
  onReject?: () => void;
  onDelegate?: () => void;
  onSetPriority?: (priority: string) => void;
  onSetDueDate?: () => void;
  onDelete?: () => void;
  onClearSelection?: () => void;
}

export function TaskBulkActions({
  selectedCount,
  onApprove,
  onReject,
  onDelegate,
  onSetPriority,
  onSetDueDate,
  onDelete,
  onClearSelection,
}: TaskBulkActionsProps) {
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="default">{selectedCount}</Badge>
          <span className="text-sm font-medium">selected</span>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onApprove}>
            <CheckCircle className="h-4 w-4 mr-1 text-success" />
            Approve
          </Button>

          <Button variant="outline" size="sm" onClick={onReject}>
            <XCircle className="h-4 w-4 mr-1 text-destructive" />
            Reject
          </Button>

          <Button variant="outline" size="sm" onClick={onDelegate}>
            <User className="h-4 w-4 mr-1" />
            Delegate
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPriorityMenu(!showPriorityMenu)}
            >
              <Tag className="h-4 w-4 mr-1" />
              Priority
            </Button>

            {showPriorityMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-background border rounded-md shadow-lg py-1 min-w-[120px]">
                {['high', 'medium', 'low'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      onSetPriority?.(priority);
                      setShowPriorityMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-sm text-left hover:bg-muted capitalize"
                  >
                    {priority}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button variant="outline" size="sm" onClick={onSetDueDate}>
            <Clock className="h-4 w-4 mr-1" />
            Due Date
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
