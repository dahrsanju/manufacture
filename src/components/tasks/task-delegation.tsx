'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui';
import { Search, User, ArrowRight, Clock, AlertTriangle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  workload: number;
  available: boolean;
}

interface TaskDelegationProps {
  taskId: string;
  taskTitle: string;
  currentAssignee: string;
  dueDate: string;
  onDelegate?: (userId: string, note: string) => void;
  onCancel?: () => void;
}

const mockTeamMembers: TeamMember[] = [
  { id: 'u1', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Manager', workload: 65, available: true },
  { id: 'u2', name: 'Mike Wilson', email: 'mike@company.com', role: 'Supervisor', workload: 80, available: true },
  { id: 'u3', name: 'Emily Davis', email: 'emily@company.com', role: 'Specialist', workload: 45, available: true },
  { id: 'u4', name: 'Robert Brown', email: 'robert@company.com', role: 'Coordinator', workload: 90, available: false },
  { id: 'u5', name: 'Lisa Chen', email: 'lisa@company.com', role: 'Analyst', workload: 55, available: true },
];

export function TaskDelegation({
  taskId,
  taskTitle,
  currentAssignee,
  dueDate,
  onDelegate,
  onCancel,
}: TaskDelegationProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const filteredMembers = mockTeamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWorkloadColor = (workload: number) => {
    if (workload >= 80) return 'text-destructive';
    if (workload >= 60) return 'text-warning';
    return 'text-success';
  };

  const handleDelegate = () => {
    if (selectedUser) {
      onDelegate?.(selectedUser, note);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delegate Task</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Task Info */}
        <div className="p-3 bg-muted/50 rounded-lg mb-4">
          <p className="font-medium">{taskTitle}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Current: {currentAssignee}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Due: {new Date(dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Team Members List */}
        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => member.available && setSelectedUser(member.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                selectedUser === member.id
                  ? 'border-primary bg-primary/5'
                  : member.available
                  ? 'hover:bg-muted'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-medium text-primary">
                  {member.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{member.name}</span>
                  {!member.available && (
                    <Badge variant="secondary">Unavailable</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${getWorkloadColor(member.workload)}`}>
                  {member.workload}%
                </p>
                <p className="text-xs text-muted-foreground">workload</p>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="text-sm font-medium">Note (Optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for the new assignee..."
            rows={2}
            className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
          />
        </div>

        {/* Warning if high workload */}
        {selectedUser && (mockTeamMembers.find((m) => m.id === selectedUser)?.workload ?? 0) >= 80 && (
          <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg mb-4 text-sm">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span>This team member has a high workload</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleDelegate} disabled={!selectedUser}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Delegate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
