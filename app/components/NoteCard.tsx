'use client';

import React from 'react';
import { Note, Category } from '@/app/types';
import { Pin } from 'lucide-react';
import { NOTE_CARD_SIZE_CLASS } from './noteCardLayout';

interface NoteCardProps {
  note: Note;
  category?: Category;
  onContextMenu: (e: React.MouseEvent) => void;
  onClick?: () => void;
  showDeletedDate?: boolean;
}

const CARD_COLORS = [
  '#E3E0D9', // Warm beige
  '#D9E3E0', // Sage green
  '#E0D9E3', // Lavender
  '#E3DDD9', // Warm gray
  '#D9E0E3', // Sky blue
  '#E3E0DC', // Cream
  '#DDE3D9', // Mint
  '#E3D9DD', // Rose
];

export const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  category, 
  onContextMenu,
  onClick,
  showDeletedDate = false
}) => {
  const getPreviewText = (): string => {
    const textBlock = note.blocks.find(b => b.type === 'text' && b.content);
    return textBlock?.content || '';
  };

  const getCardColor = (): string => {
    // Use note ID to consistently assign a color
    const hash = note.id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return CARD_COLORS[Math.abs(hash) % CARD_COLORS.length];
  };

  const preview = getPreviewText();
  const displayDate = showDeletedDate ? note.deletedAt : note.updatedAt;

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`${NOTE_CARD_SIZE_CLASS} rounded-[12px] p-4 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden`}
      style={{ backgroundColor: getCardColor() }}
    >
      {/* Book spine effect */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-white/20 via-white/10 to-transparent"></div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex items-start gap-2 mb-3 text-[10px] font-medium tracking-wide">
          <span className="px-1.5 py-0.5 bg-stone-900/5 rounded text-stone-600 whitespace-nowrap flex-shrink-0">
            {displayDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          {category && (
            <span className="py-0.5 text-stone-500 truncate text-[10px]">{category.name}</span>
          )}
          {note.isPinned && (
            <Pin size={10} className="text-stone-400 ml-auto flex-shrink-0" />
          )}
        </div>
        
        <h3 className="font-serif text-[17px] text-stone-900 leading-[1.2] mb-2 line-clamp-3">
          {note.title}
        </h3>
        
        {preview && (
          <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-6 flex-1">
            {preview}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-1 text-[11px] text-stone-400 mt-3 pt-3 border-t border-stone-900/5">
        {category && (
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: category.color }}
          />
        )}
      </div>
    </div>
  );
};
