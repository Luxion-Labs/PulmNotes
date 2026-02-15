import { Asset } from '@/app/types';
import { AssetStore } from './AssetStore';
import { invoke } from '@tauri-apps/api/core';

export class TauriAssetStore implements AssetStore {
  async loadAssets(): Promise<Asset[]> {
    try {
      const data = await invoke<string>('load_assets');
      const parsed = JSON.parse(data);
      
      return parsed.map((asset: any) => ({
        ...asset,
        createdAt: new Date(asset.createdAt),
        updatedAt: new Date(asset.updatedAt),
        deletedAt: asset.deletedAt ? new Date(asset.deletedAt) : undefined
      }));
    } catch (error) {
      console.error('Failed to load assets from database:', error);
      return [];
    }
  }

  async saveAssets(assets: Asset[]): Promise<void> {
    try {
      const serialized = JSON.stringify(assets);
      await invoke('save_assets', { data: serialized });
    } catch (error) {
      console.error('Failed to save assets to database:', error);
    }
  }
}
