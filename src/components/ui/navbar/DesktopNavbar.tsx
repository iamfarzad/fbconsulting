
import React from 'react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import NavLink from '@/components/ui/NavLink';
import SearchButton from '@/components/ui/search/SearchButton';

interface DesktopNavbarProps {
  onSearchClick: () => void;
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({ onSearchClick }) => {
  const { setTheme, theme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="hidden lg:flex items-center justify-between py-4">
      {/* Logo */}
      <Logo size="md" />
      
      {/* Navigation Links */}
      <nav className="flex items-center space-x-8">
        <NavLink href="/" exact>
          Home
        </NavLink>
        <NavLink href="/about">
          About
        </NavLink>
        <NavLink href="/services">
          Services
        </NavLink>
        <NavLink href="/blog">
          Blog
        </NavLink>
        <NavLink href="/contact">
          Contact
        </NavLink>
      </nav>
      
      {/* Actions */}
      <div className="flex items-center space-x-4">
        <SearchButton onClick={onSearchClick} iconOnly />
        
        <Button
          onClick={toggleTheme}
          size="icon"
          variant="ghost"
          className="rounded-full"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button asChild>
          <Link to="/contact">Book a Consultation</Link>
        </Button>
      </div>
    </div>
  );
};

export default DesktopNavbar;
