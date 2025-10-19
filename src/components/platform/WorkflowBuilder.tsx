/**
 * Visual Workflow Builder Component
 * Drag-and-drop interface for creating automation workflows
 */

import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Eye,
  Trash2,
  Copy,
  Share,
  Zap,
  Bot,
  Database,
  Mail,
  Calendar,
  FileText,
  Webhook,
  Filter,
  ArrowRight,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { WorkflowNode, WorkflowTemplate } from '@/types/platform';

interface WorkflowBuilderProps {
  workflowId?: string;
  onSave?: (workflow: any) => void;
  onExecute?: (workflow: any) => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ 
  workflowId, 
  onSave, 
  onExecute 
}) => {
  const [workflow, setWorkflow] = useState({
    id: workflowId || 'new',
    name: 'Untitled Workflow',
    description: '',
    nodes: [] as WorkflowNode[],
    connections: [] as Array<{ from: string; to: string }>,
    status: 'draft' as 'draft' | 'active' | 'inactive'
  });

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Node types available in the palette
  const nodeTypes = [
    {
      type: 'trigger',
      label: 'Trigger',
      icon: Zap,
      color: 'bg-blue-500',
      description: 'Start your workflow with a trigger event'
    },
    {
      type: 'action',
      label: 'Action',
      icon: ArrowRight,
      color: 'bg-green-500',
      description: 'Perform an action or operation'
    },
    {
      type: 'condition',
      label: 'Condition',
      icon: Filter,
      color: 'bg-yellow-500',
      description: 'Add conditional logic to your workflow'
    },
    {
      type: 'ai_processing',
      label: 'AI Processing',
      icon: Bot,
      color: 'bg-purple-500',
      description: 'Use AI to process data or make decisions'
    },
    {
      type: 'data_transform',
      label: 'Data Transform',
      icon: Database,
      color: 'bg-orange-500',
      description: 'Transform or manipulate data'
    },
    {
      type: 'notification',
      label: 'Notification',
      icon: Mail,
      color: 'bg-red-500',
      description: 'Send notifications or alerts'
    }
  ];

  // Pre-built templates
  const templates: WorkflowTemplate[] = [
    {
      id: 'lead-qualification',
      name: 'Lead Qualification',
      description: 'Automatically qualify leads based on criteria',
      category: 'sales',
      difficulty: 'beginner',
      price: 0,
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          position: { x: 100, y: 100 },
          config: { event: 'form_submit' },
          connections: ['action-1'],
          metadata: {
            label: 'Form Submit',
            description: 'Triggered when a form is submitted',
            category: 'trigger',
            icon: 'form'
          }
        },
        {
          id: 'action-1',
          type: 'ai_processing',
          position: { x: 300, y: 100 },
          config: { model: 'gpt-4', prompt: 'Qualify this lead' },
          connections: ['condition-1'],
          metadata: {
            label: 'AI Qualification',
            description: 'Use AI to score and qualify the lead',
            category: 'ai',
            icon: 'bot'
          }
        },
        {
          id: 'condition-1',
          type: 'condition',
          position: { x: 500, y: 100 },
          config: { condition: 'score > 70' },
          connections: ['action-2', 'action-3'],
          metadata: {
            label: 'Score Check',
            description: 'Check if lead score is above threshold',
            category: 'logic',
            icon: 'filter'
          }
        }
      ],
      preview: '',
      downloads: 1250,
      rating: 4.8,
      tags: ['sales', 'lead-generation', 'ai'],
      author: {
        id: 'aias-team',
        name: 'AIAS Team',
        avatar: ''
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: type as any,
      position: { x: position.x - canvasPosition.x, y: position.y - canvasPosition.y },
      config: {},
      connections: [],
      metadata: {
        label: nodeTypes.find(nt => nt.type === type)?.label || type,
        description: nodeTypes.find(nt => nt.type === type)?.description || '',
        category: type,
        icon: type
      }
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  }, [canvasPosition]);

  const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      connections: prev.connections.filter(conn => 
        conn.from !== nodeId && conn.to !== nodeId
      )
    }));
    setSelectedNode(null);
  }, []);

  const connectNodes = useCallback((fromId: string, toId: string) => {
    setWorkflow(prev => ({
      ...prev,
      connections: [...prev.connections, { from: fromId, to: toId }]
    }));
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedNode(null);
    }
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
  };

  const handleNodeDrag = (nodeId: string, position: { x: number; y: number }) => {
    updateNode(nodeId, { position });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(workflow);
    }
  };

  const handleExecute = () => {
    if (onExecute) {
      onExecute(workflow);
    }
  };

  const loadTemplate = (template: WorkflowTemplate) => {
    setWorkflow(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      nodes: template.nodes.map(node => ({
        ...node,
        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })),
      connections: []
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Workflow Builder</h1>
            <div className="flex items-center gap-2">
              <Input
                value={workflow.name}
                onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
                className="w-64"
                placeholder="Workflow name"
              />
              <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                {workflow.status}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button size="sm" onClick={handleExecute}>
              <Play className="h-4 w-4 mr-2" />
              Execute
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Node Palette */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <h3 className="font-semibold mb-4">Node Types</h3>
          <div className="space-y-2">
            {nodeTypes.map((nodeType) => (
              <div
                key={nodeType.type}
                className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                draggable
                onDragStart={() => setDraggedNode(nodeType.type)}
                onDragEnd={() => setDraggedNode(null)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded ${nodeType.color} text-white`}>
                    <nodeType.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{nodeType.label}</div>
                    <div className="text-xs text-gray-500">{nodeType.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-4">Templates</h3>
            <div className="space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => loadTemplate(template)}
                >
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{template.description}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {template.difficulty}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {template.downloads} downloads
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <div
            ref={canvasRef}
            className="w-full h-full relative overflow-hidden bg-gray-100"
            onClick={handleCanvasClick}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedNode) {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect) {
                  addNode(draggedNode, {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                  });
                }
              }
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {/* Grid Background */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Workflow Nodes */}
            {workflow.nodes.map((node) => {
              const nodeType = nodeTypes.find(nt => nt.type === node.type);
              const Icon = nodeType?.icon || Zap;
              
              return (
                <div
                  key={node.id}
                  className={`absolute p-4 bg-white border-2 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all ${
                    selectedNode === node.id ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  style={{
                    left: node.position.x,
                    top: node.position.y,
                    transform: `scale(${zoom})`
                  }}
                  onClick={() => handleNodeClick(node.id)}
                  draggable
                  onDrag={(e) => {
                    const rect = canvasRef.current?.getBoundingClientRect();
                    if (rect) {
                      handleNodeDrag(node.id, {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                      });
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${nodeType?.color || 'bg-gray-500'} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{node.metadata.label}</div>
                      <div className="text-xs text-gray-500">{node.metadata.description}</div>
                    </div>
                  </div>
                  
                  {selectedNode === node.id && (
                    <div className="absolute -top-8 right-0 flex gap-1">
                      <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-6 w-6 p-0"
                        onClick={() => deleteNode(node.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Connections */}
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
              {workflow.connections.map((connection, index) => {
                const fromNode = workflow.nodes.find(n => n.id === connection.from);
                const toNode = workflow.nodes.find(n => n.id === connection.to);
                
                if (!fromNode || !toNode) return null;

                const fromX = fromNode.position.x + 100; // Approximate node center
                const fromY = fromNode.position.y + 50;
                const toX = toNode.position.x + 100;
                const toY = toNode.position.y + 50;

                return (
                  <line
                    key={index}
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="#6b7280"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
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
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6b7280"
                  />
                </marker>
              </defs>
            </svg>
          </div>
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <div className="w-80 bg-white border-l border-gray-200 p-4">
            <h3 className="font-semibold mb-4">Node Properties</h3>
            {(() => {
              const node = workflow.nodes.find(n => n.id === selectedNode);
              if (!node) return null;

              return (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="node-label">Label</Label>
                    <Input
                      id="node-label"
                      value={node.metadata.label}
                      onChange={(e) => updateNode(node.id, {
                        metadata: { ...node.metadata, label: e.target.value }
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="node-description">Description</Label>
                    <Textarea
                      id="node-description"
                      value={node.metadata.description}
                      onChange={(e) => updateNode(node.id, {
                        metadata: { ...node.metadata, description: e.target.value }
                      })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Configuration</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded border">
                      <pre className="text-xs text-gray-600">
                        {JSON.stringify(node.config, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;