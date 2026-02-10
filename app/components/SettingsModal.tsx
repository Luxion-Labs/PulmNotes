'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { getStorageInfo } from '@/app/lib/storageUtils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notesCount: number;
  categoriesCount: number;
  assetsCount: number;
}

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

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  notesCount,
  categoriesCount,
  assetsCount
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0, percentage: 0, usedMB: '0', availableMB: '0' });
  const [osInfo, setOsInfo] = useState<{ key: OSKey; label: string }>({ key: 'unknown', label: 'Unknown OS' });

  useEffect(() => {
    if (isOpen) {
      setStorageInfo(getStorageInfo());
      setOsInfo(detectOS());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div 
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-stone-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h3 className="text-sm font-semibold text-stone-900 mb-4 uppercase tracking-wide">
              General
            </h3>
            
            <div className="space-y-4">
              <div className="py-3">
                <div className="text-xs text-stone-600 leading-relaxed">
                  <span className="font-medium text-stone-900">Local-only, no cloud, no login.</span>
                  <br />
                  Your notes are stored securely in your browser. Nothing leaves your device.
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-stone-900 mb-4 uppercase tracking-wide">
              Data
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-stone-600">Notes</span>
                <span className="text-sm font-medium text-stone-900">{notesCount}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-stone-600">Categories</span>
                <span className="text-sm font-medium text-stone-900">{categoriesCount}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-stone-600">Assets</span>
                <span className="text-sm font-medium text-stone-900">{assetsCount}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-t border-stone-100 mt-2 pt-3">
                <span className="text-sm text-stone-600">Storage used</span>
                <span className="text-xs text-stone-500">{storageInfo.usedMB} MB / ~5 MB</span>
              </div>

              <div className="py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-stone-500">Storage capacity</span>
                  <span className="text-xs text-stone-500">{storageInfo.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      storageInfo.percentage > 90 ? 'bg-red-500' :
                      storageInfo.percentage > 70 ? 'bg-amber-500' :
                      'bg-stone-500'
                    }`}
                    style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                  />
                </div>
                {storageInfo.percentage > 80 && (
                  <p className="text-xs text-amber-600 mt-2">
                    Storage is running low. Consider deleting unused assets.
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-stone-600">Storage location</span>
                <span className="text-xs text-stone-500">Browser local storage</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-stone-900 mb-4 uppercase tracking-wide">
              About
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-stone-900 mb-1">Pulm Notes</div>
                <div className="text-xs text-stone-500">Version 1.0.0</div>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-stone-100">
                <span className="text-sm text-stone-600">Operating System</span>
                <div className="flex items-center gap-2 text-sm font-medium text-stone-900">
                  <OSLogo os={osInfo.key} />
                  <span>{osInfo.label}</span>
                </div>
              </div>
              
              <div className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
                A calm, local-first notes app designed for clarity and focus. 
                Built for people who value ownership, privacy, and simplicity over features.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
