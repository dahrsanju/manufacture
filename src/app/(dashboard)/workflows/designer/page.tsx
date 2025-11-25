'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Badge,
  Breadcrumb,
  Modal,
} from '@/components/ui';
import {
  ArrowLeft,
  Save,
  Play,
  Pause,
  Plus,
  Trash2,
  Settings,
  Circle,
  Square,
  Diamond,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Bell,
  FileText,
  Users,
  GitBranch,
  Zap,
  MoreHorizontal,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Node types for the workflow
const nodeTypes = [
  {
    id: 'start',
    name: 'Start',
    icon: Circle,
    color: 'bg-success',
    category: 'flow',
    description: 'Workflow entry point',
  },
  {
    id: 'end',
    name: 'End',
    icon: Square,
    color: 'bg-destructive',
    category: 'flow',
    description: 'Workflow exit point',
  },
  {
    id: 'approval',
    name: 'Approval',
    icon: CheckCircle,
    color: 'bg-primary',
    category: 'action',
    description: 'Request approval from user',
  },
  {
    id: 'condition',
    name: 'Condition',
    icon: Diamond,
    color: 'bg-warning',
    category: 'logic',
    description: 'Branch based on conditions',
  },
  {
    id: 'email',
    name: 'Send Email',
    icon: Mail,
    color: 'bg-primary',
    category: 'action',
    description: 'Send email notification',
  },
  {
    id: 'notification',
    name: 'Notification',
    icon: Bell,
    color: 'bg-primary',
    category: 'action',
    description: 'Send in-app notification',
  },
  {
    id: 'task',
    name: 'Create Task',
    icon: FileText,
    color: 'bg-primary',
    category: 'action',
    description: 'Create a task for user',
  },
  {
    id: 'delay',
    name: 'Delay',
    icon: Clock,
    color: 'bg-secondary',
    category: 'logic',
    description: 'Wait for specified time',
  },
  {
    id: 'parallel',
    name: 'Parallel',
    icon: GitBranch,
    color: 'bg-secondary',
    category: 'logic',
    description: 'Execute branches in parallel',
  },
  {
    id: 'webhook',
    name: 'Webhook',
    icon: Zap,
    color: 'bg-primary',
    category: 'integration',
    description: 'Call external service',
  },
];

interface WorkflowNode {
  id: string;
  type: string;
  x: number;
  y: number;
  config: Record<string, unknown>;
}

interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export default function WorkflowDesignerPage() {
  const router = useRouter();
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: 'node-1', type: 'start', x: 100, y: 200, config: {} },
    { id: 'node-2', type: 'approval', x: 300, y: 200, config: { assignee: 'manager', timeout: '24h' } },
    { id: 'node-3', type: 'condition', x: 500, y: 200, config: { field: 'approved', operator: '==', value: 'true' } },
    { id: 'node-4', type: 'email', x: 700, y: 100, config: { template: 'approval_granted' } },
    { id: 'node-5', type: 'email', x: 700, y: 300, config: { template: 'approval_rejected' } },
    { id: 'node-6', type: 'end', x: 900, y: 200, config: {} },
  ]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([
    { id: 'conn-1', from: 'node-1', to: 'node-2' },
    { id: 'conn-2', from: 'node-2', to: 'node-3' },
    { id: 'conn-3', from: 'node-3', to: 'node-4', label: 'Yes' },
    { id: 'conn-4', from: 'node-3', to: 'node-5', label: 'No' },
    { id: 'conn-5', from: 'node-4', to: 'node-6' },
    { id: 'conn-6', from: 'node-5', to: 'node-6' },
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null);

  const getNodeType = (typeId: string) => nodeTypes.find(t => t.id === typeId);

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNodeType) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: draggedNodeType,
      x,
      y,
      config: {},
    };

    setNodes([...nodes, newNode]);
    setDraggedNodeType(null);
    toast.success('Node added to workflow');
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setIsPropertiesOpen(true);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
    setSelectedNode(null);
    toast.success('Node deleted');
  };

  const handleSave = async () => {
    // Validate workflow
    const hasStart = nodes.some(n => n.type === 'start');
    const hasEnd = nodes.some(n => n.type === 'end');

    if (!hasStart || !hasEnd) {
      toast.error('Workflow must have Start and End nodes');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Workflow saved successfully');
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);
  const selectedNodeType = selectedNodeData ? getNodeType(selectedNodeData.type) : null;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-xl font-bold border-none p-0 h-auto focus-visible:ring-0"
            />
            <p className="text-sm text-muted-foreground">Drag nodes from palette to canvas</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Test
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Designer Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Node Palette */}
        {isPaletteOpen && (
          <Card className="w-64 flex-shrink-0 overflow-hidden">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Node Palette</CardTitle>
            </CardHeader>
            <CardContent className="p-2 overflow-y-auto">
              <div className="space-y-4">
                {['flow', 'action', 'logic', 'integration'].map(category => (
                  <div key={category}>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-2 px-2">
                      {category}
                    </p>
                    <div className="space-y-1">
                      {nodeTypes.filter(n => n.category === category).map(nodeType => {
                        const Icon = nodeType.icon;
                        return (
                          <div
                            key={nodeType.id}
                            draggable
                            onDragStart={() => setDraggedNodeType(nodeType.id)}
                            onDragEnd={() => setDraggedNodeType(null)}
                            className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-move"
                          >
                            <div className={`p-1.5 rounded ${nodeType.color}`}>
                              <Icon className="h-3 w-3 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{nodeType.name}</p>
                              <p className="text-xs text-muted-foreground">{nodeType.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Canvas */}
        <div className="flex-1 bg-muted/30 rounded-lg border overflow-hidden relative">
          {/* Canvas Controls */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            >
              {isPaletteOpen ? 'Hide' : 'Show'} Palette
            </Button>
          </div>

          {/* Grid Background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, #ddd 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Canvas Drop Area */}
          <div
            className="absolute inset-0"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleCanvasDrop}
          >
            {/* Connections */}
            <svg className="absolute inset-0 pointer-events-none">
              {connections.map(conn => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const fromX = fromNode.x + 60;
                const fromY = fromNode.y + 20;
                const toX = toNode.x;
                const toY = toNode.y + 20;

                return (
                  <g key={conn.id}>
                    <path
                      d={`M ${fromX} ${fromY} C ${fromX + 50} ${fromY}, ${toX - 50} ${toY}, ${toX} ${toY}`}
                      stroke="#94a3b8"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                    />
                    {conn.label && (
                      <text
                        x={(fromX + toX) / 2}
                        y={(fromY + toY) / 2 - 5}
                        className="text-xs fill-muted-foreground"
                        textAnchor="middle"
                      >
                        {conn.label}
                      </text>
                    )}
                  </g>
                );
              })}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                </marker>
              </defs>
            </svg>

            {/* Nodes */}
            {nodes.map(node => {
              const nodeType = getNodeType(node.type);
              if (!nodeType) return null;
              const Icon = nodeType.icon;
              const isSelected = selectedNode === node.id;

              return (
                <div
                  key={node.id}
                  className={`absolute p-3 bg-background border-2 rounded-lg shadow-sm cursor-pointer transition-all ${
                    isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                  }`}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => handleNodeClick(node.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${nodeType.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{nodeType.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Properties Panel */}
        {isPropertiesOpen && selectedNodeData && selectedNodeType && (
          <Card className="w-80 flex-shrink-0 overflow-hidden">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Node Properties</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPropertiesOpen(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b">
                <div className={`p-2 rounded ${selectedNodeType.color}`}>
                  <selectedNodeType.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{selectedNodeType.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedNodeType.description}</p>
                </div>
              </div>

              {selectedNodeType.id === 'approval' && (
                <>
                  <Input
                    label="Assignee"
                    placeholder="e.g., manager, finance_team"
                    defaultValue={selectedNodeData.config.assignee as string || ''}
                  />
                  <Input
                    label="Timeout"
                    placeholder="e.g., 24h, 3d"
                    defaultValue={selectedNodeData.config.timeout as string || ''}
                  />
                </>
              )}

              {selectedNodeType.id === 'condition' && (
                <>
                  <Input
                    label="Field"
                    placeholder="e.g., status, amount"
                    defaultValue={selectedNodeData.config.field as string || ''}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Operator"
                      placeholder="==, >, <"
                      defaultValue={selectedNodeData.config.operator as string || ''}
                    />
                    <Input
                      label="Value"
                      placeholder="Value"
                      defaultValue={selectedNodeData.config.value as string || ''}
                    />
                  </div>
                </>
              )}

              {selectedNodeType.id === 'email' && (
                <>
                  <Input
                    label="Template"
                    placeholder="Template name"
                    defaultValue={selectedNodeData.config.template as string || ''}
                  />
                  <Input
                    label="Recipients"
                    placeholder="e.g., {{requester}}, admin@company.com"
                  />
                </>
              )}

              {selectedNodeType.id === 'delay' && (
                <Input
                  label="Duration"
                  placeholder="e.g., 1h, 30m, 2d"
                  defaultValue={selectedNodeData.config.duration as string || ''}
                />
              )}

              {selectedNodeType.id === 'task' && (
                <>
                  <Input
                    label="Task Title"
                    placeholder="Task title"
                  />
                  <Input
                    label="Assignee"
                    placeholder="User or role"
                  />
                </>
              )}

              <div className="pt-3 border-t">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteNode(selectedNodeData.id)}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Node
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between py-2 px-4 bg-muted/50 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{nodes.length} nodes</span>
          <span>{connections.length} connections</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Draft</Badge>
          <span>Last saved: Never</span>
        </div>
      </div>
    </div>
  );
}
