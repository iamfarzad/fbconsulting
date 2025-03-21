
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Sun, Moon, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();
  const isNorwegian = language === 'no';

  const isDarkMode = theme === 'dark';
  const toggleTheme = () => setTheme(isDarkMode ? 'light' : 'dark');

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-50">
      <Container className="flex items-center justify-between py-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 mr-8">
            <span className="font-bold text-xl">F.B Consulting</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/services" isActive={isActive('/services')}>
              {isNorwegian ? 'Tjenester' : 'Services'}
            </NavLink>
            <NavLink to="/about" isActive={isActive('/about')}>
              {isNorwegian ? 'Om' : 'About'}
            </NavLink>
            <NavLink to="/blog" isActive={isActive('/blog')}>
              {isNorwegian ? 'Blogg' : 'Resources'}
            </NavLink>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            aria-label="Search" 
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            <Search size={20} />
          </button>
          
          <button
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link to="/contact">
            <Button className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Contact Us
            </Button>
          </Link>
        </div>
      </Container>
    </header>
  );
};

const NavLink: React.FC<{ 
  to: string; 
  isActive: boolean;
  children: React.ReactNode;
}> = ({ to, isActive, children }) => {
  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium transition-colors relative",
        isActive 
          ? "text-black dark:text-white after:absolute after:bottom-[-22px] after:left-0 after:right-0 after:h-0.5 after:bg-black dark:after:bg-white" 
          : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
      )}
    >
      {children}
    </Link>
  );
};

export default Navbar;
