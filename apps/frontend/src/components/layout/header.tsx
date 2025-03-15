'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from './theme-toggle';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

/**
 * Header component for the earthquake application
 * Contains app title and theme toggle
 */
export const Header = ({
  className,
  title = 'Earthquake Management',
  ...props
}: HeaderProps) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur',
        className
      )}
      {...props}
    >
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 mr-2"
            style={{ color: 'hsl(var(--primary))' }}
          >
            <path d="M12.866 3l9.526 16.5M12.866 3h-1.732M12.866 3 8.777 10.5M1.608 19.5h12.024M1.608 19.5l4.118-7.5M21.392 19.5H18.5M21.392 19.5l-1.37-2.5M7.6 10.5h9.9M7.6 10.5l4.09-7.5M17.5 10.5l-3.325 5.724M7.6 10.5l-.53.5M18.5 19.5l-3.625-6.276" />
          </svg>
          <span className="font-bold">{title}</span>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
