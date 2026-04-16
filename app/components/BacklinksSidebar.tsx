'use client';

import React from 'react';
import { Note } from '@/app/types';
import { FileText, Link as LinkIcon } from 'lucide-react';

interface BacklinksSidebarProps {
  notes: Note[];
  currentNoteId: string | null;
  onSelectNote: (noteId: string) => void;
}

export const BacklinksSidebar: React.FC<BacklinksSidebarProps> = ({
  notes,
  currentNoteId,
  onSelectNote
}) => {
  if (!currentNoteId) return null;

  const currentNote = notes.find(n => n.id === currentNoteId);
  if (!currentNote) return null;

  // Find all notes that mention the current note
  const backlinks = notes.filter(note => {
    if (note.id === currentNoteId || note.isDeleted) return false;

    // Search blocks for mentions of currentNoteId
    return note.blocks.some(block => {
      // Check block mentions array if it exists
      if (block.mentions && block.mentions.some(m => m.noteId === currentNoteId)) {
        return true;
      }
      
      // Fallback: check raw text content for the wiki-link pattern [[title]]
      if (block.content && block.content.includes(`[[${currentNote.title}]]`)) {
        return true;
      }

      // Check list items
      if (block.items) {
        return block.items.some(item => {
          if (item.mentions && item.mentions.some(m => m.noteId === currentNoteId)) {
            return true;
          }
          if (item.content && item.content.includes(`[[${currentNote.title}]]`)) {
            return true;
          }
          return false;
        });
      }

      return false;
    });
  });

  return (
    <div className="w-72 h-full bg-stone-50 flex flex-col border-l border-stone-200">
      <div className="p-6 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <LinkIcon size={16} className="text-stone-400" />
          <h2 className="text-sm font-medium text-stone-500 tracking-wide">
            Backlinks
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {backlinks.length > 0 ? (
          backlinks.map(note => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className="p-3 bg-white border border-stone-200 rounded-lg shadow-sm cursor-pointer hover:border-stone-300 hover:shadow transition-all group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <FileText size={14} className="text-stone-400 group-hover:text-stone-600 transition-colors" />
                <h3 className="text-sm font-medium text-stone-700 truncate">
                  {note.title}
                </h3>
              </div>
              <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                {/* Extract a snippet around the mention, or just show the start of the note */}
                {note.blocks.find(b => b.type === 'text')?.content || 'Empty note...'}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 px-4">
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
              <LinkIcon size={18} className="text-stone-300" />
            </div>
            <p className="text-sm text-stone-500">No notes link to this one yet.</p>
            <p className="text-xs text-stone-400 mt-1">Type [[ to link notes together.</p>
          </div>
        )}
      </div>
    </div>
  );
};
