/**
 * Download installer to temporary location
 * USER-INITIATED ONLY - no background downloads
 */

import { fetch } from '@tauri-apps/plugin-http';
import { exists, mkdir, writeFile } from '@tauri-apps/plugin-fs';
import { safeJoinAppData } from '@/app/lib/utils/pathSafe';
import type { DownloadProgress } from './types';

/**
 * Download installer file to app data directory
 * Returns local path to downloaded installer
 * 
 * SAFETY: Uses Tauri HTTP plugin to handle binary downloads and redirects
 * Browser fetch fails on GitHub CDN redirects in WebView
 */
export async function downloadInstaller(
  downloadUrl: string,
  onProgress?: (progress: DownloadProgress) => void
): Promise<string> {
  try {
    // Safely construct temp directory path within app data
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

    // Download using Tauri HTTP plugin (handles redirects and binary data)
    const response = await fetch(downloadUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Download failed: HTTP ${response.status} ${response.statusText || ''}`);
    }

    // Get binary data as ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Downloaded file is empty');
    }

    // Report progress if callback provided
    if (onProgress) {
      onProgress({
        downloaded: arrayBuffer.byteLength,
        total: arrayBuffer.byteLength,
        percentage: 100,
      });
    }

    // Convert to Uint8Array and write to file
    const fileData = new Uint8Array(arrayBuffer);
    await writeFile(localPath, fileData);

    // Verify file was written successfully
    const fileExists = await exists(localPath);
    if (!fileExists) {
      throw new Error('File write verification failed: file does not exist after write');
    }

    console.log('[DownloadInstaller] Successfully downloaded to:', localPath);
    console.log('[DownloadInstaller] File size:', fileData.length, 'bytes');
    
    return localPath;
  } catch (error) {
    console.error('[DownloadInstaller] Failed:', error);
    
    // Provide structured error messages
    if (error instanceof Error) {
      if (error.message.includes('403')) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
      if (error.message.includes('404')) {
        throw new Error('Installer file not found. The release may have been removed.');
      }
      if (error.message.includes('network')) {
        throw new Error('Network error. Please check your internet connection.');
      }
    }
    
    throw error;
  }
}
