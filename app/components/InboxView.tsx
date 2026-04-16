'use client';

import { Note, Category } from '@/app/types';
import { Inbox, ArrowRight, Trash2, Clock, CheckCheck } from 'lucide-react';
import { useState } from 'react';

interface InboxViewProps {
  notes: Note[];
  categories: Category[];
  onPromote: (noteId: string, categoryId: string) => void;
  onDiscard: (noteId: string) => void;
  onSnooze: (noteId: string) => void; // pins the note temporarily
}

export function InboxView({ notes, categories, onPromote, onDiscard, onSnooze }: InboxViewProps) {
  const [promotingId, setPromotingId] = useState<string | null>(null);

  // Filter to Uncategorized, non-deleted notes only
  const uncategorizedCat = categories.find(c => c.name === 'Uncategorized');
  const uncategorizedId = uncategorizedCat ? uncategorizedCat.id : 'Uncategorized';

  const inboxNotes = notes.filter(
    n => n.categoryId === uncategorizedId && !n.isDeleted
  );

  // Keyboard handler: P = promote, D = discard, S = snooze
  const handleKeyDown = (e: React.KeyboardEvent, noteId: string) => {
    if (e.key === 'd' || e.key === 'D') {
      e.stopPropagation();
      onDiscard(noteId);
    }
    if (e.key === 's' || e.key === 'S') {
      e.stopPropagation();
      onSnooze(noteId);
    }
    if (e.key === 'p' || e.key === 'P') {
      e.stopPropagation();
      setPromotingId(noteId);
    }
  };

  const getPreview = (note: Note) => {
    const textBlock = note.blocks.find(b => b.type === 'text' && b.content?.trim());
    return textBlock?.content?.slice(0, 120) ?? 'No content';
  };

  if (inboxNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-3">
        <CheckCheck size={40} strokeWidth={1.5} className="text-stone-300" />
        <p className="text-sm font-medium">Inbox is clear</p>
        <p className="text-xs text-stone-400">Press Cmd+Shift+Space anywhere to capture a thought.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 border-b border-stone-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
          <Inbox size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-stone-800 tracking-tight">Inbox Triage</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {inboxNotes.length} uncategorized {inboxNotes.length === 1 ? 'note' : 'notes'} waiting for review
          </p>
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="px-8 py-3 bg-stone-50/50 border-b border-stone-100 text-xs text-stone-500 flex gap-6">
        <span className="flex items-center gap-1.5">
          <kbd className="bg-white border border-stone-200 shadow-sm px-1.5 py-0.5 rounded text-stone-600 font-medium font-sans">P</kbd> promote
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="bg-white border border-stone-200 shadow-sm px-1.5 py-0.5 rounded text-stone-600 font-medium font-sans">S</kbd> snooze
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="bg-white border border-stone-200 shadow-sm px-1.5 py-0.5 rounded text-stone-600 font-medium font-sans">D</kbd> discard
        </span>
      </div>

      {/* Note cards */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {inboxNotes.map(note => (
          <div
            key={note.id}
            tabIndex={0}
            onKeyDown={e => handleKeyDown(e, note.id)}
            className="group bg-white border border-stone-200 shadow-sm rounded-xl p-5 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-300
                       hover:border-stone-300 hover:shadow transition-all relative"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-medium text-stone-800 truncate">
                    {note.title || 'Untitled'}
                  </h3>
                  {note.isPinned && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded">
                      Snoozed
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">
                  {getPreview(note)}
                </p>
                <p className="text-xs text-stone-400 mt-3 font-medium">
                  Captured {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity absolute right-4 top-4 sm:relative sm:right-0 sm:top-0">
                <button
                  onClick={() => setPromotingId(promotingId === note.id ? null : note.id)}
                  title="Promote (P)"
                  className="p-2 rounded-lg text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center justify-center"
                >
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => onSnooze(note.id)}
                  title={note.isPinned ? "Unsnooze (S)" : "Snooze (S)"}
                  className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                    note.isPinned 
                      ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                      : 'text-stone-400 hover:bg-stone-100 hover:text-stone-600'
                  }`}
                >
                  <Clock size={18} />
                </button>
                <button
                  onClick={() => onDiscard(note.id)}
                  title="Discard (D)"
                  className="p-2 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Promote inline picker */}
            {promotingId === note.id && (
              <div className="mt-4 pt-4 border-t border-stone-100 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-xs font-medium text-stone-500 mb-3 uppercase tracking-wider">Move to category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.filter(c => c.id !== uncategorizedId).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onPromote(note.id, cat.id);
                        setPromotingId(null);
                      }}
                      className="text-sm px-3 py-1.5 rounded-lg border border-stone-200 bg-white
                                 text-stone-600 hover:border-stone-300 hover:bg-stone-50 transition-colors
                                 flex items-center gap-2 shadow-sm"
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                      {cat.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPromotingId(null)}
                  className="mt-3 text-xs font-medium text-stone-400 hover:text-stone-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}