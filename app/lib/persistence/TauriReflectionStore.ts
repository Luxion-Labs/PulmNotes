import { DailyReflection } from '@/app/types';
import { ReflectionStore } from './ReflectionStore';
import { invoke } from '@tauri-apps/api/core';

export class TauriReflectionStore implements ReflectionStore {
  async loadReflections(): Promise<DailyReflection[]> {
    try {
      const data = await invoke<string>('load_reflections');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load reflections from database:', error);
      return [];
    }
  }

  async saveReflections(reflections: DailyReflection[]): Promise<void> {
    try {
      const serialized = JSON.stringify(reflections);
      await invoke('save_reflections', { data: serialized });
    } catch (error) {
      console.error('Failed to save reflections to database:', error);
    }
  }
}
