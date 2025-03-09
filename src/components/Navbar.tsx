
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

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
        <Link to="/" className="text-xl font-bold transition-opacity hover:opacity-80">
          AI Automation Ally
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/services" 
            className="text-foreground/80 hover:text-foreground transition-colors duration-200"
          >
            Services
          </Link>
          <Link 
            to="/blog" 
            className="text-foreground/80 hover:text-foreground transition-colors duration-200"
          >
            Blog
          </Link>
          <Link 
            to="/about" 
            className="text-foreground/80 hover:text-foreground transition-colors duration-200"
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-foreground/80 hover:text-foreground transition-colors duration-200"
          >
            Contact
          </Link>
        </nav>

        <div className="hidden md:block">
          <Button 
            size="sm" 
            className="rounded-full px-5 shadow-button transition-all duration-300 hover:shadow-lg"
            onClick={() => window.location.href = '/contact'}
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
          <Link 
            to="/services" 
            className="text-xl font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Services
          </Link>
          <Link 
            to="/blog" 
            className="text-xl font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
          <Link 
            to="/about" 
            className="text-xl font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-xl font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <Button 
            size="lg" 
            className="mt-4 w-full rounded-full"
            onClick={() => {
              setIsMenuOpen(false);
              window.location.href = '/contact';
            }}
          >
            Book a Call
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
