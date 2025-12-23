import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  MarkerType,
  updateEdge,
  useReactFlow,
  OnNodesChange,
} from 'reactflow';
import { RotateCcw, Layout, Settings2, Trash2, Palette } from 'lucide-react';

import { INITIAL_WORKFLOW } from './constants';
import { AppMode, CustomNodeData } from './types';
import CustomNode from './components/CustomNode';
import ControlPanel from './components/ControlPanel';

const nodeTypes = {
  custom: CustomNode,
};

const GRID_STEP = 15;
const NODE_WIDTH = 256;
const STORAGE_KEY = 'flowstep_workflow_persistent';
const THEME_STORAGE_KEY = 'flowstep_theme_persistent';

const snap = (v: number) => Math.round(v / GRID_STEP) * GRID_STEP;

const getNodeSize = (n: any) => {
  const w = n?.measured?.width ?? n?.width ?? NODE_WIDTH;
  const h = n?.measured?.height ?? n?.height ?? 60;
  return { w, h };
};

const buildExportHtml = (data: any, themeColor: string) => {
  const safeData = JSON.stringify(data).replace(/</g, '\\u003c');
  const safeThemeColor = JSON.stringify(themeColor).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FlowStep Viewer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reactflow@11.11.4/dist/style.css" />
    <style>
      html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
      .react-flow__node {
        cursor: pointer;
      }
      .react-flow__edge-path {
        stroke-width: 3;
      }
      .react-flow__edge.selected .react-flow__edge-path {
        stroke: #6366f1;
        stroke-width: 4;
      }
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      @keyframes fade-in-up {
        from { opacity: 0; transform: translate(-50%, 10px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
      .animate-toast {
        animation: fade-in-up 0.3s ease-out forwards;
      }
    </style>
    <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.3.1",
    "react-dom": "https://esm.sh/react-dom@18.3.1",
    "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
    "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",
    "reactflow": "https://esm.sh/reactflow@11.11.4?external=react,react-dom"
  }
}
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      import React, { useCallback, useMemo, useState } from 'react';
      import ReactDOM from 'react-dom/client';
      import ReactFlow, {
        Background,
        Controls,
        MiniMap,
        MarkerType,
        Handle,
        Position,
        ReactFlowProvider,
        useNodesState,
        useEdgesState
      } from 'reactflow';

      const FLOWSTEP_DATA = ${safeData};
      const THEME_COLOR = ${safeThemeColor};
      const GRID_STEP = 15;

      const CustomNode = ({ data, selected }) => {
        const isHighlighted = data.isHighlighted;
        const isVisible = data.isVisible !== false;

        if (!isVisible) return React.createElement('div', { className: 'opacity-0 pointer-events-none' });

        const activeColor = 'var(--accent-color, #6366f1)';
        const handleClass = 'w-3 h-3 border-2 transition-colors duration-200';

        const DualHandle = ({ pos, idPrefix }) => (
          React.createElement(React.Fragment, null,
            React.createElement(Handle, {
              id: idPrefix + '-target',
              type: 'target',
              position: pos,
              className: handleClass + ' z-10',
              style: {
                visibility: 'visible',
                backgroundColor: isHighlighted ? activeColor : '#cbd5e1',
                borderColor: '#fff',
                ...(pos === Position.Top || pos === Position.Bottom ? { left: '50%', transform: 'translateX(-50%)' } : { top: '50%', transform: 'translateY(-50%)' }),
                ...(pos === Position.Top ? { top: '-7px' } : {}),
                ...(pos === Position.Bottom ? { bottom: '-7px' } : {}),
                ...(pos === Position.Left ? { left: '-7px' } : {}),
                ...(pos === Position.Right ? { right: '-7px' } : {})
              }
            }),
            React.createElement(Handle, {
              id: idPrefix + '-source',
              type: 'source',
              position: pos,
              className: handleClass + ' opacity-0 hover:opacity-100 z-20',
              style: {
                backgroundColor: isHighlighted ? activeColor : '#cbd5e1',
                borderColor: '#fff',
                ...(pos === Position.Top || pos === Position.Bottom ? { left: '50%', transform: 'translateX(-50%)' } : { top: '50%', transform: 'translateY(-50%)' }),
                ...(pos === Position.Top ? { top: '-7px' } : {}),
                ...(pos === Position.Bottom ? { bottom: '-7px' } : {}),
                ...(pos === Position.Left ? { left: '-7px' } : {}),
                ...(pos === Position.Right ? { right: '-7px' } : {})
              }
            })
          )
        );

        const baseClass = 'group relative px-4 py-3 rounded-xl border-2 transition-all duration-300 shadow-lg w-64';
        const stateClass = (isHighlighted ? 'bg-white ring-4' : 'bg-white border-slate-200') + (selected ? ' ring-2' : '');

        return (
          React.createElement('div', {
            className: baseClass + ' ' + stateClass,
            style: {
              borderColor: isHighlighted ? activeColor : (selected ? activeColor : undefined),
              '--tw-ring-color': isHighlighted ? activeColor + '33' : activeColor + '1a'
            }
          },
            React.createElement(DualHandle, { pos: Position.Top, idPrefix: 'top' }),
            React.createElement(DualHandle, { pos: Position.Left, idPrefix: 'left' }),
            React.createElement(DualHandle, { pos: Position.Right, idPrefix: 'right' }),
            React.createElement(DualHandle, { pos: Position.Bottom, idPrefix: 'bottom' }),
            React.createElement('div', { className: 'flex flex-col relative' },
              React.createElement('span', {
                className: 'text-sm font-bold mb-1 break-words flex-grow',
                style: { color: isHighlighted ? activeColor : '#1e293b' }
              }, data.label),
              data.details && data.details.length > 0 && (
                React.createElement('div', { className: 'mt-2 pt-2 border-t border-slate-100 min-h-[10px]' },
                  React.createElement('ul', { className: 'list-disc pl-4 space-y-1' },
                    data.details.map((detail, idx) => (
                      React.createElement('li', {
                        key: idx,
                        className: 'text-[10px] leading-tight text-slate-500 font-medium'
                      }, detail)
                    ))
                  )
                )
              )
            )
          )
        );
      };

      const nodeTypes = { custom: CustomNode };

      const AppContent = () => {
        const [nodes, setNodes, onNodesChange] = useNodesState(FLOWSTEP_DATA.nodes);
        const [edges, setEdges, onEdgesChange] = useEdgesState(FLOWSTEP_DATA.edges);
        const [mode, setMode] = useState('READER');
        const [visibleNodeIds, setVisibleNodeIds] = useState(new Set());
        const [activeNodeId, setActiveNodeId] = useState(null);

        const selectedNode = useMemo(() => nodes.find(n => n.selected), [nodes]);

        const initializeSequence = useCallback(() => {
          const firstNode = nodes.find(n => !edges.some(e => e.target === n.id)) || nodes[0];
          if (firstNode) {
            setVisibleNodeIds(new Set([firstNode.id]));
            setActiveNodeId(firstNode.id);
          }
        }, [nodes, edges]);

        const handleModeChange = useCallback((nextMode) => {
          setMode(nextMode);
          if (nextMode === 'SEQUENCE') {
            initializeSequence();
          } else {
            setVisibleNodeIds(new Set());
            setActiveNodeId(null);
          }
        }, [initializeSequence]);

        const advanceSequence = useCallback(() => {
          const nextNodeIds = new Set(Array.from(visibleNodeIds));
          let added = false;

          edges.forEach(edge => {
            if (visibleNodeIds.has(edge.source) && !nextNodeIds.has(edge.target)) {
              nextNodeIds.add(edge.target);
              added = true;
            }
          });

          if (added) setVisibleNodeIds(nextNodeIds);
        }, [visibleNodeIds, edges]);

        const onNodeClick = useCallback((_event, node) => {
          if (mode === 'SEQUENCE') {
            const targets = edges.filter(e => e.source === node.id).map(e => e.target);
            if (targets.length > 0) {
              setVisibleNodeIds(prev => {
                const next = new Set(prev);
                targets.forEach(t => next.add(t));
                return next;
              });
              setActiveNodeId(node.id);
            }
          }
        }, [mode, edges]);

        const displayNodes = useMemo(() => {
          return nodes.map(node => {
            const isVisible = mode === 'READER' || visibleNodeIds.has(node.id);
            const isHighlighted = mode === 'SEQUENCE' && activeNodeId === node.id;
            return {
              ...node,
              draggable: false,
              data: {
                ...node.data,
                isVisible,
                isHighlighted
              }
            };
          });
        }, [nodes, mode, visibleNodeIds, activeNodeId]);

        const displayEdges = useMemo(() => {
          return edges.map(edge => {
            const sourceVisible = mode === 'READER' || visibleNodeIds.has(edge.source);
            const targetVisible = mode === 'READER' || visibleNodeIds.has(edge.target);
            const isVisible = sourceVisible && targetVisible;

            return {
              ...edge,
              hidden: !isVisible,
              animated: mode === 'SEQUENCE' && isVisible,
              markerEnd: { type: MarkerType.ArrowClosed, color: isVisible ? THEME_COLOR : '#cbd5e1' },
              style: { stroke: isVisible ? THEME_COLOR : '#cbd5e1', strokeWidth: 2 }
            };
          });
        }, [edges, mode, visibleNodeIds]);

        const canGoNext = useMemo(() => {
          if (mode !== 'SEQUENCE') return false;
          return edges.some(e => {
            const sourceVisible = visibleNodeIds.has(e.source);
            const targetVisible = visibleNodeIds.has(e.target);
            return sourceVisible && !targetVisible;
          });
        }, [mode, edges, visibleNodeIds]);

        return (
          React.createElement('div', {
            className: 'w-full h-full bg-slate-50 relative overflow-hidden',
            style: { '--accent-color': THEME_COLOR }
          },
            React.createElement('div', { className: 'absolute top-6 left-6 z-50 flex flex-col gap-4 pointer-events-none' },
              React.createElement('div', { className: 'bg-white/90 backdrop-blur-md shadow-xl border border-slate-200 rounded-2xl p-1.5 flex gap-1 pointer-events-auto' },
                React.createElement('button', {
                  onClick: () => handleModeChange('READER'),
                  className: 'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-semibold ' +
                    (mode === 'READER' ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'),
                  style: mode === 'READER' ? { backgroundColor: THEME_COLOR } : {}
                }, 'Reader'),
                React.createElement('button', {
                  onClick: () => handleModeChange('SEQUENCE'),
                  className: 'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-semibold ' +
                    (mode === 'SEQUENCE' ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'),
                  style: mode === 'SEQUENCE' ? { backgroundColor: THEME_COLOR } : {}
                }, 'Sequence')
              ),
              mode === 'SEQUENCE' && (
                React.createElement('div', {
                  className: 'bg-white border shadow-lg rounded-2xl p-1.5 flex gap-1 pointer-events-auto items-start animate-in slide-in-from-left-4',
                  style: { borderColor: THEME_COLOR + '40' }
                },
                  React.createElement('button', {
                    onClick: initializeSequence,
                    className: 'p-2.5 rounded-xl transition-all hover:bg-slate-50',
                    style: { color: THEME_COLOR },
                    title: 'Reset Flow'
                  }, 'Reset'),
                  React.createElement('button', {
                    onClick: advanceSequence,
                    disabled: !canGoNext,
                    className: 'flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-sm text-white ' +
                      (canGoNext ? 'shadow-md active:scale-95' : 'opacity-40 cursor-not-allowed'),
                    style: canGoNext ? { backgroundColor: THEME_COLOR } : { backgroundColor: '#cbd5e1' }
                  }, 'Next')
                )
              )
            ),
            React.createElement(ReactFlow, {
              nodes: displayNodes,
              edges: displayEdges,
              onNodesChange,
              onEdgesChange,
              onNodeClick,
              nodeTypes,
              fitView: true,
              snapToGrid: true,
              snapGrid: [GRID_STEP, GRID_STEP],
              nodesDraggable: false,
              nodesConnectable: false,
              elementsSelectable: true,
              deleteKeyCode: null
            },
              React.createElement(Background, { color: '#cbd5e1', gap: 20 }),
              React.createElement(Controls, null),
              React.createElement(MiniMap, {
                nodeColor: (n) => (n.data && n.data.isHighlighted ? THEME_COLOR : '#fff'),
                maskColor: 'rgba(241, 245, 249, 0.6)'
              })
            ),
            React.createElement('div', {
              className: 'absolute top-6 right-6 z-50 w-72 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]'
            },
              React.createElement('div', { className: 'p-4 border-b border-slate-100 bg-slate-50/50' },
                React.createElement('h3', { className: 'text-slate-900 font-bold text-base' }, 'Node Details')
              ),
              React.createElement('div', { className: 'flex-grow overflow-y-auto p-4 space-y-4' },
                selectedNode ? (
                  React.createElement('div', { className: 'space-y-3' },
                    React.createElement('div', { className: 'text-sm font-bold text-slate-900' }, selectedNode.data.label),
                    selectedNode.data.details && selectedNode.data.details.length > 0 ? (
                      React.createElement('ul', { className: 'list-disc pl-5 space-y-1 text-xs text-slate-600' },
                        selectedNode.data.details.map((detail, idx) => (
                          React.createElement('li', { key: idx }, detail)
                        ))
                      )
                    ) : (
                      React.createElement('p', { className: 'text-xs text-slate-400' }, 'No details for this node.')
                    )
                  )
                ) : (
                  React.createElement('p', { className: 'text-xs text-slate-400' }, 'Select a node to view details.')
                )
              )
            ),
            mode === 'SEQUENCE' && (
              React.createElement('div', { className: 'absolute bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none' },
                React.createElement('div', {
                  className: 'bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-2xl border flex items-center gap-4 animate-bounce',
                  style: { borderColor: THEME_COLOR + '40' }
                },
                  React.createElement('span', { className: 'font-bold text-sm', style: { color: THEME_COLOR } },
                    canGoNext ? "Click a node or 'Next' to reveal" : 'Flow complete!'
                  )
                )
              )
            )
          )
        );
      };

      const App = () => (
        React.createElement(ReactFlowProvider, null, React.createElement(AppContent, null))
      );

      const rootElement = document.getElementById('root');
      const root = ReactDOM.createRoot(rootElement);
      root.render(React.createElement(React.StrictMode, null, React.createElement(App, null)));
    </script>
  </body>
</html>`;
};

const AppContent = () => {
  const edgeUpdateSuccessful = useRef(true);
  const reactFlowInstance = useReactFlow();

  // Theme State
  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || '#6366f1';
  });

  // Persistence Loading
  const loadInitialData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load from storage', e);
    }
    return INITIAL_WORKFLOW;
  };

  const initialData = loadInitialData();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);

  const [mode, setMode] = useState<AppMode>(AppMode.EDIT);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const [visibleNodeIds, setVisibleNodeIds] = useState<Set<string>>(new Set());
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // Track the currently selected node for editing in sidebar
  const selectedNode = useMemo(() => nodes.find(n => n.selected), [nodes]);
  const selectedEdge = useMemo(() => edges.find(e => e.selected), [edges]);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 5000);
  }, []);

  const handleSave = useCallback(() => {
    const dataToSave = {
      version: 1,
      meta: INITIAL_WORKFLOW.meta,
      nodes,
      edges,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    localStorage.setItem(THEME_STORAGE_KEY, themeColor);
    showToast('Layout and Theme saved!');
  }, [nodes, edges, themeColor, showToast]);

  const handleCopyConfig = useCallback(() => {
    const config = {
      version: 1,
      meta: { ...INITIAL_WORKFLOW.meta, notes: `Last updated: ${new Date().toLocaleString()}` },
      nodes: nodes.map(({ id, type, position, data }) => ({ 
        id, 
        type, 
        position, 
        data: { label: data.label, details: data.details } 
      })),
      edges: edges.map(({ id, source, target, sourceHandle, targetHandle, type, label }) => ({
        id,
        source,
        target,
        sourceHandle,
        targetHandle,
        type,
        label,
      })),
    };

    const code = `import { WorkflowData } from './types';\n\nexport const INITIAL_WORKFLOW: WorkflowData = ${JSON.stringify(
      config,
      null,
      2
    )};`;

    navigator.clipboard
      .writeText(code)
      .then(() => showToast('📋 Code copied! [CTRL+A] -> [CTRL+V] in constants.tsx'))
      .catch((err) => {
        console.error('Could not copy text: ', err);
        showToast('Copy failed');
      });
  }, [nodes, edges, showToast]);

  const handleExportPortableHtml = useCallback(() => {
    const exportData = {
      version: 1,
      meta: { ...INITIAL_WORKFLOW.meta, notes: `Snapshot: ${new Date().toLocaleString()}` },
      nodes: nodes.map(({ id, type, position, data }) => ({
        id,
        type,
        position,
        data: { label: data.label, details: data.details || [] }
      })),
      edges: edges.map(({ id, source, target, sourceHandle, targetHandle, type, label }) => ({
        id,
        source,
        target,
        sourceHandle,
        targetHandle,
        type,
        label
      }))
    };

    const html = buildExportHtml(exportData, themeColor);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `flowstep-viewer-${dateStamp}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    showToast('Portable HTML exported');
  }, [nodes, edges, themeColor, showToast]);

  const handleResetToDefault = useCallback(() => {
    if (confirm('Reset layout to original defaults? This will clear your saved changes.')) {
      setNodes(INITIAL_WORKFLOW.nodes);
      setEdges(INITIAL_WORKFLOW.edges);
      setThemeColor('#6366f1');
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(THEME_STORAGE_KEY);
      showToast('Reset to defaults');
    }
  }, [setNodes, setEdges, showToast]);

  const updateNodeLabel = (id: string, label: string) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, label } } : n));
  };

  const updateNodeDetails = (id: string, detailsString: string) => {
    const details = detailsString.split('\n').filter(s => s.trim().length > 0);
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, details } } : n));
  };

  const updateEdgeLabel = (id: string, label: string) => {
    setEdges((eds) => eds.map((e) => e.id === id ? { ...e, label } : e));
  };

  const onAddNode = useCallback(() => {
    const id = `node_${Date.now()}`;
    const newNode: Node<CustomNodeData> = {
      id,
      type: "custom",
      position: { x: snap(120), y: snap(200) },
      data: {
        label: "New Node",
        details: [],
      },
      selected: true,
    };

    setNodes((nds) => [
      ...nds.map(n => ({ ...n, selected: false })),
      newNode
    ]);
    showToast("Node added");
  }, [setNodes, showToast]);

  const initializeSequence = useCallback(() => {
    const firstNode = nodes.find((n) => !edges.some((e) => e.target === n.id)) || nodes[0];
    if (firstNode) {
      setVisibleNodeIds(new Set([firstNode.id]));
      setActiveNodeId(firstNode.id);
    }
  }, [nodes, edges]);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    if (newMode === AppMode.SEQUENCE) {
      initializeSequence();
    } else {
      setVisibleNodeIds(new Set());
      setActiveNodeId(null);
    }
  };

  const advanceSequence = useCallback(() => {
    const nextNodeIds = new Set<string>(Array.from(visibleNodeIds));
    let added = false;

    edges.forEach((edge) => {
      if (visibleNodeIds.has(edge.source) && !nextNodeIds.has(edge.target)) {
        nextNodeIds.add(edge.target);
        added = true;
      }
    });

    if (added) setVisibleNodeIds(nextNodeIds);
  }, [visibleNodeIds, edges]);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (mode === AppMode.SEQUENCE) {
        const targets = edges.filter((e) => e.source === node.id).map((e) => e.target);
        if (targets.length > 0) {
          setVisibleNodeIds((prev) => {
            const next = new Set(prev);
            targets.forEach((t) => next.add(t));
            return next;
          });
          setActiveNodeId(node.id);
        }
      }
    },
    [mode, edges]
  );

  const handleDelete = useCallback(() => {
    const selectedNodes = nodes.filter((n) => n.selected).map((n) => n.id);
    const selectedEdges = edges.filter((e) => e.selected).map((e) => e.id);

    if (selectedNodes.length === 0 && selectedEdges.length === 0) return;

    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) =>
      eds.filter(
        (e) => !e.selected && !selectedNodes.includes(e.source) && !selectedNodes.includes(e.target)
      )
    );

    showToast('Deleted selection');
  }, [nodes, edges, setNodes, setEdges, showToast]);

  const performLayout = useCallback(
    (type: string) => {
      const selectedNodes = nodes.filter((n) => n.selected);
      if (selectedNodes.length < 2) {
        showToast('Select 2+ nodes');
        return;
      }

      const anchor = selectedNodes[0];
      const { w: anchorW, h: anchorH } = getNodeSize(anchor);

      setNodes((nds) => {
        return nds.map((n) => {
          if (!n.selected || n.id === anchor.id) return n;

          const newNode = { ...n };
          const { w, h } = getNodeSize(n);

          switch (type) {
            case 'align-left':
              newNode.position.x = snap(anchor.position.x);
              break;
            case 'align-right':
              newNode.position.x = snap(anchor.position.x + anchorW - w);
              break;
            case 'align-x-center':
              newNode.position.x = snap(anchor.position.x + anchorW / 2 - w / 2);
              break;
            case 'align-y-center':
              newNode.position.y = anchor.position.y + anchorH / 2 - h / 2;
              break;
            case 'distribute-h': {
              const sorted = [...selectedNodes].sort((a, b) => a.position.x - b.position.x);
              const start = sorted[0].position.x;
              const end = sorted[sorted.length - 1].position.x;
              const step = (end - start) / (sorted.length - 1);
              const idx = sorted.findIndex((s) => s.id === n.id);
              if (idx !== -1) newNode.position.x = snap(start + idx * step);
              break;
            }
            case 'distribute-v': {
              const sorted = [...selectedNodes].sort((a, b) => a.position.y - b.position.y);
              const start = sorted[0].position.y;
              const end = sorted[sorted.length - 1].position.y;
              const step = (end - start) / (sorted.length - 1);
              const idx = sorted.findIndex((s) => s.id === n.id);
              if (idx !== -1) newNode.position.y = snap(start + idx * step);
              break;
            }
          }
          return newNode;
        });
      });
    },
    [nodes, setNodes, showToast]
  );

  const displayNodes = useMemo(() => {
    return nodes.map((node) => {
      const isVisible = mode === AppMode.EDIT || visibleNodeIds.has(node.id);
      const isHighlighted = mode === AppMode.SEQUENCE && activeNodeId === node.id;
      return {
        ...node,
        draggable: mode === AppMode.EDIT,
        data: { 
          ...node.data, 
          isVisible, 
          isHighlighted,
        },
      };
    });
  }, [nodes, mode, visibleNodeIds, activeNodeId]);

  const displayEdges = useMemo(() => {
    return edges.map((edge) => {
      const sourceVisible = mode === AppMode.EDIT || visibleNodeIds.has(edge.source);
      const targetVisible = mode === AppMode.EDIT || visibleNodeIds.has(edge.target);
      const isVisible = sourceVisible && targetVisible;

      return {
        ...edge,
        hidden: !isVisible,
        animated: mode === AppMode.SEQUENCE && isVisible,
        markerEnd: { type: MarkerType.ArrowClosed, color: isVisible ? themeColor : '#cbd5e1' },
        style: { stroke: isVisible ? themeColor : '#cbd5e1', strokeWidth: 2 },
      };
    });
  }, [edges, mode, visibleNodeIds, themeColor]);

  const onConnect = useCallback(
    (params: Connection) => {
      const isHorizontal = 
        (params.sourceHandle?.includes('left') || params.sourceHandle?.includes('right')) &&
        (params.targetHandle?.includes('left') || params.targetHandle?.includes('right'));

      const type = isHorizontal ? 'step' : 'smoothstep';

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type,
            markerEnd: { type: MarkerType.ArrowClosed, color: themeColor },
            style: { stroke: themeColor, strokeWidth: 2 }
          },
          eds
        )
      );
    },
    [setEdges, themeColor]
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((eds) => updateEdge(oldEdge, newConnection, eds));
    },
    [setEdges]
  );

  const onEdgeUpdateEnd = useCallback(
    (_: any, edge: Edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeUpdateSuccessful.current = true;
    },
    [setEdges]
  );

  const canGoNext = useMemo(() => {
    if (mode !== AppMode.SEQUENCE) return false;
    return edges.some((e) => {
      const sourceVisible = visibleNodeIds.has(e.source);
      const targetVisible = visibleNodeIds.has(e.target);
      return sourceVisible && !targetVisible;
    });
  }, [mode, edges, visibleNodeIds]);

  const hasSelection = useMemo(
    () => nodes.some((n) => n.selected) || edges.some((e) => e.selected),
    [nodes, edges]
  );

  // 1. Lokalen State oben in der Sidebar-Komponente definieren
  const [localDetails, setLocalDetails] = useState("");

  useEffect(() => {
    // Wenn nichts getippt wurde (Initialzustand), mach nichts
    if (localDetails === (selectedNode?.data.details?.join('\n') || '')) return;

    const timer = setTimeout(() => {
      updateNodeDetails(selectedNode.id, localDetails);
    }, 50); // 50ms warten nach dem letzten Tastendruck

    return () => clearTimeout(timer); // Timer löschen, wenn der User weitertippt
  }, [localDetails]);

  // sobald du eine andere Node anklickst.
  useEffect(() => {
    if (selectedNode) {
      setLocalDetails(selectedNode.data.details?.join('\n') || '');
    } else {
      setLocalDetails('');
    }
  }, [selectedNode?.id]); // Die [selectedNode?.id] ist hier der entscheidende Trigger!

  return (
    <div 
      className="w-full h-full bg-slate-50 relative overflow-hidden" 
      style={{ '--accent-color': themeColor } as any}
    >
      <ControlPanel
        mode={mode}
        themeColor={themeColor}
        onModeToggle={handleModeChange}
        onResetSequence={initializeSequence}
        onNextStep={advanceSequence}
        canGoNext={canGoNext}
        onSave={handleSave}
        onCopyConfig={handleCopyConfig}
        onLayoutAction={performLayout}
        onDelete={handleDelete}
        onAddNode={onAddNode}
        hasSelection={hasSelection}
        onExport={handleExportPortableHtml}
      />

      {toast.visible && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-slate-900 text-white rounded-full shadow-2xl text-sm font-bold flex items-center gap-2 animate-toast pointer-events-none">
          {toast.message}
        </div>
      )}

      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[GRID_STEP, GRID_STEP]}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode={['Control', 'Meta']}
      >
        <Background color="#cbd5e1" gap={20} />
        <Controls />
        <MiniMap
          nodeColor={(n) => (n.data?.isHighlighted ? themeColor : '#fff')}
          maskColor="rgba(241, 245, 249, 0.6)"
        />
      </ReactFlow>

      {/* RIGHT SIDEBAR */}
      <div className="absolute top-6 right-6 z-50 w-72 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          {selectedNode ? (
            <Settings2 size={18} style={{ color: themeColor }} />
          ) : selectedEdge ? (
            <Settings2 size={18} style={{ color: themeColor }} />
          ) : (
            <Palette size={18} style={{ color: themeColor }} />
          )}
          <h3 className="text-slate-900 font-bold text-base">
            {selectedNode ? 'Edit Node' : selectedEdge ? 'Edit Connection' : 'Global Settings'}
          </h3>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-5">
          {selectedNode ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Label</label>
                <input 
                  type="text" 
                  value={selectedNode.data.label}
                  onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': themeColor } as any}
                  placeholder="Enter title..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Details</label>
                <textarea
                  value={localDetails}
                  onChange={(e) => setLocalDetails(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  rows={6}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{ '--tw-ring-color': themeColor } as any}
                  placeholder="Info per line..."
                />
              </div>

              <button 
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-all border border-red-100"
              >
                <Trash2 size={14} />
                Delete Node
              </button>
            </div>
          ) : selectedEdge ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Label</label>
                <input
                  type="text"
                  value={selectedEdge.label || ''}
                  onChange={(e) => updateEdgeLabel(selectedEdge.id, e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': themeColor } as any}
                  placeholder="Enter label..."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Theme Accent Color</label>
                <div className="flex gap-2 items-center">
                  <div 
                    className="w-10 h-10 rounded-xl shadow-inner border border-slate-200 relative overflow-hidden"
                    style={{ backgroundColor: themeColor }}
                  >
                    <input 
                      type="color" 
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="flex-grow px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': themeColor } as any}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['#6366f1', '#fe5100', '#10b981', '#f59e0b', '#ec4899', '#0ea5e9'].map(color => (
                    <button 
                      key={color}
                      onClick={() => setThemeColor(color)}
                      className={`w-6 h-6 rounded-full border border-white shadow-sm ring-1 ring-slate-100 transition-transform hover:scale-110 active:scale-90 ${themeColor === color ? 'ring-2 ring-slate-400 scale-110' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  The accent color affects buttons, active borders, sequence highlights, and flow connections.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-slate-400 text-[10px] mb-3 uppercase tracking-wider font-bold">Persistence</p>
                <button
                  onClick={handleResetToDefault}
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all text-[11px] font-bold flex items-center justify-center gap-2"
                >
                  <RotateCcw size={14} />
                  Reset Defaults
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {mode === AppMode.SEQUENCE && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div 
            className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-2xl border flex items-center gap-4 animate-bounce"
            style={{ borderColor: `${themeColor}40` }}
          >
            <span className="font-bold text-sm" style={{ color: themeColor }}>
              {canGoNext ? "Click a node or 'Next' to reveal" : 'Flow complete!'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <ReactFlowProvider>
    <AppContent />
  </ReactFlowProvider>
);

export default App;
