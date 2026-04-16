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
import { LocalStorageNoteStore } from './LocalStorageNoteStore';
import { LocalStorageCategoryStore } from './LocalStorageCategoryStore';
import { LocalStorageSubCategoryStore } from './LocalStorageSubCategoryStore';
import { LocalStorageAssetStore } from './LocalStorageAssetStore';
import { LocalStorageReflectionStore } from './LocalStorageReflectionStore';

const isTauri = () => {
  return typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;
};

export function createNoteStore(): NoteStore {
  return isTauri() ? new TauriNoteStore() : new LocalStorageNoteStore();
}

export function createCategoryStore(): CategoryStore {
  return isTauri() ? new TauriCategoryStore() : new LocalStorageCategoryStore();
}

export function createSubCategoryStore(): SubCategoryStore {
  return isTauri() ? new TauriSubCategoryStore() : new LocalStorageSubCategoryStore();
}

export function createAssetStore(): AssetStore {
  return isTauri() ? new TauriAssetStore() : new LocalStorageAssetStore();
}

export function createReflectionStore(): ReflectionStore {
  return isTauri() ? new TauriReflectionStore() : new LocalStorageReflectionStore();
}
