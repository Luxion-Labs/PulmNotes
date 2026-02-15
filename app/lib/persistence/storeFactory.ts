import { NoteStore } from './NoteStore';
import { CategoryStore } from './CategoryStore';
import { SubCategoryStore } from './SubCategoryStore';
import { AssetStore } from './AssetStore';
import { ReflectionStore } from './ReflectionStore';
import { TauriNoteStore } from './TauriNoteStore';
import { TauriCategoryStore } from './TauriCategoryStore';
import { TauriSubCategoryStore } from './TauriSubCategoryStore';
import { TauriAssetStore } from './TauriAssetStore';
import { TauriReflectionStore } from './TauriReflectionStore';

// Always use Tauri stores (SQLite database)
export function createNoteStore(): NoteStore {
  return new TauriNoteStore();
}

export function createCategoryStore(): CategoryStore {
  return new TauriCategoryStore();
}

export function createSubCategoryStore(): SubCategoryStore {
  return new TauriSubCategoryStore();
}

export function createAssetStore(): AssetStore {
  return new TauriAssetStore();
}

export function createReflectionStore(): ReflectionStore {
  return new TauriReflectionStore();
}
