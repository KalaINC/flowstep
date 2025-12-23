import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CustomNodeData } from '../types';

const CustomNode = ({ id, data, selected }: NodeProps<CustomNodeData>) => {
  const isHighlighted = data.isHighlighted;
  const isVisible = data.isVisible !== false;

  if (!isVisible) return <div className="opacity-0 pointer-events-none" />;

  // Using CSS variable --accent-color set on the root
  const activeColor = 'var(--accent-color, #6366f1)';

  const handleClass = `w-3 h-3 border-2 transition-colors duration-200`;

  const DualHandle = ({ pos, idPrefix }: { pos: Position; idPrefix: string }) => (
    <>
      <Handle
        id={`${idPrefix}-target`}
        type="target"
        position={pos}
        className={`${handleClass} z-10`}
        style={{ 
          visibility: 'visible',
          backgroundColor: isHighlighted ? activeColor : '#cbd5e1',
          borderColor: '#fff',
          ...(pos === Position.Top || pos === Position.Bottom ? { left: '50%', transform: 'translateX(-50%)' } : { top: '50%', transform: 'translateY(-50%)' }),
          ...(pos === Position.Top ? { top: '-7px' } : {}),
          ...(pos === Position.Bottom ? { bottom: '-7px' } : {}),
          ...(pos === Position.Left ? { left: '-7px' } : {}),
          ...(pos === Position.Right ? { right: '-7px' } : {}),
        }}
      />
      <Handle
        id={`${idPrefix}-source`}
        type="source"
        position={pos}
        className={`${handleClass} opacity-0 hover:opacity-100 z-20`}
        style={{ 
          backgroundColor: isHighlighted ? activeColor : '#cbd5e1',
          borderColor: '#fff',
          ...(pos === Position.Top || pos === Position.Bottom ? { left: '50%', transform: 'translateX(-50%)' } : { top: '50%', transform: 'translateY(-50%)' }),
          ...(pos === Position.Top ? { top: '-7px' } : {}),
          ...(pos === Position.Bottom ? { bottom: '-7px' } : {}),
          ...(pos === Position.Left ? { left: '-7px' } : {}),
          ...(pos === Position.Right ? { right: '-7px' } : {}),
        }}
      />
    </>
  );

  return (
    <div
      className={`
      group relative px-4 py-3 rounded-xl border-2 transition-all duration-300 shadow-lg w-64
      ${isHighlighted ? 'bg-white ring-4' : 'bg-white border-slate-200'}
      ${selected ? 'ring-2' : ''}
    `}
      style={{ 
        borderColor: isHighlighted ? activeColor : (selected ? activeColor : undefined),
        '--tw-ring-color': isHighlighted ? `${activeColor}33` : `${activeColor}1a`
      } as any}
    >
      <DualHandle pos={Position.Top} idPrefix="top" />
      <DualHandle pos={Position.Left} idPrefix="left" />
      <DualHandle pos={Position.Right} idPrefix="right" />
      <DualHandle pos={Position.Bottom} idPrefix="bottom" />

      <div className="flex flex-col relative">
        <span 
          className="text-sm font-bold mb-1 break-words flex-grow"
          style={{ color: isHighlighted ? activeColor : '#1e293b' }}
        >
          {data.label}
        </span>

        {data.details && data.details.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-100 min-h-[10px]">
            <ul className="list-disc pl-4 space-y-1">
              {data.details.map((detail, idx) => (
                <li key={idx} className="text-[10px] leading-tight text-slate-500 font-medium">
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CustomNode);