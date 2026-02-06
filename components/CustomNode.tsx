import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CustomNodeData } from '../types';

// Definition der visuellen Stile pro Kategorie (inline styles for reliability)
interface CategoryStyle {
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderRadius?: string;
  borderStyle?: string;
  borderWidth?: string;
  boxShadow?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  letterSpacing?: string;
}

const CATEGORY_CONFIG: Record<string, CategoryStyle> = {
  start: {
    color: '#047857',           // Dunkleres Smaragd-Grün für Text (Lesbarkeit)
    backgroundColor: '#ffffff',
    borderColor: '#b91c1c00',   // Wir nutzen hier eher einen sanften Schatten oder 
    borderRadius: '9999px',
    boxShadow: '0 2px 4px -1px rgba(16, 185, 129, 0.2)', // Grüner Schimmer
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  end: {
    color: '#334155',           // Milder Slate-Ton
    backgroundColor: '#f8fafc', // Fast Weiß, minimal bläulich
    borderColor: '#e2e8f0',     // Dezenter Rand
    borderRadius: '9999px',
    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.05)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  decision: {
    color: '#0369a1',           // Gedämpftes Blau
    backgroundColor: '#ffffff',
    borderColor: '#bae6fd',     // Sanfter blauer Rand
    borderStyle: 'dashed',      // Formsprache: Entscheidung ist "offen/flexibel"
  },
  error: {
    color: '#b91c1c',           // Gedämpftes Rot
    backgroundColor: '#ffffff',
    borderColor: '#fecaca',     // Weicher roter Rand
  },
  process: {
    color: '#475569',           // Neutrales Slate-Grau
    backgroundColor: '#ffffff',
    borderColor: '#f1f5f9',     // Sehr heller, dezenter Rand
  },
};

const CustomNode = ({ id, data, selected }: NodeProps<CustomNodeData>) => {
  const isHighlighted = data.isHighlighted;
  const isVisible = data.isVisible !== false;

  // Bestimme die Kategorie (Default ist 'process')
  const category = data.category || 'process';
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.process;
  const activeColor = config.color;

  if (!isVisible) return <div className="opacity-0 pointer-events-none" />;

  const handleClass = `w-2.5 h-2.5 border-2 transition-colors duration-200`;

  // Positions for handles: 25%, 50%, 75%
  const HANDLE_POSITIONS = ['25%', '50%', '75%'];

  const TripleHandle = ({ pos, idPrefix }: { pos: Position; idPrefix: string }) => {
    const isVertical = pos === Position.Top || pos === Position.Bottom;

    return (
      <>
        {HANDLE_POSITIONS.map((offset, idx) => {
          const positionStyle = isVertical
            ? { left: offset, transform: 'translateX(-50%)' }
            : { top: offset, transform: 'translateY(-50%)' };

          const edgeStyle = {
            ...(pos === Position.Top ? { top: '-6px' } : {}),
            ...(pos === Position.Bottom ? { bottom: '-6px' } : {}),
            ...(pos === Position.Left ? { left: '-6px' } : {}),
            ...(pos === Position.Right ? { right: '-6px' } : {}),
          };

          return (
            <React.Fragment key={`${idPrefix}-${idx}`}>
              <Handle
                id={`${idPrefix}-${idx + 1}-target`}
                type="target"
                position={pos}
                className={`${handleClass} z-10`}
                style={{
                  visibility: 'visible',
                  backgroundColor: isHighlighted ? activeColor : '#cbd5e1',
                  borderColor: '#fff',
                  ...positionStyle,
                  ...edgeStyle,
                }}
              />
              <Handle
                id={`${idPrefix}-${idx + 1}-source`}
                type="source"
                position={pos}
                className={`${handleClass} opacity-0 hover:opacity-100 z-20`}
                style={{
                  backgroundColor: isHighlighted ? activeColor : '#cbd5e1',
                  borderColor: '#fff',
                  ...positionStyle,
                  ...edgeStyle,
                }}
              />
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return (
    <div
      className={`
        group relative px-4 py-3 transition-all duration-300 w-64
        ${isHighlighted ? 'ring-4' : ''}
        ${selected ? 'ring-2' : ''}
      `}
      style={{
        backgroundColor: config.backgroundColor,
        borderColor: isHighlighted ? activeColor : (selected ? activeColor : config.borderColor),
        borderRadius: config.borderRadius || '0.75rem', // default to rounded-xl
        borderStyle: config.borderStyle || 'solid',
        borderWidth: config.borderWidth || '2px',
        boxShadow: config.boxShadow,
        '--tw-ring-color': isHighlighted ? `${activeColor}33` : `${activeColor}1a`,
      } as React.CSSProperties}
    >
      <TripleHandle pos={Position.Top} idPrefix="top" />
      <TripleHandle pos={Position.Left} idPrefix="left" />
      <TripleHandle pos={Position.Right} idPrefix="right" />
      <TripleHandle pos={Position.Bottom} idPrefix="bottom" />

      <div className="flex flex-col relative text-center">
        <span
          className="text-sm font-bold mb-1 break-words flex-grow"
          style={{
            color: isHighlighted ? activeColor : (category === 'process' ? '#1e293b' : activeColor),
            textTransform: config.textTransform || 'none',
            letterSpacing: config.letterSpacing || 'normal',
          }}
        >
          {data.label}
        </span>

        {data.details && data.details.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-100 min-h-[10px]">
            <ul className="list-disc pl-4 space-y-1 text-left">
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