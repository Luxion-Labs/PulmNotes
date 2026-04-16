'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Note, Category } from '@/app/types';
import { Search, FileText } from 'lucide-react';
import * as Ariakit from '@ariakit/react';

interface CommandPaletteProps {
  isOpen: boolean;
  notes: Note[];
  categories: Category[];
  onClose: () => void;
  onSelectNote: (noteId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  notes,
  categories,
  onClose,
  onSelectNote
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const activeNotes = notes.filter(n => !n.isDeleted);

  const filteredNotes = searchQuery.trim()
    ? activeNotes.filter(note => {
        const query = searchQuery.toLowerCase();
        
        // Search by title
        if (note.title.toLowerCase().includes(query)) {
          return true;
        }
        
        // Search by block content
        return note.blocks.some(block => {
          // Check block content if it exists
          if (block.content && block.content.toLowerCase().includes(query)) {
            return true;
          }
          
          // Check list items if it's a list block
          if (block.items) {
            return block.items.some(item => 
              item.content && item.content.toLowerCase().includes(query)
            );
          }
          
          return false;
        });
      })
    : [];

  const combobox = Ariakit.useComboboxStore({
    open: isOpen,
    setOpen: (open) => {
      if (!open) onClose();
    },
    setValue: setSearchQuery,
    value: searchQuery,
  });

  // Make sure to sync isOpen prop with Ariakit store
  useEffect(() => {
    if (isOpen !== combobox.getState().open) {
      combobox.setOpen(isOpen);
    }
  }, [isOpen, combobox]);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleSelectNote = (noteId: string) => {
    onSelectNote(noteId);
    onClose();
  };

  const getCategoryForNote = (note: Note): Category | undefined => {
    return categories.find(c => c.id === note.categoryId);
  };

  if (!isOpen) return null;

  return (
    <Ariakit.Dialog
      store={combobox}
      open={isOpen}
      onClose={onClose}
      backdrop={<div className="fixed inset-0 z-50 bg-stone-900/20 backdrop-blur-sm" />}
      className="fixed inset-0 z-50 flex items-start justify-center pt-32 pointer-events-none"
    >
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[520px] mx-4 overflow-hidden pointer-events-auto flex flex-col max-h-[60vh]">
        <div className="relative flex-shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={18} />
          <Ariakit.Combobox
            store={combobox}
            autoSelect
            placeholder="Search notes..."
            className="w-full pl-11 pr-4 py-3.5 text-sm border-b border-stone-200 outline-none"
          />
        </div>

        <Ariakit.ComboboxPopover
          store={combobox}
          portal={false}
          gutter={0}
          sameWidth
          className="overflow-y-auto flex-1 overscroll-contain"
        >
          {searchQuery.trim() && (
            <div className="py-2">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => {
                  const category = getCategoryForNote(note);
                  return (
                    <Ariakit.ComboboxItem
                      key={note.id}
                      value={note.title}
                      onClick={() => handleSelectNote(note.id)}
                      className="px-4 py-2.5 cursor-pointer transition-colors flex items-center gap-3 aria-selected:bg-stone-100 hover:bg-stone-50 outline-none"
                    >
                      <FileText size={16} className="text-stone-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-900 truncate">
                          {note.title}
                        </div>
                        {category && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div 
                              className="w-1.5 h-1.5 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-xs text-stone-500">{category.name}</span>
                          </div>
                        )}
                      </div>
                    </Ariakit.ComboboxItem>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-sm text-stone-500">
                  No notes found
                </div>
              )}
            </div>
          )}

          {!searchQuery.trim() && (
            <div className="px-4 py-8 text-center text-sm text-stone-400">
              Type to search notes
            </div>
          )}
        </Ariakit.ComboboxPopover>
      </div>
    </Ariakit.Dialog>
  );
};
