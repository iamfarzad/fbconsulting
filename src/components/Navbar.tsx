
import React from 'react';
import { ShadcnblocksNavbarDemo } from '@/components/ui/shadcnblocks-navbar-demo';
import { cn } from '@/lib/utils';

const Navbar = () => {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out'
      )}
    >
      <ShadcnblocksNavbarDemo />
    </header>
  );
};

export default Navbar;
