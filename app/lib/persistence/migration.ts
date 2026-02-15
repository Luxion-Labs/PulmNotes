import { invoke } from '@tauri-apps/api/core';

const MIGRATION_KEY = 'pulm-migration-completed';

export async function migrateLocalStorageToTauri(): Promise<void> {
  // Check if we're in Tauri
  if (typeof window === 'undefined' || !('__TAURI__' in window)) {
    return;
  }

  // Check if migration already completed
  if (localStorage.getItem(MIGRATION_KEY) === 'true') {
    return;
  }

  try {
    // Check if database is empty
    const dbNotes = await invoke<string>('load_notes');
    const dbCategories = await invoke<string>('load_categories');
    
    // If database already has data, skip migration
    if (dbNotes !== '[]' || dbCategories !== '[]') {
      localStorage.setItem(MIGRATION_KEY, 'true');
      return;
    }

    // Migrate notes
    const localNotes = localStorage.getItem('pulm-notes');
    if (localNotes && localNotes !== '[]') {
      await invoke('save_notes', { data: localNotes });
      console.log('Migrated notes from localStorage to database');
    }

    // Migrate categories
    const localCategories = localStorage.getItem('pulm-categories');
    if (localCategories && localCategories !== '[]') {
      await invoke('save_categories', { data: localCategories });
      console.log('Migrated categories from localStorage to database');
    }

    // Migrate subcategories
    const localSubCategories = localStorage.getItem('pulm-subcategories');
    if (localSubCategories && localSubCategories !== '[]') {
      await invoke('save_subcategories', { data: localSubCategories });
      console.log('Migrated subcategories from localStorage to database');
    }

    // Migrate assets
    const localAssets = localStorage.getItem('pulm-assets');
    if (localAssets && localAssets !== '[]') {
      await invoke('save_assets', { data: localAssets });
      console.log('Migrated assets from localStorage to database');
    }

    // Migrate reflections
    const localReflections = localStorage.getItem('pulm-reflections');
    if (localReflections && localReflections !== '[]') {
      await invoke('save_reflections', { data: localReflections });
      console.log('Migrated reflections from localStorage to database');
    }

    // Mark migration as completed
    localStorage.setItem(MIGRATION_KEY, 'true');
    console.log('Migration from localStorage to database completed');
  } catch (error) {
    console.error('Failed to migrate data from localStorage:', error);
  }
}
