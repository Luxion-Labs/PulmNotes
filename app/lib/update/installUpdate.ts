/**
 * Launch installer and exit app
 * CRITICAL: App must exit BEFORE installer runs to prevent file locks
 */

import { invoke } from '@tauri-apps/api/core';
import { exit } from '@tauri-apps/plugin-process';

/**
 * Launch installer and exit app
 * 
 * SAFETY FLOW:
 * 1. Call Rust backend to launch installer (bypasses shell scope)
 * 2. Exit app immediately
 * 3. Installer runs after app closes
 * 4. User data preserved (stored in app_data_dir, not install dir)
 * 
 * SECURITY:
 * - Uses Rust std::process::Command directly
 * - No Tauri shell plugin scope issues
 * - No cmd/powershell/bash wrapper
 */
export async function installUpdate(installerPath: string): Promise<void> {
  try {
    console.log('[InstallUpdate] Launching installer:', installerPath);

    // Call Rust backend to launch installer
    // This bypasses Tauri shell scope restrictions
    await invoke('launch_installer', { installerPath });

    console.log('[InstallUpdate] Installer spawned, exiting app...');

    // CRITICAL: Exit app immediately after spawning installer
    await exit(0);
  } catch (error) {
    console.error('[InstallUpdate] Failed to launch installer:', error);
    throw error;
  }
}
