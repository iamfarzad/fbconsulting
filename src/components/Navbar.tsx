
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ShadcnblocksNavbarDemo } from './ui/shadcnblocks-navbar-demo';

const Navbar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Ensure dark mode toggle is consistent and accessible
  useEffect(() => {
    // Set initial dark mode based on user preference or system preference
    const storedTheme = localStorage.getItem('theme');
    const initialDarkMode = storedTheme === 'dark';
    setIsDarkMode(initialDarkMode);
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleDarkMode = (pressed: boolean) => {
    setIsDarkMode(pressed);
    localStorage.setItem('theme', pressed ? 'dark' : 'light');
    if (pressed) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
      scrolled ? 'bg-background/90 backdrop-blur-md shadow-md' : 'bg-transparent'
    )}>
      <ShadcnblocksNavbarDemo darkModeToggle={{ isDarkMode, onToggle: toggleDarkMode }} />
    </header>
  );
};

export default Navbar;
