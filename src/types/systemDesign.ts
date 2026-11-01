export type ComponentType = 
  | 'client' 
  | 'cdn' 
  | 'load_balancer' 
  | 'api_gateway' 
  | 'service' 
  | 'queue' 
  | 'cache' 
  | 'relational_db' 
  | 'nosql_db' 
  | 'object_storage' 
  | 'worker' 
  | 'monitoring';

export interface ArchitectureNode {
  id: string;
  type: ComponentType;
  label: string;
  x: number;
  y: number;
  config?: {
    technology?: string;
    throughput?: string;
    redundancy?: string;
    notes?: string;
  };
}

export interface ArchitectureEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  protocol?: 'HTTPS' | 'gRPC' | 'WebSocket' | 'AMQP/Kafka' | 'TCP' | 'SQL';
  label?: string;
}

export interface SystemDesignState {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  apiContracts: string;
  dataSchema: string;
  scalingAnalysis: string;
  failureScenarios: string;
}

