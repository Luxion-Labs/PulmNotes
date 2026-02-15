import { Note } from '@/app/types';
import { NoteStore } from './NoteStore';
import { invoke } from '@tauri-apps/api/core';

export class TauriNoteStore implements NoteStore {
  async loadNotes(): Promise<Note[]> {
    try {
      const data = await invoke<string>('load_notes');
      const parsed = JSON.parse(data);
      
      return parsed.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
        lastOpenedAt: note.lastOpenedAt ? new Date(note.lastOpenedAt) : undefined,
        deletedAt: note.deletedAt ? new Date(note.deletedAt) : undefined
      }));
    } catch (error) {
      console.error('Failed to load notes from database:', error);
      return [];
    }
  }

  async saveNotes(notes: Note[]): Promise<void> {
    try {
      const serialized = JSON.stringify(notes);
      await invoke('save_notes', { data: serialized });
    } catch (error) {
      console.error('Failed to save notes to database:', error);
    }
  }
}
