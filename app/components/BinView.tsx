'use client';

import React, { useState } from 'react';
import { Note, Category } from '@/app/types';
import { BinContextMenu } from './BinContextMenu';
import { NoteCard } from './NoteCard';

interface BinViewProps {
  notes: Note[];
  categories: Category[];
  onRestore: (noteId: string) => void;
  onDeleteForever: (noteId: string) => void;
}

export const BinView: React.FC<BinViewProps> = ({ 
  notes, 
  categories, 
  onRestore, 
  onDeleteForever 
}) => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    noteId: string;
  } | null>(null);

  const deletedNotes = notes.filter(n => n.isDeleted);

  const getCategoryForNote = (note: Note): Category | undefined => {
    return categories.find(c => c.id === note.categoryId);
  };

  const handleContextMenu = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      noteId
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Bin</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {deletedNotes.map((note) => {
            const category = getCategoryForNote(note);
            
            return (
              <NoteCard
                key={note.id}
                note={note}
                category={category}
                onContextMenu={(e) => handleContextMenu(e, note.id)}
                showDeletedDate={true}
              />
            );
          })}
        </div>
        
        {deletedNotes.length === 0 && (
          <div className="text-center py-12 text-stone-500">
            <p>Bin is empty.</p>
          </div>
        )}
      </div>

      {contextMenu && (
        <BinContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onRestore={() => {
            onRestore(contextMenu.noteId);
            setContextMenu(null);
          }}
          onDeleteForever={() => {
            onDeleteForever(contextMenu.noteId);
            setContextMenu(null);
          }}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};
