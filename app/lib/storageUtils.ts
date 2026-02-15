import { invoke } from '@tauri-apps/api/core';

export const getStorageInfo = async () => {
  if (typeof window === 'undefined') {
    return { used: 0, available: 0, percentage: 0, usedMB: '0', availableMB: 'unlimited', type: 'database' as const };
  }

  try {
    // Always use database - get database file size from Tauri
    const dbSize = await invoke<number>('get_database_size');
    
    // For SQLite, we don't have a hard limit like localStorage
    // Show the actual file size without a percentage
    return {
      used: dbSize,
      available: 0, // No fixed limit for SQLite
      percentage: 0,
      usedMB: (dbSize / (1024 * 1024)).toFixed(2),
      availableMB: 'unlimited',
      type: 'database' as const
    };
  } catch (error) {
    console.error('Error calculating storage:', error);
    return { used: 0, available: 0, percentage: 0, usedMB: '0', availableMB: 'unlimited', type: 'database' as const };
  }
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
