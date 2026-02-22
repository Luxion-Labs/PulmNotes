/**
 * Manual update system for Pulm
 * 
 * STRICT REQUIREMENTS:
 * - Manual check only (user clicks button)
 * - No auto-check on startup
 * - No background updates
 * - No telemetry
 * - User must confirm before download
 * - App exits before installer runs
 * - Data preserved (stored outside install dir)
 */

export { checkForUpdate } from './checkForUpdate';
export { downloadInstaller } from './downloadInstaller';
export { installUpdate } from './installUpdate';
export type { UpdateCheckResult, DownloadProgress, Platform } from './types';
