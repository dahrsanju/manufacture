'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface ValidationIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  nodeId?: string;
  nodeName?: string;
}

interface WorkflowValidationProps {
  issues: ValidationIssue[];
  onIssueClick?: (issue: ValidationIssue) => void;
}

const mockIssues: ValidationIssue[] = [
  { id: 'v1', type: 'error', message: 'No end node found in workflow', nodeId: undefined, nodeName: undefined },
  { id: 'v2', type: 'error', message: 'Disconnected node detected', nodeId: 'node-5', nodeName: 'Approval Step' },
  { id: 'v3', type: 'warning', message: 'No timeout configured for user task', nodeId: 'node-3', nodeName: 'Manager Review' },
  { id: 'v4', type: 'warning', message: 'Email notification not configured', nodeId: 'node-4', nodeName: 'Notify Requester' },
  { id: 'v5', type: 'info', message: 'Consider adding error handling for external service call', nodeId: 'node-6', nodeName: 'API Integration' },
];

const issueConfig = {
  error: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', badge: 'destructive' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', badge: 'warning' },
  info: { icon: Info, color: 'text-primary', bg: 'bg-primary/10', badge: 'default' },
};

export function WorkflowValidation({
  issues = mockIssues,
  onIssueClick,
}: WorkflowValidationProps) {
  const errorCount = issues.filter((i) => i.type === 'error').length;
  const warningCount = issues.filter((i) => i.type === 'warning').length;
  const infoCount = issues.filter((i) => i.type === 'info').length;
  const isValid = errorCount === 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isValid ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            Workflow Validation
          </CardTitle>
          <div className="flex gap-2">
            {errorCount > 0 && (
              <Badge variant="destructive">{errorCount} Errors</Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="warning">{warningCount} Warnings</Badge>
            )}
            {infoCount > 0 && (
              <Badge variant="secondary">{infoCount} Info</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
            <p className="text-lg font-medium">Workflow is valid</p>
            <p className="text-sm text-muted-foreground">No issues detected</p>
          </div>
        ) : (
          <div className="space-y-2">
            {issues.map((issue) => {
              const config = issueConfig[issue.type];
              const Icon = config.icon;

              return (
                <div
                  key={issue.id}
                  onClick={() => onIssueClick?.(issue)}
                  className={`flex items-start gap-3 p-3 rounded-lg ${config.bg} cursor-pointer hover:opacity-80`}
                >
                  <Icon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{issue.message}</p>
                    {issue.nodeName && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Node: {issue.nodeName}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
