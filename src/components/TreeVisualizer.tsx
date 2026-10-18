import React, { useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  type Edge, 
  type Node, 
  ConnectionLineType, 
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import * as d3 from 'd3';
import type { TreeNode } from '../utils/id3-core';
import CustomNode from './CustomNode';

interface TreeVisualizerProps {
  tree: TreeNode | null;
  targetAttr?: string;
}

const nodeTypes = {
  custom: CustomNode,
};

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ tree, targetAttr }) => {
  const { nodes, edges } = useMemo(() => {
    if (!tree) return { nodes: [], edges: [] };

    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];

    const transformNode = (node: TreeNode): any => {
      if (node.isLeaf) {
        return { name: node.label, type: 'leaf' };
      }
      return {
        name: node.attribute,
        type: 'node',
        children: Object.entries(node.children).map(([val, child]) => ({
          edgeValue: val,
          ...transformNode(child)
        }))
      };
    };

    const root = d3.hierarchy(transformNode(tree));
    const width = 1000;
    const height = 600;

    const treeLayout = d3.tree().size([width, height]);
    treeLayout(root);

    root.descendants().forEach((d: any, i: number) => {
      // Use more unique IDs to prevent React Flow position ghosting
      const nodeId = `tree-${targetAttr}-${i}`;
      
      flowNodes.push({
        id: nodeId,
        type: 'custom',
        data: { label: d.data.name, type: d.data.type, isTarget: d.data.type === 'leaf' },
        position: { x: d.x, y: d.y },
      });

      if (d.parent) {
        const parentIndex = root.descendants().indexOf(d.parent);
        flowEdges.push({
          id: `edge-${targetAttr}-${parentIndex}-${i}`,
          source: `tree-${targetAttr}-${parentIndex}`,
          target: nodeId,
          label: d.data.edgeValue || '',
          type: 'smoothstep',
          animated: true,
          style: { stroke: 'rgba(99, 102, 241, 0.4)', strokeWidth: 2 },
          labelStyle: { fill: '#94a3b8', fontWeight: 500, fontSize: 10 },
          labelBgStyle: { fill: 'rgba(15, 23, 42, 1)', fillOpacity: 0.9 },
          labelBgPadding: [6, 3] as [number, number],
          labelBgBorderRadius: 4,
        });
      }
    });

    return { nodes: flowNodes, edges: flowEdges };
  }, [tree, targetAttr]);

  if (!tree) return null;

  return (
    <div style={{ width: '100%', height: '600px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '1.5rem', overflow: 'hidden', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Background color="#334155" variant={d3.symbolCircle as any} />
        <Controls />
        <Panel position="top-left" style={{ margin: '1rem' }}>
          <div className="glass-card" style={{ margin: 0, padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(30, 41, 59, 0.9)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)' }}></div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>PREDICTING: {targetAttr?.toUpperCase()}</span>
          </div>
        </Panel>
        <Panel position="bottom-right" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '0.4rem', pointerEvents: 'none', marginRight: '3.5rem' }}>
          DRAG NODES TO REORGANIZE • SCROLL TO ZOOM
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default TreeVisualizer;
