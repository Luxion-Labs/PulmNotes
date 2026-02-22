'use client';

import React, { useState } from 'react';
import { Download, AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';
import { checkForUpdate, downloadInstaller, installUpdate } from '@/app/lib/update';
import type { UpdateCheckResult, DownloadProgress } from '@/app/lib/update';

interface UpdateCheckerProps {
  currentVersion: string;
}

type UpdateState = 
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'error'; message: string }
  | { status: 'no-update' }
  | { status: 'update-available'; update: UpdateCheckResult }
  | { status: 'downloading'; progress: DownloadProgress }
  | { status: 'ready-to-install'; installerPath: string };

export function UpdateChecker({ currentVersion }: UpdateCheckerProps) {
  const [state, setState] = useState<UpdateState>({ status: 'idle' });

  const handleCheckForUpdates = async () => {
    setState({ status: 'checking' });

    try {
      const result = await checkForUpdate();

      if (result.hasUpdate) {
        setState({ status: 'update-available', update: result });
      } else {
        setState({ status: 'no-update' });
        // Auto-reset after 3 seconds
        setTimeout(() => setState({ status: 'idle' }), 3000);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to check for updates';
      setState({ status: 'error', message });
    }
  };

  const handleDownload = async (downloadUrl: string) => {
    try {
      setState({ status: 'downloading', progress: { downloaded: 0, total: 0, percentage: 0 } });

      const installerPath = await downloadInstaller(downloadUrl, (progress) => {
        setState({ status: 'downloading', progress });
      });

      setState({ status: 'ready-to-install', installerPath });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download installer';
      setState({ status: 'error', message });
    }
  };

  const handleInstall = async (installerPath: string) => {
    try {
      // This will exit the app after launching installer
      await installUpdate(installerPath);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to launch installer';
      setState({ status: 'error', message });
    }
  };

  const handleCancel = () => {
    setState({ status: 'idle' });
  };

  return (
    <div className="space-y-4">
      {/* Current Version Display */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-800">Current Version</p>
          <p className="text-xs text-stone-500 mt-0.5">{currentVersion}</p>
        </div>

        {state.status === 'idle' && (
          <button
            onClick={handleCheckForUpdates}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Check for Updates
          </button>
        )}

        {state.status === 'checking' && (
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <Loader2 size={16} className="animate-spin" />
            <span>Checking...</span>
          </div>
        )}

        {state.status === 'no-update' && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle size={16} />
            <span>You&apos;re up to date!</span>
          </div>
        )}
      </div>

      {/* Error State */}
      {state.status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-900">Update Check Failed</p>
              <p className="text-xs text-red-700 mt-1">{state.message}</p>
            </div>
            <button
              onClick={handleCancel}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <button
            onClick={handleCheckForUpdates}
            className="mt-3 text-sm text-red-700 hover:text-red-900 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Update Available Modal */}
      {state.status === 'update-available' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Download size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-blue-900">
                New Version Available: {state.update.latestVersion}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                A new version of Pulm is available. Download and install to get the latest features and improvements.
              </p>
              {state.update.releaseNotes && (
                <div className="mt-3 p-3 bg-white rounded border border-blue-100">
                  <p className="text-xs font-medium text-stone-700 mb-2">Release Notes:</p>
                  <div className="text-xs text-stone-600 max-h-32 overflow-y-auto whitespace-pre-wrap">
                    {state.update.releaseNotes}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => state.update.downloadUrl && handleDownload(state.update.downloadUrl)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download & Install
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      )}

      {/* Downloading State */}
      {state.status === 'downloading' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Loader2 size={20} className="text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900">Downloading Installer...</p>
              <div className="mt-3">
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${state.progress.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  {state.progress.percentage}% complete
                  {state.progress.total > 0 && (
                    <span className="ml-2">
                      ({Math.round(state.progress.downloaded / 1024 / 1024)}MB / {Math.round(state.progress.total / 1024 / 1024)}MB)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ready to Install */}
      {state.status === 'ready-to-install' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-green-900">Ready to Install</p>
              <p className="text-xs text-green-700 mt-1">
                The installer has been downloaded. Click &quot;Install Now&quot; to close Pulm and run the installer.
              </p>
              <p className="text-xs text-green-700 mt-2 font-medium">
                ⚠️ Pulm will close automatically. Your data is safe and will be preserved.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleInstall(state.installerPath)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Install Now
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
