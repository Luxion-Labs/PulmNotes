'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { isTauriApp } from '@/app/lib/openExternal';
import { getCurrentWindow } from '@tauri-apps/api/window';

const TITLE_BAR_HEIGHT = 40;

export const CustomTitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [canUseTauri, setCanUseTauri] = useState(false);

  useEffect(() => {
    setCanUseTauri(isTauriApp());
  }, []);

  const handleMinimize = useCallback(async () => {
    if (!canUseTauri) return;
    const appWindow = getCurrentWindow();
    await appWindow.minimize();
  }, [canUseTauri]);

  const handleMaximize = useCallback(async () => {
    if (!canUseTauri) return;
    const appWindow = getCurrentWindow();
    const isMax = await appWindow.isMaximized();

    if (isMax) {
      await appWindow.unmaximize();
    } else {
      await appWindow.maximize();
    }
    setIsMaximized(!isMax);
  }, [canUseTauri]);

  const handleClose = useCallback(async () => {
    if (!canUseTauri) return;
    const appWindow = getCurrentWindow();
    await appWindow.close();
  }, [canUseTauri]);

  const handleDoubleClick = useCallback(() => {
    void handleMaximize();
  }, [handleMaximize]);

  return (
    <div
      data-tauri-drag-region
      onDoubleClick={handleDoubleClick}
      className="flex items-center justify-between px-3 h-10 bg-[#f1f2ef] border-b-2 border-stone-300 shadow-[0_1px_0_rgba(0,0,0,0.06)] select-none shrink-0"
      style={{ height: TITLE_BAR_HEIGHT }}
    >
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-[#6b5f54] font-mono" data-tauri-drag-region>
        Pulm
      </div>

      <div className="flex items-center gap-1" data-tauri-drag-region="false">
        <button
          type="button"
          onClick={handleMinimize}
          disabled={!canUseTauri}
          className="h-7 w-9 inline-flex items-center justify-center rounded-md text-stone-600 hover:bg-stone-200/60 transition disabled:opacity-40 disabled:hover:bg-transparent"
          title="Minimize"
          data-tauri-drag-region="false"
        >
          <Minus size={14} />
        </button>
        <button
          type="button"
          onClick={handleMaximize}
          disabled={!canUseTauri}
          className="h-7 w-9 inline-flex items-center justify-center rounded-md text-stone-600 hover:bg-stone-200/60 transition disabled:opacity-40 disabled:hover:bg-transparent"
          title={isMaximized ? 'Restore' : 'Maximize'}
          data-tauri-drag-region="false"
        >
          <Square size={12} />
        </button>
        <button
          type="button"
          onClick={handleClose}
          disabled={!canUseTauri}
          className="h-7 w-9 inline-flex items-center justify-center rounded-md text-stone-600 hover:bg-red-500/80 hover:text-white transition disabled:opacity-40 disabled:hover:bg-transparent"
          title="Close"
          data-tauri-drag-region="false"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
