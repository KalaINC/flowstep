import React from 'react';
import { AppMode } from '../types';
import { 
  Play, 
  Edit2, 
  RotateCcw, 
  ChevronRight, 
  Save, 
  AlignLeft, 
  AlignRight, 
  AlignCenterVertical, 
  AlignCenterHorizontal, 
  BetweenVerticalEnd, 
  BetweenHorizontalEnd,
  Trash2,
  Copy,
  Plus,
  ExternalLink
} from 'lucide-react';

interface ControlPanelProps {
  mode: AppMode;
  themeColor: string;
  onModeToggle: (mode: AppMode) => void;
  onResetSequence: () => void;
  onNextStep: () => void;
  canGoNext: boolean;
  onSave: () => void;
  onCopyConfig: () => void;
  onLayoutAction: (type: string) => void;
  onDelete: () => void;
  onAddNode: () => void;
  hasSelection: boolean;
  onExport: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  mode, 
  themeColor,
  onModeToggle, 
  onResetSequence, 
  onNextStep,
  canGoNext,
  onSave,
  onCopyConfig,
  onLayoutAction,
  onDelete,
  onAddNode,
  hasSelection,
  onExport
}) => {
  return (
    <div className="absolute top-6 left-6 z-50 flex flex-col gap-4 pointer-events-none">
      {/* Main Mode Toggle */}
      <div className="bg-white/90 backdrop-blur-md shadow-xl border border-slate-200 rounded-2xl p-1.5 flex gap-1 pointer-events-auto">
        <button
          onClick={() => onModeToggle(AppMode.EDIT)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-semibold
            ${mode === AppMode.EDIT ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
          style={mode === AppMode.EDIT ? { backgroundColor: themeColor } : {}}
        >
          <Edit2 size={16} />
          Editor
        </button>
        <button
          onClick={() => onModeToggle(AppMode.SEQUENCE)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-semibold
            ${mode === AppMode.SEQUENCE ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}
          style={mode === AppMode.SEQUENCE ? { backgroundColor: themeColor } : {}}
        >
          <Play size={16} />
          Sequence
        </button>
      </div>

      {/* Mode Specific Controls */}
      <div className="flex gap-2 pointer-events-auto items-start">
        {mode === AppMode.SEQUENCE && (
          <div className="bg-white border shadow-lg rounded-2xl p-1.5 flex gap-1 animate-in slide-in-from-left-4" style={{ borderColor: `${themeColor}40` }}>
            <button
              onClick={onResetSequence}
              className="p-2.5 rounded-xl transition-all hover:bg-slate-50"
              style={{ color: themeColor }}
              title="Reset Flow"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={onNextStep}
              disabled={!canGoNext}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-sm text-white
                ${canGoNext ? 'shadow-md active:scale-95' : 'opacity-40 cursor-not-allowed'}`}
              style={canGoNext ? { backgroundColor: themeColor } : { backgroundColor: '#cbd5e1' }}
            >
              Next Step
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {mode === AppMode.EDIT && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-left-4">
            <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-1.5 flex flex-wrap gap-1 max-w-[400px]">
              <button
                onClick={onAddNode}
                className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl transition-all font-bold text-sm shadow-md"
                style={{ backgroundColor: themeColor }}
                title="Add New Node"
              >
                <Plus size={18} />
                Add Node
              </button>

              <button
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white hover:bg-slate-900 rounded-xl transition-all font-bold text-sm shadow-md"
                title="Save Changes"
              >
                <Save size={18} />
                Save
              </button>
              
              <button
                onClick={onCopyConfig}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all font-bold text-sm shadow-sm"
                title="Copy Configuration"
              >
                <Copy size={18} />
                Config
              </button>
              
              {hasSelection && (
                <button
                  onClick={onDelete}
                  className="flex items-center justify-center w-11 h-11 bg-red-500 text-white hover:bg-red-600 rounded-xl transition-all font-bold shadow-md animate-in zoom-in-95"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            {hasSelection && (
              <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-1.5 flex gap-1 animate-in zoom-in-95">
                <button onClick={() => onLayoutAction('align-x-center')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600" title="Vertikal untereinander ausrichten">
                  <AlignCenterVertical size={18} />
                </button>
                <button onClick={() => onLayoutAction('align-y-center')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600" title="Horizontal auf eine Linie bringen">
                  <AlignCenterHorizontal size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Export Controls - Additional Div */}
      <div className="bg-white/90 backdrop-blur-md shadow-xl border border-slate-200 rounded-2xl p-1.5 flex pointer-events-auto self-start">
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 rounded-xl transition-all font-bold text-sm shadow-sm border border-slate-100"
          title="Export current flow as read-only"
        >
          <ExternalLink size={16} style={{ color: themeColor }} />
          Export Portable HTML as read-only
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
