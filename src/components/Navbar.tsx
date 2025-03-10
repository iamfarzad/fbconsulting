
import React, { useEffect, useState } from 'react';
import { ShadcnblocksNavbarDemo } from '@/components/ui/shadcnblocks-navbar-demo';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
import { Label } from '@/components/ui/label';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Set initial dark mode based on user preference or system preference
    const storedTheme = localStorage.getItem('theme');
    
    // Default to light mode if no stored preference
    const initialDarkMode = storedTheme === 'dark';
    setIsDarkMode(initialDarkMode);
    
    if (initialDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
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
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem('theme', checked ? 'dark' : 'light');
    
    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        scrolled ? 'bg-background/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      )}
    >
      <ShadcnblocksNavbarDemo 
        darkModeToggle={{
          isDarkMode,
          onToggle: toggleDarkMode
        }}
      />
    </header>
  );
};

export default Navbar;
