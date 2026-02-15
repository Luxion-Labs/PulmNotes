import { SubCategory } from '@/app/types';
import { SubCategoryStore } from './SubCategoryStore';
import { invoke } from '@tauri-apps/api/core';

export class TauriSubCategoryStore implements SubCategoryStore {
  async loadSubCategories(): Promise<SubCategory[]> {
    try {
      const data = await invoke<string>('load_subcategories');
      const parsed = JSON.parse(data);
      
      return parsed.map((subCategory: any) => ({
        ...subCategory,
        createdAt: new Date(subCategory.createdAt)
      }));
    } catch (error) {
      console.error('Failed to load sub-categories from database:', error);
      return [];
    }
  }

  async saveSubCategories(subCategories: SubCategory[]): Promise<void> {
    try {
      const serialized = JSON.stringify(subCategories);
      await invoke('save_subcategories', { data: serialized });
    } catch (error) {
      console.error('Failed to save sub-categories to database:', error);
    }
  }
}
