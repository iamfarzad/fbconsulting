import React from 'react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import { NavLink } from '@/components/ui/NavLink';
import { PopoverMenu } from '@/components/ui/PopoverMenu';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("flex items-center justify-between p-4 border-b border-gray-200", className)}>
      <div className="flex items-center space-x-4">
        <Logo className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Farzad-AI</h1>
      </div>
      <nav className="flex items-center space-x-4">
        <NavLink href="/about" className="text-gray-600 hover:text-gray-900">About</NavLink>
        <NavLink href="/services" className="text-gray-600 hover:text-gray-900">Services</NavLink>
        <NavLink href="/contact" className="text-gray-600 hover:text-gray-900">Contact</NavLink>
        <PopoverMenu />
      </nav>
    </header>
  );
};
