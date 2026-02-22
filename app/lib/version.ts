/**
 * Application version utilities
 */

// Import package.json to get the version dynamically
import packageJson from '@/package.json';

export const APP_VERSION = packageJson.version;

/**
 * GitHub repository information
 */
export const GITHUB_REPO_OWNER = 'Luxion-Labs';
export const GITHUB_REPO_NAME = 'PulmNotes';
export const GITHUB_REPO = `${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;

/**
 * Update check configuration
 */
export const UPDATE_CHECK_INTERVAL = 1000 * 60 * 60 * 4; // 4 hours
export const UPDATE_CHECK_ENABLED = true; // Set to false to disable update checks
