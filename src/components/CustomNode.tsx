import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

const CustomNode = ({ data }: NodeProps) => {
  const isLeaf = data.type === 'leaf';
  const label = data.label as string;
  
  let borderColor = 'var(--primary)';
  let bgColor = 'rgba(30, 41, 59, 0.8)';
  let glowColor = 'var(--primary-glow)';

  if (isLeaf) {
    if (label === 'Yes' || label === '1') {
      borderColor = 'var(--emerald)';
      bgColor = 'rgba(16, 185, 129, 0.1)';
      glowColor = 'rgba(16, 185, 129, 0.4)';
    } else {
      borderColor = 'var(--rose)';
      bgColor = 'rgba(244, 63, 94, 0.1)';
      glowColor = 'rgba(244, 63, 94, 0.4)';
    }
  }

  return (
    <div className="custom-node-wrapper">
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div 
        className="node-circle" 
        style={{ 
          borderColor, 
          backgroundColor: bgColor,
          boxShadow: `0 0 15px ${glowColor}`,
          borderStyle: isLeaf ? 'solid' : 'dashed'
        }}
      >
        <span className="node-text">{label}</span>
      </div>
      <div style={{ 
        marginTop: '4px', 
        fontSize: '10px', 
        fontWeight: 700, 
        color: isLeaf ? (label === 'Yes' || label === '1' ? 'var(--emerald)' : 'var(--rose)') : 'var(--primary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        opacity: 0.8
      }}>
        {isLeaf ? 'Result' : 'Split'}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
};

export default memo(CustomNode);
