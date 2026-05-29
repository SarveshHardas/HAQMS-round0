'use client';

import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg border border-border bg-card/50 flex items-center justify-center shrink-0" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring select-none cursor-pointer"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 fill-amber-400/10 shrink-0" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 shrink-0" />
      )}
    </button>
  );
}
