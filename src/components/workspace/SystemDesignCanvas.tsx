'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Database,
  Server,
  Cpu,
  Globe,
  Radio,
  HardDrive,
  Activity,
  ArrowRight,
  FileCode,
  Shield,
  Zap,
} from 'lucide-react';
import { ArchitectureNode, ArchitectureEdge, ComponentType } from '@/types/systemDesign';

interface SystemDesignCanvasProps {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  onUpdateNodes: (nodes: ArchitectureNode[]) => void;
  onUpdateEdges: (edges: ArchitectureEdge[]) => void;
  apiContracts: string;
  onApiContractsChange: (val: string) => void;
  dataSchema: string;
  onDataSchemaChange: (val: string) => void;
  scalingAnalysis: string;
  onScalingAnalysisChange: (val: string) => void;
  failureScenarios: string;
  onFailureScenariosChange: (val: string) => void;
}

const PALETTE: { type: ComponentType; label: string; icon: any; color: string }[] = [
  { type: 'client', label: 'Client / App', icon: Globe, color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800' },
  { type: 'cdn', label: 'CDN Edge', icon: Radio, color: 'text-amber-400 bg-amber-950/40 border-amber-800' },
  { type: 'load_balancer', label: 'Load Balancer', icon: Activity, color: 'text-blue-400 bg-blue-950/40 border-blue-800' },
  { type: 'api_gateway', label: 'API Gateway', icon: Server, color: 'text-indigo-400 bg-indigo-950/40 border-indigo-800' },
  { type: 'service', label: 'Microservice', icon: Cpu, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' },
  { type: 'cache', label: 'Redis Cache', icon: Zap, color: 'text-rose-400 bg-rose-950/40 border-rose-800' },
  { type: 'queue', label: 'Kafka / SQS', icon: Layers, color: 'text-purple-400 bg-purple-950/40 border-purple-800' },
  { type: 'worker', label: 'Queue Worker', icon: Server, color: 'text-teal-400 bg-teal-950/40 border-teal-800' },
  { type: 'relational_db', label: 'PostgreSQL DB', icon: Database, color: 'text-blue-400 bg-blue-950/40 border-blue-800' },
  { type: 'nosql_db', label: 'NoSQL / ClickHouse', icon: HardDrive, color: 'text-orange-400 bg-orange-950/40 border-orange-800' },
];

export function SystemDesignCanvas({
  nodes,
  edges,
  onUpdateNodes,
  onUpdateEdges,
  apiContracts,
  onApiContractsChange,
  dataSchema,
  onDataSchemaChange,
  scalingAnalysis,
  onScalingAnalysisChange,
  failureScenarios,
  onFailureScenariosChange,
}: SystemDesignCanvasProps) {
  const [activeTab, setActiveTab] = useState<'canvas' | 'api' | 'schema' | 'scaling' | 'failures'>('canvas');
  const [connectFrom, setConnectFrom] = useState<string | null>(null);

  const handleAddNode = (type: ComponentType, defaultLabel: string) => {
    const newNode: ArchitectureNode = {
      id: `node-${Date.now()}`,
      type,
      label: `${defaultLabel} ${nodes.filter((n) => n.type === type).length + 1}`,
      x: 50 + (nodes.length % 4) * 160,
      y: 50 + Math.floor(nodes.length / 4) * 120,
      config: { technology: type === 'relational_db' ? 'PostgreSQL 16' : type === 'cache' ? 'Redis Cluster' : 'Go / Node.js' },
    };
    onUpdateNodes([...nodes, newNode]);
  };

  const handleDeleteNode = (id: string) => {
    onUpdateNodes(nodes.filter((n) => n.id !== id));
    onUpdateEdges(edges.filter((e) => e.fromNodeId !== id && e.toNodeId !== id));
  };

  const handleNodeClick = (nodeId: string) => {
    if (!connectFrom) {
      setConnectFrom(nodeId);
    } else {
      if (connectFrom !== nodeId) {
        // Create edge
        const newEdge: ArchitectureEdge = {
          id: `edge-${Date.now()}`,
          fromNodeId: connectFrom,
          toNodeId: nodeId,
          protocol: 'HTTPS',
        };
        onUpdateEdges([...edges, newEdge]);
      }
      setConnectFrom(null);
    }
  };

  const handleDeleteEdge = (edgeId: string) => {
    onUpdateEdges(edges.filter((e) => e.id !== edgeId));
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Top Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'canvas'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Architecture Diagram ({nodes.length} nodes)</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'api'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>API Design</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'schema'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Data Models</span>
          </button>

          <button
            onClick={() => setActiveTab('scaling')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'scaling'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Scalability & Sharding</span>
          </button>

          <button
            onClick={() => setActiveTab('failures')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'failures'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span>Failure Modes</span>
          </button>
        </div>

        {activeTab === 'canvas' && connectFrom && (
          <span className="text-xs text-amber-400 font-mono animate-pulse">
            Click another component to complete connection...
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'canvas' && (
          <div className="h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            {/* Palette Sidebar */}
            <div className="w-full md:w-60 p-4 bg-zinc-900/60 overflow-y-auto space-y-3 flex-shrink-0">
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Component Palette
              </div>
              <p className="text-[11px] text-zinc-500">
                Click to add building blocks to your architecture canvas:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {PALETTE.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.type}
                      onClick={() => handleAddNode(p.type, p.label)}
                      className={`p-2 rounded-lg border text-left text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity ${p.color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {edges.length > 0 && (
                <div className="pt-4 border-t border-zinc-800">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Active Connections ({edges.length})
                  </div>
                  <div className="space-y-1.5 text-xs font-mono">
                    {edges.map((e) => {
                      const from = nodes.find((n) => n.id === e.fromNodeId)?.label || 'Node';
                      const to = nodes.find((n) => n.id === e.toNodeId)?.label || 'Node';
                      return (
                        <div
                          key={e.id}
                          className="flex items-center justify-between p-1.5 rounded bg-zinc-950 border border-zinc-800 text-[11px]"
                        >
                          <span className="truncate">
                            {from} &rarr; {to}
                          </span>
                          <button
                            onClick={() => handleDeleteEdge(e.id)}
                            className="text-zinc-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Canvas Workspace */}
            <div className="flex-1 bg-black/40 p-6 overflow-auto relative min-h-[400px]">
              {nodes.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-zinc-500 text-xs">
                  <div>
                    <Layers className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                    <p>No components added yet.</p>
                    <p className="text-[11px] text-zinc-600 mt-1">
                      Add components from the palette to construct your architecture.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nodes.map((node) => {
                    const isSelected = connectFrom === node.id;
                    const connectedEdges = edges.filter(
                      (e) => e.fromNodeId === node.id || e.toNodeId === node.id
                    );

                    return (
                      <div
                        key={node.id}
                        className={`p-4 rounded-xl border bg-zinc-900 shadow-sm transition-all relative ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/20'
                            : 'border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-zinc-200">
                            {node.label}
                          </span>
                          <button
                            onClick={() => handleDeleteNode(node.id)}
                            className="text-zinc-500 hover:text-rose-400 p-1"
                            title="Delete Component"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-zinc-400 font-mono">
                          Tech: {node.config?.technology || node.type}
                        </div>

                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px]">
                          <span className="text-zinc-500 font-mono">
                            {connectedEdges.length} links
                          </span>
                          <button
                            onClick={() => handleNodeClick(node.id)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                              isSelected
                                ? 'bg-amber-500 text-black'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                            }`}
                          >
                            {isSelected ? 'Connecting...' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="h-full p-5 overflow-y-auto space-y-3 font-mono text-xs">
            <div className="font-sans">
              <h4 className="font-bold text-zinc-200">REST / RPC API Endpoints & Contracts</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Define the primary endpoints, request payloads, response schemas, and idempotency headers.
              </p>
            </div>
            <textarea
              rows={16}
              value={apiContracts}
              onChange={(e) => onApiContractsChange(e.target.value)}
              placeholder="e.g.&#10;POST /v1/checkout&#10;Headers:&#10;  Idempotency-Key: <uuid>&#10;Payload: { ... }&#10;Response: 202 Accepted { ... }"
              className="w-full h-[calc(100%-60px)] p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs font-mono"
            />
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="h-full p-5 overflow-y-auto space-y-3 font-mono text-xs">
            <div className="font-sans">
              <h4 className="font-bold text-zinc-200">Data Models, Schemas & Partitioning Keys</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Design the PostgreSQL DDL, DynamoDB primary/sort keys, or ClickHouse order-by keys.
              </p>
            </div>
            <textarea
              rows={16}
              value={dataSchema}
              onChange={(e) => onDataSchemaChange(e.target.value)}
              placeholder="e.g.&#10;CREATE TABLE orders (&#10;  id UUID PRIMARY KEY,&#10;  tenant_id UUID NOT NULL,&#10;  status VARCHAR(32) NOT NULL,&#10;  amount_cents BIGINT NOT NULL,&#10;  created_at TIMESTAMPTZ DEFAULT NOW()&#10;);&#10;CREATE INDEX idx_orders_tenant_created ON orders (tenant_id, created_at DESC);"
              className="w-full h-[calc(100%-60px)] p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs font-mono"
            />
          </div>
        )}

        {activeTab === 'scaling' && (
          <div className="h-full p-5 overflow-y-auto space-y-3 font-mono text-xs">
            <div className="font-sans">
              <h4 className="font-bold text-zinc-200">Horizontal Scaling, Caching & Sharding Strategy</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Describe how the system scales to handle peak QPS, cache invalidation, and database sharding.
              </p>
            </div>
            <textarea
              rows={16}
              value={scalingAnalysis}
              onChange={(e) => onScalingAnalysisChange(e.target.value)}
              placeholder="e.g.&#10;- Read Scaling: Redis Cluster with read replicas; cache-aside with 300s TTL.&#10;- Write Scaling: Consistent hashing on tenant_id; partitioned Kafka topics (32 partitions).&#10;- Database: Horizontal sharding via Citus / Vitess."
              className="w-full h-[calc(100%-60px)] p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs font-mono"
            />
          </div>
        )}

        {activeTab === 'failures' && (
          <div className="h-full p-5 overflow-y-auto space-y-3 font-mono text-xs">
            <div className="font-sans">
              <h4 className="font-bold text-zinc-200">Failure Modes, Fault Tolerance & High Availability</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Analyze single points of failure (SPOF), circuit breakers, dead-letter queues, and cross-region failover.
              </p>
            </div>
            <textarea
              rows={16}
              value={failureScenarios}
              onChange={(e) => onFailureScenariosChange(e.target.value)}
              placeholder="e.g.&#10;- Primary DB crash: Automated Multi-AZ failover with 15s RTO.&#10;- Message broker down: Local disk spooling and fallback retry buffers.&#10;- Third-party gateway timeout: Circuit breaker trips to OPEN after 5 failures."
              className="w-full h-[calc(100%-60px)] p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs font-mono"
            />
          </div>
        )}
      </div>
    </div>
  );
}

