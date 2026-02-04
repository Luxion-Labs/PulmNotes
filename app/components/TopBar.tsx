'use client';

import React from 'react';
import { Pin, FileText, CheckSquare2, MessageCircle, Eye, Edit3 } from 'lucide-react';
import { ViewMode } from '@/app/types';

interface TopBarProps {
  viewMode?: ViewMode;
  categoryName?: string;
  subCategoryName?: string;
  noteName?: string;
  isPinned?: boolean;
  isReadMode?: boolean;
  activeTab?: 'pages' | 'tasks' | 'discussions' | null;
  onTogglePin?: () => void;
  onToggleReadMode?: () => void;
  onTabChange?: (tab: 'pages' | 'tasks' | 'discussions') => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  viewMode,
  categoryName,
  subCategoryName,
  noteName,
  isPinned = false,
  isReadMode = false,
  activeTab = null,
  onTogglePin,
  onToggleReadMode,
  onTabChange
}) => {
  const getBreadcrumb = () => {
    if (!viewMode) return null;

    const parts: { text: string; muted?: boolean }[] = [
      { text: 'pulm', muted: true }
    ];

    switch (viewMode) {
      case 'home':
        parts.push({ text: 'all' });
        break;
      case 'recent':
        parts.push({ text: 'recent' });
        break;
      case 'pins':
        parts.push({ text: 'pins' });
        break;
      case 'bin':
        parts.push({ text: 'bin' });
        break;
      case 'library':
        parts.push({ text: 'library' });
        if (categoryName) {
          parts.push({ text: categoryName });
        }
        if (subCategoryName) {
          parts.push({ text: subCategoryName });
        }
        break;
      default:
        return null;
    }

    return (
      <div className="flex items-center gap-2 text-sm">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-stone-300">/</span>}
            <span className={part.muted ? 'text-stone-400' : 'text-stone-700'}>
              {part.text}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (viewMode === 'settings' || viewMode === 'search') {
    return null;
  }

  return (
    <div className="h-12 border-b border-stone-200 bg-white flex items-center justify-between px-6">
      {getBreadcrumb()}
      
      {viewMode === 'library' && (
        <div className="flex items-center gap-6">
          <button
            onClick={() => onTabChange?.('pages')}
            className={`flex items-center gap-2 px-0 py-2 transition-colors text-sm font-medium border-b-2 ${
              activeTab === 'pages'
                ? 'text-stone-900 border-stone-900'
                : 'text-stone-500 border-transparent hover:text-stone-700'
            }`}
            title="Pages"
          >
            <FileText size={16} />
            <span>Pages</span>
          </button>
          <button
            onClick={() => onTabChange?.('tasks')}
            className={`flex items-center gap-2 px-0 py-2 transition-colors text-sm font-medium border-b-2 ${
              activeTab === 'tasks'
                ? 'text-stone-900 border-stone-900'
                : 'text-stone-500 border-transparent hover:text-stone-700'
            }`}
            title="Tasks"
          >
            <CheckSquare2 size={16} />
            <span>Tasks</span>
          </button>
          <button
            onClick={() => onTabChange?.('discussions')}
            className={`flex items-center gap-2 px-0 py-2 transition-colors text-sm font-medium border-b-2 ${
              activeTab === 'discussions'
                ? 'text-stone-900 border-stone-900'
                : 'text-stone-500 border-transparent hover:text-stone-700'
            }`}
            title="Discussions"
          >
            <MessageCircle size={16} />
            <span>Discussions</span>
          </button>
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-stone-100 rounded-full p-1">
          <button
            onClick={onToggleReadMode}
            className={`px-2 py-1 rounded-full transition-all text-xs font-medium ${
              !isReadMode
                ? 'bg-white text-stone-700 shadow-sm'
                : 'text-stone-500 hover:text-stone-600'
            }`}
            title="Edit mode"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={onToggleReadMode}
            className={`px-2 py-1 rounded-full transition-all text-xs font-medium ${
              isReadMode
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-stone-500 hover:text-stone-600'
            }`}
            title="Read mode"
          >
            <Eye size={14} />
          </button>
        </div>

        {onTogglePin && (
          <button
            onClick={onTogglePin}
            className={`p-1.5 rounded-lg transition-colors ${
              isPinned 
                ? 'text-stone-700 bg-stone-100 hover:bg-stone-200' 
                : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
            }`}
            title={isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
