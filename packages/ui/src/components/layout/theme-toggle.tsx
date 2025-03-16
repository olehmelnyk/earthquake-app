"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "../../lib/utils";

type ThemeToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Theme toggle component for switching between light and dark themes
 */
export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = React.useState(false);

  // Effect to set initial theme based on localStorage or system preference
  React.useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      setTheme(systemTheme);
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white border border-gray-200 hover:bg-gray-100 hover:text-gray-900 h-10 w-10 dark:ring-offset-gray-950 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        !mounted && "opacity-0",
        className
      )}
      {...props}
    >
      {mounted && theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
