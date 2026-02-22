'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Asset, Category, DailyReflection, Note } from '@/app/types';
import { formatBytes, getStorageInfo } from '@/app/lib/storageUtils';
import { APP_VERSION } from '@/app/lib/version';
import { UpdateChecker } from '@/app/components/UpdateChecker';
import {
  createNoteStore,
  createCategoryStore,
  createAssetStore,
  createReflectionStore
} from '@/app/lib/persistence';
import {
  Shield,
  Database,
  Info,
  Download,
  Upload,
  Trash2,
  HardDrive,
  BookOpen,
  Archive,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  FolderArchive,
  Github,
  Scale,
  MonitorSmartphone,
  MessageSquare,
} from 'lucide-react';

const noteStore = createNoteStore();
const categoryStore = createCategoryStore();
const assetStore = createAssetStore();
const reflectionStore = createReflectionStore();

type OSKey = 'windows' | 'macos' | 'linux' | 'unknown';
type SettingsTab = 'general' | 'data' | 'about';

const detectPlatform = (): OSKey => {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }
  const platform = (navigator.platform || '').toLowerCase();
  const userAgent = (navigator.userAgent || '').toLowerCase();
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
};

const PlatformIcon: React.FC<{ os: OSKey }> = ({ os }) => {
  const commonProps = { className: 'h-5 w-5', 'aria-hidden': true };
  if (os === 'windows') {
    return (
      <svg viewBox="0 0 24 24" {...commonProps}>
        <path fill="#00A4EF" d="M1 3.5 10.5 2v9H1z" />
        <path fill="#6fc0ff" d="M12 1.8 23 0v11H12z" />
        <path fill="#0078d4" d="M1 13h9.5v9L1 20.6z" />
        <path fill="#005ea2" d="M12 13h11v11l-11-1.4z" />
      </svg>
    );
  }
  if (os === 'macos') {
    return (
      <svg viewBox="0 0 24 24" {...commonProps}>
        <path
          fill="#111827"
          d="M16.7 12.7c0-2.4 2-3.6 2.1-3.7-1.2-1.8-3-2.1-3.6-2.1-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.9-1.7 0-3.2 1-4.1 2.5-1.8 3.1-.5 7.8 1.3 10.3.9 1.2 1.9 2.6 3.3 2.5 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.2 3.2-2.4 1-1.4 1.4-2.8 1.4-2.9-.1 0-3.5-1.4-3.5-4.2Zm-2.4-7.4c.7-.8 1.2-1.9 1-3-.9 0-2 .6-2.6 1.3-.6.7-1.2 1.8-1 2.9 1 .1 2-.5 2.6-1.2Z"
        />
      </svg>
    );
  }
  if (os === 'linux') {
    return (
      <svg viewBox="0 0 24 24" {...commonProps}>
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
  return <span className="h-5 w-5 rounded-full bg-stone-200" aria-hidden="true" />;
};

/* ─── Sidebar nav items ─── */
const NAV_ITEMS: { key: SettingsTab; label: string; icon: React.ReactNode; description: string }[] = [
  { key: 'general', label: 'General', icon: <Shield size={18} />, description: 'Privacy & philosophy' },
  { key: 'data', label: 'Storage', icon: <Database size={18} />, description: 'Backup & History' },
  { key: 'about', label: 'About', icon: <Info size={18} />, description: 'Version & credits' },
];

interface SettingsViewProps {
  notes: Note[];
  categories: Category[];
  assets: Asset[];
  reflections: DailyReflection[];
  onOpenFeedback: () => void;
}

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const SettingsView: React.FC<SettingsViewProps> = ({
  notes,
  categories,
  assets,
  reflections,
  onOpenFeedback
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const contentRef = useRef<HTMLDivElement>(null);
  const [storageInfo, setStorageInfo] = useState<{
    used: number;
    available: number;
    percentage: number;
    usedMB: string;
    availableMB: string | number;
    type: 'database';
  }>({ used: 0, available: 0, percentage: 0, usedMB: '0', availableMB: 'unlimited', type: 'database' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const loadStorageInfo = async () => {
      const info = await getStorageInfo();
      setStorageInfo(info);
    };
    
    loadStorageInfo();
  }, []);

  const handleBackupSnapshot = () => {
    if (typeof window === 'undefined') return;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const payload = {
      notes,
      categories,
      assets,
      reflections,
      recordedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    });
    downloadBlob(blob, `pulm-backup-${timestamp}.json`);
  };

  const [selectedBackupFile, setSelectedBackupFile] = useState<string | null>(null);

  const handleBackupFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedBackupFile(file.name);

    if (typeof window === 'undefined') {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const { notes: importedNotes, categories: importedCategories, assets: importedAssets, reflections: importedReflections } =
        parsed ?? {};

      if (!Array.isArray(importedNotes) || !Array.isArray(importedCategories)) {
        throw new Error('Missing notes or categories in the snapshot');
      }

      // Import directly to database using the stores
      await categoryStore.saveCategories(importedCategories);
      await noteStore.saveNotes(importedNotes);

      if (Array.isArray(importedAssets)) {
        await assetStore.saveAssets(importedAssets);
      }

      if (Array.isArray(importedReflections)) {
        await reflectionStore.saveReflections(importedReflections);
      }

      window.location.reload();
    } catch (error) {
      console.error('Unable to import snapshot', error);
      if (typeof window !== 'undefined') {
        window.alert('Unable to import the selected snapshot. Make sure it is a valid Pulm backup file.');
      }
    } finally {
      // Clear the input to allow re-selecting the same file later.
      event.target.value = '';
    }
  };

  const handleClearLibrary = async () => {
    if (typeof window === 'undefined') return;
    const confirmed = window.confirm(
      'This will remove all notes, categories, assets, reflections, and activity logs from the database. This cannot be undone.'
    );
    if (!confirmed) {
      return;
    }
    
    try {
      // Clear all data by saving empty arrays
      await noteStore.saveNotes([]);
      await categoryStore.saveCategories([]);
      await assetStore.saveAssets([]);
      await reflectionStore.saveReflections([]);
      
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear library:', error);
      window.alert('Failed to clear library. Please try again.');
    }
  };

  const storageLocationText = 'SQLite database in app data directory';
  
  const storageDetailsText = `Database file size: ${formatBytes(storageInfo.used)}`;

  const activeNotesCount = useMemo(
    () => notes.filter((note) => !note.isDeleted).length,
    [notes]
  );
  const archivedNotesCount = notes.length - activeNotesCount;
  const platformKey = useMemo(() => detectPlatform(), []);
  const platformLabelMap: Record<OSKey, string> = {
    windows: 'Windows',
    macos: 'macOS',
    linux: 'Linux',
    unknown: 'Unknown'
  };
  const platformLabel = platformLabelMap[platformKey];

  /* ─── Tab content renderers ─── */

  const renderGeneral = () => (
    <div className="space-y-6 animate-[fadeIn_0.25s_ease]">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 p-8 text-white">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/[0.04] blur-2xl" />
        <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/[0.03] blur-xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <Shield size={20} className="text-white/90" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Privacy-first by design</h2>
              <p className="text-sm text-white/50">Your notes never leave this device</p>
            </div>
          </div>
          <p className="text-sm text-white/60 leading-relaxed max-w-lg">
            Pulm keeps everything rooted on this device. No tracking, no analytics, no cloud &mdash;
            only the quiet reflection you choose to log.
          </p>
        </div>
      </div>

      {/* Philosophy cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: <Shield size={18} className="text-emerald-600" />,
            title: 'Zero telemetry',
            text: 'No analytics or tracking. Nothing leaves your device unless you export.',
            accent: 'bg-emerald-50 border-emerald-100',
          },
          {
            icon: <HardDrive size={18} className="text-sky-600" />,
            title: 'Local storage',
            text: 'Your data lives in a local SQLite database. You own every byte.',
            accent: 'bg-sky-50 border-sky-100',
          },
          {
            icon: <BookOpen size={18} className="text-amber-600" />,
            title: 'Calm workspace',
            text: 'Designed for reflection. No productivity pressure, no streak counters.',
            accent: 'bg-amber-50 border-amber-100',
          },
          {
            icon: <Scale size={18} className="text-violet-600" />,
            title: 'Open source',
            text: 'Fully open, fully transparent. Inspect every line of code on GitHub.',
            accent: 'bg-violet-50 border-violet-100',
          },
        ].map((card) => (
          <div
            key={card.title}
            className={`group rounded-2xl border p-5 transition-all duration-200 hover:shadow-md ${card.accent}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">{card.title}</p>
                <p className="mt-1 text-xs text-stone-500 leading-relaxed">{card.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback CTA */}
      <button
        type="button"
        onClick={onOpenFeedback}
        className="group flex w-full items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-left transition-all duration-200 hover:border-stone-300 hover:shadow-sm"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 transition-colors group-hover:bg-stone-200">
          <MessageSquare size={18} className="text-stone-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-900">Send feedback</p>
          <p className="text-xs text-stone-500">Share thoughts or report an issue</p>
        </div>
        <ChevronRight size={16} className="text-stone-400 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );

  const renderData = () => (
    <div className="space-y-6 animate-[fadeIn_0.25s_ease]">
      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: <BookOpen size={18} className="text-stone-600" />,
            label: 'Active notes',
            value: activeNotesCount,
            sub: `${archivedNotesCount} archived`,
            accent: 'from-stone-50 to-white',
          },
          {
            icon: <FolderArchive size={18} className="text-stone-600" />,
            label: 'Categories',
            value: categories.length,
            sub: `${assets.length} assets`,
            accent: 'from-stone-50 to-white',
          },
          {
            icon: <HardDrive size={18} className="text-stone-600" />,
            label: 'Storage',
            value: formatBytes(storageInfo.used),
            sub: storageLocationText,
            accent: 'from-stone-50 to-white',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-2xl border border-stone-200/80 bg-gradient-to-b ${stat.accent} p-5`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100">
                {stat.icon}
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                {stat.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-stone-900 tracking-tight">{stat.value}</p>
            <p className="mt-1 text-xs text-stone-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Storage bar */}
      {storageInfo.percentage > 0 && (
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Storage usage
            </span>
            <span className="text-xs text-stone-500">{storageDetailsText}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-stone-400 to-stone-600 transition-all duration-700"
              style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-stone-400">
            {storageInfo.percentage.toFixed(1)}% of available storage
          </p>
        </div>
      )}

      {/* Export / Backup section */}
      <div className="rounded-2xl border border-stone-200/80 bg-white overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-stone-900">Export & Backup</h3>
          <p className="mt-1 text-xs text-stone-400">Download local copies of your data</p>
        </div>

        <div className="divide-y divide-stone-100">
          <button
            type="button"
            onClick={handleBackupSnapshot}
            className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-stone-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 transition-colors group-hover:bg-stone-200">
              <Download size={16} className="text-stone-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-800">Download library snapshot</p>
              <p className="text-xs text-stone-400">Full JSON backup of notes, categories &amp; assets</p>
            </div>
            <ChevronRight size={14} className="text-stone-300 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Import section */}
      <div className="rounded-2xl border border-stone-200/80 bg-white overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-stone-900">Import</h3>
          <p className="mt-1 text-xs text-stone-400">Restore from a previous backup snapshot</p>
        </div>

        <div className="px-5 pb-5">
          <label className="group flex items-center gap-4 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/50 px-5 py-5 cursor-pointer transition-colors hover:border-stone-300 hover:bg-stone-50">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-stone-100">
              <Upload size={16} className="text-stone-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-700">
                {selectedBackupFile ? selectedBackupFile : 'Choose a backup file'}
              </p>
              <p className="text-xs text-stone-400">
                {selectedBackupFile ? 'File selected — importing...' : 'Drop a .json backup or click to browse'}
              </p>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleBackupFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-200/60 bg-red-50/30 overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-400" />
          <h3 className="text-sm font-semibold text-red-700">Danger zone</h3>
        </div>
        <div className="px-5 pb-5 space-y-3">
          <p className="text-xs text-red-500/80 leading-relaxed">
            Clearing the library permanently removes every note, category, asset, reflection, and
            activity entry from this device. This action cannot be undone.
          </p>
          <button
            type="button"
            onClick={handleClearLibrary}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50 hover:border-red-300 hover:shadow-sm active:scale-[0.98]"
          >
            <Trash2 size={14} />
            Clear entire library
          </button>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-6 animate-[fadeIn_0.25s_ease]">
      {/* App identity card */}
      <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-8">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-stone-100/60 blur-3xl" />
        <div className="relative z-10 flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 shadow-lg shadow-stone-900/20">
            <span className="text-2xl font-bold text-white tracking-tight">P</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">Pulm Notes</h2>
            <p className="mt-1 text-sm text-stone-400">
              A calm, private space for reflection that keeps you rooted in local notes.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-stone-600">v{APP_VERSION}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Update Checker */}
      <div className="rounded-2xl border border-stone-200/80 bg-white p-5">
        <h3 className="text-sm font-semibold text-stone-900 mb-4">Software Updates</h3>
        <UpdateChecker currentVersion={APP_VERSION} />
      </div>

      {/* System info */}
      <div className="rounded-2xl border border-stone-200/80 bg-white overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-stone-900">System</h3>
        </div>
        <div className="divide-y divide-stone-100">
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <MonitorSmartphone size={16} className="text-stone-400" />
              <span className="text-sm text-stone-600">Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <PlatformIcon os={platformKey} />
              <span className="text-sm font-medium text-stone-800">{platformLabel}</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <Database size={16} className="text-stone-400" />
              <span className="text-sm text-stone-600">Storage engine</span>
            </div>
            <span className="text-sm font-medium text-stone-800">SQLite</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <Archive size={16} className="text-stone-400" />
              <span className="text-sm text-stone-600">Data size</span>
            </div>
            <span className="text-sm font-medium text-stone-800">{formatBytes(storageInfo.used)}</span>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="rounded-2xl border border-stone-200/80 bg-white overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-stone-900">Links</h3>
        </div>
        <div className="divide-y divide-stone-100">
          <a
            href="https://github.com/Luxion-Labs/PulmNotes.git"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-stone-50"
          >
            <div className="flex items-center gap-3">
              <Github size={16} className="text-stone-400" />
              <span className="text-sm text-stone-600">Source code</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-400 transition-colors group-hover:text-stone-600">
              <span className="text-xs">GitHub</span>
              <ExternalLink size={12} />
            </div>
          </a>
          <a
            href="https://www.pulm.luxionlabs.com"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-stone-50"
          >
            <div className="flex items-center gap-3">
              <ExternalLink size={16} className="text-stone-400" />
              <span className="text-sm text-stone-600">Pulm Website</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-400 transition-colors group-hover:text-stone-600">
              <span className="text-xs">pulm.luxionlabs.com</span>
              <ExternalLink size={12} />
            </div>
          </a>
          <a
            href="https://luxionlabs.com"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-stone-50"
          >
            <div className="flex items-center gap-3">
              <ExternalLink size={16} className="text-stone-400" />
              <span className="text-sm text-stone-600">Studio</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-400 transition-colors group-hover:text-stone-600">
              <span className="text-xs">luxionlabs.com</span>
              <ExternalLink size={12} />
            </div>
          </a>
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <Scale size={16} className="text-stone-400" />
              <span className="text-sm text-stone-600">License</span>
            </div>
            <span className="text-xs font-medium text-stone-500 bg-stone-100 rounded-full px-2.5 py-0.5">
              Open source
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-xs text-stone-300">
          Made with care for people who value ownership, privacy, and simplicity.
        </p>
      </div>
    </div>
  );

  const tabContent: Record<SettingsTab, () => React.ReactNode> = {
    general: renderGeneral,
    data: renderData,
    about: renderAbout,
  };

  return (
    <div className="flex-1 overflow-hidden bg-[#f7f6f4] text-stone-900">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="flex h-full">
        {/* ─── Left sidebar navigation ─── */}
        <nav className="w-56 shrink-0 border-r border-stone-200/70 bg-[#f0efed] p-4 flex flex-col gap-1 overflow-y-auto">
          <p className="px-3 pt-1 pb-3 text-[10px] uppercase tracking-[0.25em] font-bold text-stone-400 select-none">
            Settings
          </p>

          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveTab(item.key);
                  contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`
                  group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150
                  ${isActive
                    ? 'bg-white shadow-sm shadow-stone-200/60 text-stone-900'
                    : 'text-stone-500 hover:bg-white/60 hover:text-stone-700'}
                `}
              >
                <span className={`transition-colors ${isActive ? 'text-stone-800' : 'text-stone-400 group-hover:text-stone-500'}`}>
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className={`text-sm leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </p>
                  <p className="text-[11px] text-stone-400 leading-tight mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* ─── Main content area ─── */}
        <div ref={contentRef} className="flex-1 overflow-y-auto scrollbar-none">
          <div className="max-w-2xl mx-auto px-8 py-10">
            {/* Section header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                {NAV_ITEMS.find((n) => n.key === activeTab)?.label}
              </h1>
              <p className="mt-1 text-sm text-stone-400">
                {NAV_ITEMS.find((n) => n.key === activeTab)?.description}
              </p>
            </div>

            {/* Tab content */}
            {tabContent[activeTab]()}
          </div>
        </div>
      </div>
    </div>
  );
};
