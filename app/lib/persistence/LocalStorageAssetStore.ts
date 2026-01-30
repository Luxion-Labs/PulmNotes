import { Asset } from '@/app/types';
import { AssetStore } from './AssetStore';

const STORAGE_KEY = 'pulm-assets';

export class LocalStorageAssetStore implements AssetStore {
  async loadAssets(): Promise<Asset[]> {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);
      
      return parsed.map((asset: any) => ({
        ...asset,
        createdAt: new Date(asset.createdAt),
        updatedAt: new Date(asset.updatedAt),
        deletedAt: asset.deletedAt ? new Date(asset.deletedAt) : undefined
      }));
    } catch (error) {
      console.error('Failed to load assets from localStorage:', error);
      return [];
    }
  }

  async saveAssets(assets: Asset[]): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const serialized = JSON.stringify(assets);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Asset storage is full.');
        // Don't throw, just log - let the app continue
      } else {
        console.error('Failed to save assets to localStorage:', error);
      }
    }
  }
}
