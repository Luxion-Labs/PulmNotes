/**
 * Download installer to temporary location
 * USER-INITIATED ONLY - no background downloads
 */

import { exists, mkdir, writeFile } from '@tauri-apps/plugin-fs';
import { safeJoinAppData } from '@/app/lib/utils/pathSafe';
import type { DownloadProgress } from './types';

/**
 * Download installer file to app data directory
 * Returns local path to downloaded installer
 * 
 * SAFETY: Uses safeJoinAppData() to ensure proper path construction
 * and compliance with Tauri filesystem permissions
 */
export async function downloadInstaller(
  downloadUrl: string,
  onProgress?: (progress: DownloadProgress) => void
): Promise<string> {
  try {
    // Safely construct temp directory path within app data
    // NEVER use string concatenation for paths
    const tempUpdateDir = await safeJoinAppData('temp_update');

    // Create temp directory if it doesn't exist
    const dirExists = await exists(tempUpdateDir);
    if (!dirExists) {
      await mkdir(tempUpdateDir, { recursive: true });
    }

    // Extract filename from URL
    const filename = downloadUrl.split('/').pop() || 'installer';
    
    // Safely construct full file path
    const localPath = await safeJoinAppData('temp_update', filename);

    // Download file using fetch
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let downloaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      downloaded += value.length;

      // Report progress
      if (onProgress && total > 0) {
        onProgress({
          downloaded,
          total,
          percentage: Math.round((downloaded / total) * 100),
        });
      }
    }

    // Combine chunks into single Uint8Array
    const fileData = new Uint8Array(downloaded);
    let offset = 0;
    for (const chunk of chunks) {
      fileData.set(chunk, offset);
      offset += chunk.length;
    }

    // Write to file
    await writeFile(localPath, fileData);

    // Verify file was written successfully
    const fileExists = await exists(localPath);
    if (!fileExists) {
      throw new Error('File write verification failed: file does not exist after write');
    }

    console.log('[DownloadInstaller] Successfully downloaded to:', localPath);
    return localPath;
  } catch (error) {
    console.error('Installer download failed:', error);
    throw error;
  }
}
