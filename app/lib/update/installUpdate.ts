/**
 * Launch installer and exit app
 * CRITICAL: App must exit BEFORE installer runs to prevent file locks
 */

import { Command } from '@tauri-apps/plugin-shell';
import { exit } from '@tauri-apps/plugin-process';

/**
 * Detect current platform
 */
function detectPlatform(): 'windows' | 'macos' | 'linux' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();

  if (platform.includes('win') || userAgent.includes('windows')) {
    return 'windows';
  }
  if (platform.includes('mac') || userAgent.includes('mac os')) {
    return 'macos';
  }
  if (platform.includes('linux') || userAgent.includes('linux')) {
    return 'linux';
  }
  return 'unknown';
}

/**
 * Launch installer and exit app
 * 
 * SAFETY FLOW:
 * 1. Spawn installer process (detached)
 * 2. Exit app immediately
 * 3. Installer runs after app closes
 * 4. User data preserved (stored in app_data_dir, not install dir)
 */
export async function installUpdate(installerPath: string): Promise<void> {
  const platform = detectPlatform();

  try {
    // Spawn installer process based on platform
    switch (platform) {
      case 'windows':
        // Windows: Run .exe or .msi installer
        // Detached process continues after app exits
        await Command.create('cmd', ['/c', 'start', '', installerPath]).spawn();
        break;

      case 'macos':
        // macOS: Open .dmg file
        await Command.create('open', [installerPath]).spawn();
        break;

      case 'linux':
        // Linux: Make executable and run
        if (installerPath.endsWith('.AppImage')) {
          await Command.create('chmod', ['+x', installerPath]).execute();
          await Command.create(installerPath).spawn();
        } else if (installerPath.endsWith('.deb')) {
          // For .deb, user needs to install manually or use package manager
          await Command.create('xdg-open', [installerPath]).spawn();
        }
        break;

      default:
        throw new Error('Unsupported platform');
    }

    // CRITICAL: Exit app immediately after spawning installer
    // This ensures no file locks prevent installation
    // Database is already closed (WAL mode handles this gracefully)
    await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay for process spawn
    await exit(0);
  } catch (error) {
    console.error('Failed to launch installer:', error);
    throw error;
  }
}
