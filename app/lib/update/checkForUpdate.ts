/**
 * Manual update check - fetches latest release from GitHub
 * NO AUTO-CHECK, NO TELEMETRY, USER-INITIATED ONLY
 */

import { APP_VERSION, GITHUB_REPO_OWNER, GITHUB_REPO_NAME } from '@/app/lib/version';
import type { UpdateCheckResult, GitHubRelease, Platform } from './types';

/**
 * Compare two semver versions
 * Returns true if newVersion > currentVersion
 */
function isNewerVersion(currentVersion: string, newVersion: string): boolean {
  // Strip leading 'v' if present
  const current = currentVersion.replace(/^v/, '').split('.').map(Number);
  const latest = newVersion.replace(/^v/, '').split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const curr = current[i] || 0;
    const next = latest[i] || 0;
    if (next > curr) return true;
    if (next < curr) return false;
  }
  return false;
}

/**
 * Detect current platform
 */
function detectPlatform(): Platform {
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
 * Select appropriate installer asset for current platform
 */
function selectInstallerAsset(release: GitHubRelease, platform: Platform): string | null {
  const assets = release.assets;

  switch (platform) {
    case 'windows':
      // Prefer .exe, fallback to .msi
      const exeAsset = assets.find(a => a.name.endsWith('.exe'));
      if (exeAsset) return exeAsset.browser_download_url;
      const msiAsset = assets.find(a => a.name.endsWith('.msi'));
      if (msiAsset) return msiAsset.browser_download_url;
      break;

    case 'macos':
      // Look for .dmg
      const dmgAsset = assets.find(a => a.name.endsWith('.dmg'));
      if (dmgAsset) return dmgAsset.browser_download_url;
      break;

    case 'linux':
      // Prefer .AppImage, fallback to .deb
      const appImageAsset = assets.find(a => a.name.endsWith('.AppImage'));
      if (appImageAsset) return appImageAsset.browser_download_url;
      const debAsset = assets.find(a => a.name.endsWith('.deb'));
      if (debAsset) return debAsset.browser_download_url;
      break;
  }

  return null;
}

/**
 * Check for updates from GitHub releases
 * MANUAL ONLY - called when user clicks "Check for Updates"
 */
export async function checkForUpdate(): Promise<UpdateCheckResult> {
  const currentVersion = APP_VERSION;
  const platform = detectPlatform();

  // ============================================================
  // TEST MODE: Uncomment to test update UI without real release
  // ============================================================
  // return {
  //   hasUpdate: true,
  //   latestVersion: '1.0.0',
  //   currentVersion,
  //   downloadUrl: 'https://github.com/Luxion-Labs/PulmNotes/releases/download/v1.0.0/test-installer.exe',
  //   releaseNotes: '## What\'s New in v1.0.0\n\n- Added manual update system\n- Fixed critical bugs\n- Improved performance\n- Enhanced UI/UX\n\nThis is a test release to preview the update UI.',
  // };
  // ============================================================

  if (platform === 'unknown') {
    return {
      hasUpdate: false,
      latestVersion: currentVersion,
      currentVersion,
      downloadUrl: null,
    };
  }

  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/latest`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
      throw new Error(`Failed to check for updates: ${response.statusText}`);
    }

    const release: GitHubRelease = await response.json();
    const latestVersion = release.tag_name.replace(/^v/, '');

    // Check if newer version available
    const hasUpdate = isNewerVersion(currentVersion, latestVersion);

    if (!hasUpdate) {
      return {
        hasUpdate: false,
        latestVersion,
        currentVersion,
        downloadUrl: null,
      };
    }

    // Select appropriate installer for platform
    const downloadUrl = selectInstallerAsset(release, platform);

    if (!downloadUrl) {
      // No installer found for this platform
      return {
        hasUpdate: false,
        latestVersion,
        currentVersion,
        downloadUrl: null,
      };
    }

    return {
      hasUpdate: true,
      latestVersion,
      currentVersion,
      downloadUrl,
      releaseNotes: release.body,
    };
  } catch (error) {
    console.error('Update check failed:', error);
    throw error;
  }
}
