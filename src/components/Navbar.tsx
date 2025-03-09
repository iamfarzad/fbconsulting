
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-4 md:px-6',
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="text-xl font-bold transition-opacity hover:opacity-80">
          AI Automation Ally
        </a>

        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#services" 
            className="text-foreground/80 hover:text-foreground transition-colors duration-200"
          >
            Services
          </a>
          <a 
            href="#why-me" 
            className="text-foreground/80 hover:text-foreground transition-colors duration-200"
          >
            Why Me
          </a>
          <a 
            href="#contact" 
            className="text-foreground/80 hover:text-foreground transition-colors duration-200"
          >
            Contact
          </a>
        </nav>

        <div className="hidden md:block">
          <Button 
            size="sm" 
            className="rounded-full px-5 shadow-button transition-all duration-300 hover:shadow-lg"
          >
            Book a Call
          </Button>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden fixed inset-0 bg-background z-40 transition-transform duration-300 ease-in-out transform pt-20',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="flex flex-col items-center space-y-8 p-8">
          <a 
            href="#services" 
            className="text-xl font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Services
          </a>
          <a 
            href="#why-me" 
            className="text-xl font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Why Me
          </a>
          <a 
            href="#contact" 
            className="text-xl font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </a>
          <Button 
            size="lg" 
            className="mt-4 w-full rounded-full"
            onClick={() => setIsMenuOpen(false)}
          >
            Book a Call
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
