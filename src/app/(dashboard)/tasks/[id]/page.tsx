'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Input,
  Breadcrumb,
} from '@/components/ui';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  MessageSquare,
  Paperclip,
  Send,
  AlertTriangle,
  FileText,
  History,
  ChevronRight,
  Loader2,
  Forward,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface TaskUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

interface RelatedEntity {
  type: string;
  id: string;
  reference: string;
  url: string;
}

interface TaskMetadata {
  totalAmount?: number;
  currency?: string;
  supplier?: string;
  itemCount?: number;
  [key: string]: unknown;
}

interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface TaskComment {
  id: string;
  user: {
    name: string;
    avatar?: string | null;
  };
  text: string;
  createdAt: string;
}

interface TaskHistoryEvent {
  action: string;
  user: string;
  timestamp: string;
}

interface TaskDetail {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  createdAt: string;
  assignedBy: TaskUser;
  assignedTo: TaskUser;
  relatedEntity?: RelatedEntity;
  metadata?: TaskMetadata;
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
  history?: TaskHistoryEvent[];
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Low', color: 'text-muted-foreground' },
  MEDIUM: { label: 'Medium', color: 'text-primary' },
  HIGH: { label: 'High', color: 'text-warning' },
  URGENT: { label: 'Urgent', color: 'text-destructive' },
};

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'secondary' }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  IN_PROGRESS: { label: 'In Progress', variant: 'default' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'secondary' },
};

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch task detail
  const { data: taskDetail, isLoading, error } = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/tasks/${taskId}`);
      return response.data.data as TaskDetail;
    },
    enabled: !!taskId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading task details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !taskDetail) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-medium text-destructive">Failed to load task</p>
            <p className="text-muted-foreground mb-4">The task could not be found or an error occurred</p>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOverdue = new Date(taskDetail.dueDate) < new Date() && taskDetail.status === 'PENDING';
  const timeRemaining = formatDistanceToNow(new Date(taskDetail.dueDate), { addSuffix: true });

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`/api/v1/tasks/${taskId}/approve`);
      toast.success('Task approved successfully');
      router.push('/tasks');
    } catch (err) {
      toast.error('Failed to approve task');
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`/api/v1/tasks/${taskId}/reject`);
      toast.success('Task rejected');
      router.push('/tasks');
    } catch (err) {
      toast.error('Failed to reject task');
      setIsSubmitting(false);
    }
  };

  const handleDelegate = async () => {
    // Delegate functionality - would typically open a modal
    toast.success('Delegation feature coming soon');
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`/api/v1/tasks/${taskId}/comments`, { text: newComment });
      toast.success('Comment added');
      setNewComment('');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{taskDetail.title}</h1>
              <Badge variant={statusConfig[taskDetail.status]?.variant || 'default'}>
                {statusConfig[taskDetail.status]?.label || taskDetail.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className={priorityConfig[taskDetail.priority]?.color || 'text-muted-foreground'}>
                {priorityConfig[taskDetail.priority]?.label || taskDetail.priority} Priority
              </span>
              <span>|</span>
              <span className={isOverdue ? 'text-destructive' : ''}>
                Due {timeRemaining}
              </span>
            </div>
          </div>
        </div>

        {taskDetail.status === 'PENDING' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDelegate}
              disabled={isSubmitting}
            >
              <Forward className="h-4 w-4 mr-2" />
              Delegate
            </Button>
            {taskDetail.type === 'APPROVAL' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleReject}
                  disabled={isSubmitting}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={handleApprove} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{taskDetail.description}</p>
            </CardContent>
          </Card>

          {/* Related Entity */}
          {taskDetail.relatedEntity && (
            <Card>
              <CardHeader>
                <CardTitle>Related Document</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => router.push(taskDetail.relatedEntity!.url)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{taskDetail.relatedEntity.reference}</p>
                      <p className="text-sm text-muted-foreground">{taskDetail.relatedEntity.type}</p>
                    </div>
                  </div>
                  {taskDetail.metadata?.totalAmount && (
                    <div className="text-right">
                      <p className="font-bold">
                        {taskDetail.metadata.currency || '$'}{taskDetail.metadata.totalAmount.toLocaleString()}
                      </p>
                      {taskDetail.metadata.itemCount && (
                        <p className="text-sm text-muted-foreground">{taskDetail.metadata.itemCount} items</p>
                      )}
                    </div>
                  )}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments ({taskDetail.comments?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {taskDetail.comments && taskDetail.comments.length > 0 ? (
                taskDetail.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">
                        {comment.user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
              )}

              {/* Add Comment */}
              <div className="flex gap-2 pt-4 border-t">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button size="icon" onClick={handleAddComment}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Assigned By</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs">{taskDetail.assignedBy.name.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium">{taskDetail.assignedBy.name}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned To</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs text-primary">{taskDetail.assignedTo.name.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium">{taskDetail.assignedTo.name}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm font-medium">
                  {new Date(taskDetail.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className={`text-sm font-medium ${isOverdue ? 'text-destructive' : ''}`}>
                  {new Date(taskDetail.dueDate).toLocaleDateString()}
                </p>
              </div>
              {taskDetail.metadata?.supplier && (
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="text-sm font-medium">{taskDetail.metadata.supplier}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          {taskDetail.attachments && taskDetail.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {taskDetail.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{attachment.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{attachment.size}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* History */}
          {taskDetail.history && taskDetail.history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {taskDetail.history.slice(0, 5).map((event, index) => (
                    <div key={index} className="flex gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground mt-1.5" />
                      <div>
                        <p>{event.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.user} | {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
