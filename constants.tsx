import { WorkflowData } from './types';

export const INITIAL_WORKFLOW: WorkflowData = {
  "version": 1,
  "meta": {
    "name": "Example ready to be deleted",
    "format": "reactflow",
    "notes": "Last updated: 23.12.2025, 19:21:54"
  },
  "nodes": [
    {
      "id": "node_1766517363124",
      "type": "custom",
      "position": {
        "x": 300,
        "y": 240
      },
      "data": {
        "label": "Start of module",
        "details": []
      }
    },
    {
      "id": "node_1766517364863",
      "type": "custom",
      "position": {
        "x": 300,
        "y": 390
      },
      "data": {
        "label": "Filewatcher active",
        "details": [
          "watching *.json for change"
        ]
      }
    },
    {
      "id": "node_1766517366889",
      "type": "custom",
      "position": {
        "x": 615,
        "y": 382
      },
      "data": {
        "label": "Read error",
        "details": [
          "*.json file corrupt or wrong syntax",
          "*.json file missing"
        ]
      }
    },
    {
      "id": "node_1766517370904",
      "type": "custom",
      "position": {
        "x": 300,
        "y": 540
      },
      "data": {
        "label": "Next step",
        "details": [
          "Next step"
        ]
      }
    },
    {
      "id": "node_1766517373585",
      "type": "custom",
      "position": {
        "x": 270,
        "y": 690
      },
      "data": {
        "label": "Last step",
        "details": [
          "Last step"
        ]
      }
    },
    {
      "id": "node_1766517561582",
      "type": "custom",
      "position": {
        "x": 300,
        "y": 120
      },
      "data": {
        "label": "Example 1",
        "details": []
      }
    }
  ],
  "edges": [
    {
      "id": "reactflow__edge-node_1766517363124bottom-source-node_1766517364863top-target",
      "source": "node_1766517363124",
      "target": "node_1766517364863",
      "sourceHandle": "bottom-source",
      "targetHandle": "top-target",
      "type": "smoothstep"
    },
    {
      "id": "reactflow__edge-node_1766517364863right-source-node_1766517366889left-target",
      "source": "node_1766517364863",
      "target": "node_1766517366889",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "type": "step"
    },
    {
      "id": "reactflow__edge-node_1766517364863bottom-source-node_1766517370904top-target",
      "source": "node_1766517364863",
      "target": "node_1766517370904",
      "sourceHandle": "bottom-source",
      "targetHandle": "top-target",
      "type": "smoothstep"
    },
    {
      "id": "reactflow__edge-node_1766517370904bottom-source-node_1766517373585top-target",
      "source": "node_1766517370904",
      "target": "node_1766517373585",
      "sourceHandle": "bottom-source",
      "targetHandle": "top-target",
      "type": "smoothstep"
    },
    {
      "id": "reactflow__edge-node_1766517373585left-source-node_1766517364863top-target",
      "source": "node_1766517373585",
      "target": "node_1766517364863",
      "sourceHandle": "left-source",
      "targetHandle": "top-target",
      "type": "smoothstep",
      "label": "back to filewatcher"
    },
    {
      "id": "reactflow__edge-node_1766517561582bottom-source-node_1766517363124top-target",
      "source": "node_1766517561582",
      "target": "node_1766517363124",
      "sourceHandle": "bottom-source",
      "targetHandle": "top-target",
      "type": "smoothstep"
    },
    {
      "id": "reactflow__edge-node_1766517366889right-source-node_1766517364863top-target",
      "source": "node_1766517366889",
      "target": "node_1766517364863",
      "sourceHandle": "right-source",
      "targetHandle": "top-target",
      "type": "smoothstep"
    }
  ]
};