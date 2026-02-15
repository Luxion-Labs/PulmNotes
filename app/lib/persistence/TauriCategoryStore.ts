import { Category } from '@/app/types';
import { CategoryStore } from './CategoryStore';
import { invoke } from '@tauri-apps/api/core';

export class TauriCategoryStore implements CategoryStore {
  async loadCategories(): Promise<Category[]> {
    try {
      const data = await invoke<string>('load_categories');
      const parsed = JSON.parse(data);
      
      return parsed.map((category: any) => ({
        ...category,
        createdAt: new Date(category.createdAt),
        updatedAt: new Date(category.updatedAt)
      }));
    } catch (error) {
      console.error('Failed to load categories from database:', error);
      return [];
    }
  }

  async saveCategories(categories: Category[]): Promise<void> {
    try {
      const serialized = JSON.stringify(categories);
      await invoke('save_categories', { data: serialized });
    } catch (error) {
      console.error('Failed to save categories to database:', error);
    }
  }
}
