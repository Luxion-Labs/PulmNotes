'use client';

import { DM_Sans, Inter } from "next/font/google";
import { useEffect } from "react";
import "./globals.scss";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable specific keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F5 - Refresh
      if (e.key === 'F5') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+R or Cmd+R - Refresh
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+R or Cmd+Shift+R - Hard refresh
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I or Cmd+Option+I - Dev tools
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // F12 - Dev tools
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <html
      lang="en"
      data-pulm-theme="light"
      data-pulm-editor-width="comfortable"
      data-pulm-font-size="default"
      className={`${dmSans.variable} ${inter.variable} h-full overflow-hidden`}
    >
      <body className="h-full overflow-hidden bg-white text-gray-900 cursor-text font-sans selection:bg-blue-100 scrollbar-none">
        <div className="flex h-screen overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
