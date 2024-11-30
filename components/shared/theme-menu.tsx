// theme-menu.tsx
'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, X, RefreshCw } from 'lucide-react';
import { useAppContext } from './AppContext';

interface ThemeMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeMenu({ isOpen, onClose }: ThemeMenuProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { resetToInitialFeed } = useAppContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 w-72
          bg-white dark:bg-zinc-900 
          border-l border-zinc-200 dark:border-zinc-800
          z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-medium text-black dark:text-white">Developer Tools</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Appearance
            </h3>
            
            {/* Theme Options */}
            <div className="space-y-2">
              <button
                onClick={() => setTheme('light')}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg
                  ${theme === 'light' 
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}
                `}
              >
                <Sun className="w-5 h-5" />
                <span className="text-sm font-medium">Light</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg
                  ${theme === 'dark' 
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}
                `}
              >
                <Moon className="w-5 h-5" />
                <span className="text-sm font-medium">Dark</span>
              </button>
            </div>

            {/* Reset Feed Option */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                Feed Options
              </h3>
              <button
                onClick={() => {
                  resetToInitialFeed();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="text-sm font-medium">Reset Feed</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}