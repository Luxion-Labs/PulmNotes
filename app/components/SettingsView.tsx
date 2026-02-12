'use client';

import React, { useEffect, useState } from 'react';
import { getStorageInfo } from '@/app/lib/storageUtils';

type OSKey = 'windows' | 'macos' | 'linux' | 'unknown';

const detectOS = (): { key: OSKey; label: string } => {
  if (typeof window === 'undefined') {
    return { key: 'unknown', label: 'Unknown OS' };
  }

  const platform = (navigator.platform || '').toLowerCase();
  const userAgent = (navigator.userAgent || '').toLowerCase();

  if (platform.includes('win') || userAgent.includes('windows')) {
    return { key: 'windows', label: 'Windows' };
  }
  if (platform.includes('mac') || userAgent.includes('mac os')) {
    return { key: 'macos', label: 'macOS' };
  }
  if (platform.includes('linux') || userAgent.includes('linux')) {
    return { key: 'linux', label: 'Linux' };
  }

  return { key: 'unknown', label: 'Unknown OS' };
};

const OSLogo: React.FC<{ os: OSKey }> = ({ os }) => {
  if (os === 'windows') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="#00A4EF" d="M1 3.5 10.5 2v9H1z" />
        <path fill="#00A4EF" d="M12 1.8 23 0v11H12z" />
        <path fill="#00A4EF" d="M1 13h9.5v9L1 20.6z" />
        <path fill="#00A4EF" d="M12 13h11v11l-11-1.4z" />
      </svg>
    );
  }

  if (os === 'macos') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#111827"
          d="M16.7 12.7c0-2.4 2-3.6 2.1-3.7-1.2-1.8-3-2.1-3.6-2.1-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.9-1.7 0-3.2 1-4.1 2.5-1.8 3.1-.5 7.8 1.3 10.3.9 1.2 1.9 2.6 3.3 2.5 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.2 3.2-2.4 1-1.4 1.4-2.8 1.4-2.9-.1 0-3.5-1.4-3.5-4.2Zm-2.4-7.4c.7-.8 1.2-1.9 1-3-.9 0-2 .6-2.6 1.3-.6.7-1.2 1.8-1 2.9 1 .1 2-.5 2.6-1.2Z"
        />
      </svg>
    );
  }

  if (os === 'linux') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#111827"
          d="M12 2c-2.2 0-3.7 2-3.7 4.8 0 .9.2 1.9.5 2.7-1.9.9-3.1 3.3-3.1 5.9 0 3.5 2.2 6.6 6.3 6.6s6.3-3.1 6.3-6.6c0-2.6-1.2-5-3.1-5.9.3-.8.5-1.8.5-2.7C15.7 4 14.2 2 12 2Z"
        />
        <ellipse cx="10" cy="8.5" rx="0.9" ry="1.1" fill="#fff" />
        <ellipse cx="14" cy="8.5" rx="0.9" ry="1.1" fill="#fff" />
        <path fill="#F59E0B" d="M12 10.2c-.9 0-1.6.4-1.6.9 0 .6.7 1 1.6 1s1.6-.4 1.6-1c0-.5-.7-.9-1.6-.9Z" />
      </svg>
    );
  }

  return (
    <div className="h-5 w-5 rounded-full bg-stone-300" aria-hidden="true" />
  );
};

interface SettingsViewProps {
  notesCount: number;
  categoriesCount: number;
  assetsCount: number;
}

const statCards = [
  { key: 'notes', label: 'Notes' },
  { key: 'categories', label: 'Categories' },
  { key: 'assets', label: 'Assets' }
] as const;

export const SettingsView: React.FC<SettingsViewProps> = ({
  notesCount,
  categoriesCount,
  assetsCount
}) => {
  const [storageInfo, setStorageInfo] = useState({
    used: 0,
    available: 0,
    percentage: 0,
    usedMB: '0',
    availableMB: '0'
  });
  const [osInfo, setOsInfo] = useState<{ key: OSKey; label: string }>({
    key: 'unknown',
    label: 'Unknown OS'
  });

  useEffect(() => {
    setStorageInfo(getStorageInfo());
    setOsInfo(detectOS());
  }, []);

  const stats = {
    notes: notesCount,
    categories: categoriesCount,
    assets: assetsCount
  };

  const storageColor =
    storageInfo.percentage > 90
      ? 'bg-red-500'
      : storageInfo.percentage > 70
        ? 'bg-amber-500'
        : 'bg-emerald-500';

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <p className="text-xs uppercase font-semibold tracking-wide text-stone-400">System</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-xs text-stone-500">Pulm Notes · Version 1.0.0</p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <section className="rounded-[14px] border border-stone-100 bg-stone-50 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">General</p>
                <h2 className="text-lg font-semibold text-stone-900 leading-tight mt-1">Local-first focus</h2>
              </div>
              <span className="text-xs text-stone-500 hidden sm:inline">No accounts, no syncing</span>
            </div>
            <p className="mt-3 text-sm text-stone-600 leading-relaxed">
              Notes are always kept on your device. Nothing leaves your browser unless you manually export
              or backup your data.
            </p>
          </section>

          <section className="rounded-[14px] border border-stone-100 bg-white p-5 shadow-sm space-y-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Data</p>
              <h2 className="text-lg font-semibold text-stone-900 mt-1">Library snapshot</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {statCards.map((stat) => (
                <div
                  key={stat.key}
                  className="rounded-[12px] border border-stone-100 bg-stone-50 p-3 flex flex-col gap-2 shadow-sm"
                >
                  <p className="text-2xl font-semibold text-stone-900">
                    {stats[stat.key]}
                  </p>
                  <span className="text-xs uppercase tracking-wide text-stone-500">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-stone-500">
                <span>Storage used</span>
                <span className="font-medium text-stone-900">{storageInfo.usedMB} MB / ~5 MB</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${storageColor}`}
                  style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                />
              </div>
              {storageInfo.percentage > 80 && (
                <p className="text-xs text-amber-600">
                  Storage is running low. Consider deleting unused assets.
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Capacity</span>
                <span>{storageInfo.percentage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Storage location</span>
                <span>Browser local storage</span>
              </div>
            </div>
          </section>

          <section className="rounded-[14px] border border-stone-100 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">About</p>
                <h2 className="text-lg font-semibold text-stone-900 mt-1">Pulm Notes</h2>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                <OSLogo os={osInfo.key} />
                <span>{osInfo.label}</span>
              </div>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              A calm, local-first notes app crafted for clarity and focus. Built for people who value ownership,
              privacy, and simplicity over feature bloat.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
