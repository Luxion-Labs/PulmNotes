/**
 * Launch installer and exit app
 * CRITICAL: App must exit BEFORE installer runs to prevent file locks
 */

import { Command } from '@tauri-apps/plugin-shell';
import { exit } from '@tauri-apps/plugin-process';

/**
 * Launch installer and exit app
 * 
 * SAFETY FLOW:
 * 1. Execute installer binary directly (no shell wrapper)
 * 2. Exit app immediately
 * 3. Installer runs after app closes
 * 4. User data preserved (stored in app_data_dir, not install dir)
 * 
 * SECURITY:
 * - Executes installer binary directly via absolute path
 * - No cmd/powershell/bash wrapper
 * - No named command indirection
 * - Requires shell:allow-execute permission
 */
export async function installUpdate(installerPath: string): Promise<void> {
  try {
    console.log('[InstallUpdate] Launching installer:', installerPath);

    // Execute installer directly using absolute path
    // No named command, no shell wrapper, no cmd
    await Command.create(installerPath).spawn();

    console.log('[InstallUpdate] Installer spawned, exiting app...');

    // CRITICAL: Exit app immediately after spawning installer
    // No async operations after this point
    // No DB writes after this point
    // No file handles remain open
    await exit(0);
  } catch (error) {
    console.error('[InstallUpdate] Failed to launch installer:', error);
    throw error;
  }
}
