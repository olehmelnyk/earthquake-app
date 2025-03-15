import * as React from 'react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from './theme-toggle';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Header component for the earthquake application
 * Contains app title, navigation controls, and theme toggle
 */
export function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-background px-4 md:px-6 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="hidden md:flex">
          <span className="text-xl font-bold text-foreground">Earthquake Management</span>
        </div>
        <div className="md:hidden">
          <span className="text-xl font-bold text-foreground">EMS</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center space-x-4">
          <NavLink href="#" isActive>Dashboard</NavLink>
          <NavLink href="#">Earthquakes</NavLink>
          <NavLink href="#">Settings</NavLink>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

interface NavLinkProps {
  children: React.ReactNode;
  href: string;
  isActive?: boolean;
}

/**
 * Navigation link component for the header
 */
function NavLink({ children, href, isActive }: NavLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive 
          ? "text-foreground font-semibold"
          : "text-muted-foreground"
      )}
    >
      {children}
    </a>
  );
}
