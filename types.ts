import { Node, Edge } from 'reactflow';

export interface WorkflowData {
  version: number;
  meta: {
    name: string;
    format: string;
    notes: string;
  };
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
}

export interface CustomNodeData {
  label: string;
  details?: string[];
  isHighlighted?: boolean;
  isVisible?: boolean;
}

export enum AppMode {
  EDIT = 'EDIT',
  SEQUENCE = 'SEQUENCE'
}