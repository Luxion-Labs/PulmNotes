/**
 * Update system types
 */

export interface UpdateCheckResult {
  hasUpdate: boolean;
  latestVersion: string;
  currentVersion: string;
  downloadUrl: string | null;
  releaseNotes?: string;
}

export interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  assets: GitHubAsset[];
  published_at: string;
}

export interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export type Platform = 'windows' | 'macos' | 'linux' | 'unknown';

export interface DownloadProgress {
  downloaded: number;
  total: number;
  percentage: number;
}
