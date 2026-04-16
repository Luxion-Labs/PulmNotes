'use client';

import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { createNoteStore } from '@/app/lib/persistence';
import { convertTipTapToBlocks } from '@/editor/lib/convertTipTapToBlocks';
import { Note } from '@/app/types';

const noteStore = createNoteStore();

const generateId = () => Math.random().toString(36).substring(2, 11);

export default function QuickCapture() {
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Capture a thought...',
      }),
    ],
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none min-h-[80px] text-gray-800',
      },
      handleKeyDown(_, event) {
        if (event.key === 'Escape') {
          getCurrentWindow().hide();
          return true;
        }
        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
          const content = editor?.getJSON();
          
          if (editor?.isEmpty) {
            getCurrentWindow().hide();
            return true;
          }

          // Create new note
          const blocks = convertTipTapToBlocks(content);
          
          // Use first text block as title, or "Quick Note"
          const firstTextBlock = blocks.find(b => b.type === 'text' || b.type === 'h1' || b.type === 'h2' || b.type === 'h3');
          const title = firstTextBlock && firstTextBlock.content ? firstTextBlock.content.substring(0, 50) : 'Quick Note';

          // Load categories first to find "Uncategorized", then save
          import('@/app/lib/persistence').then(({ createCategoryStore }) => {
            const categoryStore = createCategoryStore();
            categoryStore.loadCategories().then(categories => {
              const uncategorized = categories.find(c => c.name === 'Uncategorized');
              const categoryId = uncategorized ? uncategorized.id : '';

              const newNote: Note = {
                id: `note-${generateId()}`,
                title,
                blocks,
                categoryId,
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              // Save note
              return noteStore.loadNotes().then(notes => {
                const updatedNotes = [newNote, ...notes];
                return noteStore.saveNotes(updatedNotes);
              });
            }).then(() => {
              // Tell main window to refresh
              invoke('save_quick_note', { content: "refresh" }).catch(console.error);
              
              editor?.commands.clearContent();
              getCurrentWindow().hide();
            }).catch(console.error);
          });
            
          return true;
        }
        return false;
      }
    }
  });

  useEffect(() => {
    // Focus the editor when the window comes into focus
    const unlisten = getCurrentWindow().onFocusChanged(({ payload: focused }) => {
      if (focused && editor) {
        editor.commands.focus();
      }
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, [editor]);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 p-4"
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      <div 
        className="flex-1 overflow-y-auto"
        style={{ WebkitAppRegion: 'no-drag' } as any}
      >
        <EditorContent editor={editor} />
      </div>
      <div className="flex justify-between items-center text-xs text-gray-400 mt-2 select-none pointer-events-none">
        <span>Plum Quick Capture</span>
        <span>Cmd+Enter to save · Esc to dismiss</span>
      </div>
    </div>
  );
}
