'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { GitBranch, Clock, User, Play, Archive, RotateCcw, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface WorkflowVersion {
  id: string;
  version: string;
  status: 'draft' | 'active' | 'archived';
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
  changes: string;
  instances: number;
}

interface WorkflowVersionManagerProps {
  workflowName: string;
  versions: WorkflowVersion[];
  onActivate?: (version: WorkflowVersion) => void;
  onArchive?: (version: WorkflowVersion) => void;
  onView?: (version: WorkflowVersion) => void;
  onRevert?: (version: WorkflowVersion) => void;
}

const mockVersions: WorkflowVersion[] = [
  { id: 'v4', version: 'v1.3', status: 'draft', createdBy: 'John Smith', createdAt: '2024-11-24T10:00:00', changes: 'Added approval timeout', instances: 0 },
  { id: 'v3', version: 'v1.2', status: 'active', createdBy: 'Sarah Johnson', createdAt: '2024-11-20T14:30:00', publishedAt: '2024-11-21T09:00:00', changes: 'Updated notification template', instances: 45 },
  { id: 'v2', version: 'v1.1', status: 'archived', createdBy: 'John Smith', createdAt: '2024-11-15T11:00:00', publishedAt: '2024-11-16T08:00:00', changes: 'Added manager approval step', instances: 128 },
  { id: 'v1', version: 'v1.0', status: 'archived', createdBy: 'Sarah Johnson', createdAt: '2024-11-01T09:00:00', publishedAt: '2024-11-02T09:00:00', changes: 'Initial version', instances: 312 },
];

const statusConfig = {
  draft: { color: 'secondary', label: 'Draft' },
  active: { color: 'success', label: 'Active' },
  archived: { color: 'default', label: 'Archived' },
};

export function WorkflowVersionManager({
  workflowName = 'Purchase Order Approval',
  versions = mockVersions,
  onActivate,
  onArchive,
  onView,
  onRevert,
}: WorkflowVersionManagerProps) {
  const activeVersion = versions.find((v) => v.status === 'active');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Version History
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{workflowName}</p>
          </div>
          {activeVersion && (
            <Badge variant="success">Current: {activeVersion.version}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {versions.map((version) => {
            const config = statusConfig[version.status];

            return (
              <div
                key={version.id}
                className={`p-4 rounded-lg border ${
                  version.status === 'active' ? 'border-success bg-success/5' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{version.version}</span>
                      <Badge variant={config.color as any}>{config.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{version.changes}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{version.instances} instances</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {version.createdBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView?.(version)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>

                    {version.status === 'draft' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onActivate?.(version)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Activate
                      </Button>
                    )}

                    {version.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onArchive?.(version)}
                      >
                        <Archive className="h-3 w-3 mr-1" />
                        Archive
                      </Button>
                    )}

                    {version.status === 'archived' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRevert?.(version)}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Revert
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
