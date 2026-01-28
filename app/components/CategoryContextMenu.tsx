'use client';

import React, { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';

interface CategoryContextMenuProps {
  x: number;
  y: number;
  onDelete: () => void;
  onClose: () => void;
  canDelete: boolean;
}

export const CategoryContextMenu: React.FC<CategoryContextMenuProps> = ({
  x,
  y,
  onDelete,
  onClose,
  canDelete
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-stone-200 py-1 min-w-[160px]"
      style={{ left: x, top: y }}
    >
      <button
        onClick={() => {
          if (canDelete) {
            onDelete();
            onClose();
          }
        }}
        disabled={!canDelete}
        className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${
          canDelete 
            ? 'text-stone-700 hover:bg-stone-100 cursor-pointer' 
            : 'text-stone-400 cursor-not-allowed'
        }`}
        title={!canDelete ? 'Delete all notes in this category first' : ''}
      >
        <Trash2 size={14} />
        <span>Delete Category</span>
      </button>
    </div>
  );
};
