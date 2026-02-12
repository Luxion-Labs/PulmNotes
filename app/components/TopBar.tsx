'use client';

import React from 'react';
import { Pin, BookOpen, ListTodo, MessageSquare, Eye, Edit3 } from 'lucide-react';
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
      case 'settings':
        parts.push({ text: 'settings' });
        break;
      case 'library':
        parts.push({ text: 'library' });
        if (categoryName) {
          parts.push({ text: categoryName });
        }
        if (subCategoryName) {
          parts.push({ text: subCategoryName });
        }
        if (noteName) {
          parts.push({ text: noteName });
        }
        break;
      default:
        return null;
    }

    return (
      <div className="flex items-center gap-1 text-xs md:text-sm min-w-0 flex-shrink">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-stone-300">/</span>}
            <span className={`${part.muted ? 'text-stone-400' : 'text-stone-700'} truncate`}>
              {part.text}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (viewMode === 'search') {
    return null;
  }

  return (
    <div className="h-12 md:h-14 bg-white flex items-center px-3 md:px-6 gap-2 md:gap-4 overflow-x-auto">
      {/* Left section - Breadcrumb */}
      <div className="flex-shrink-0">
        {getBreadcrumb()}
      </div>

      {/* Right section - Mode toggle and pin */}
      {viewMode === 'library' && (
        <div className="flex items-center gap-2 md:gap-3 ml-auto flex-shrink-0">
          {onToggleReadMode && (
            <div className="flex items-center gap-1 bg-stone-100 rounded-full p-1">
              <button
                onClick={onToggleReadMode}
                className={`px-3 py-1.5 rounded-full transition-all text-xs font-medium flex items-center gap-1.5 ${!isReadMode
                    ? 'bg-white text-stone-700 shadow-sm'
                    : 'text-stone-500 hover:text-stone-600'
                  }`}
                title="Edit mode"
              >
                <Edit3 size={14} className={!isReadMode ? 'text-orange-500' : ''} />
                <span className="hidden sm:inline">Write</span>
              </button>
              <button
                onClick={onToggleReadMode}
                className={`px-3 py-1.5 rounded-full transition-all text-xs font-medium flex items-center gap-1.5 ${isReadMode
                    ? 'bg-white text-stone-700 shadow-sm'
                    : 'text-stone-500 hover:text-stone-600'
                  }`}
                title="Read mode"
              >
                <Eye size={14} className={isReadMode ? 'text-emerald-500' : ''} />
                <span className="hidden sm:inline">Read</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
