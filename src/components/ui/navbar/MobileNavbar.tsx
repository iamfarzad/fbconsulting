
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '@/components/ui/Logo';
import MobileMenuItem from './MobileMenuItem';
import SearchButton from '@/components/ui/search/SearchButton';

interface MobileNavbarProps {
  onSearchClick: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ onSearchClick }) => {
  const [open, setOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <div className="flex lg:hidden items-center justify-between py-4">
      {/* Logo */}
      <Logo size="sm" />
      
      {/* Actions */}
      <div className="flex items-center">
        <Button
          onClick={toggleTheme}
          size="sm"
          variant="ghost"
          className="mr-2"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        
        <SearchButton onClick={onSearchClick} size="sm" iconOnly />
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <Logo size="sm" variant="default" />
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <nav className="flex flex-col space-y-4">
                <MobileMenuItem href="/" onClick={handleLinkClick}>Home</MobileMenuItem>
                <MobileMenuItem href="/about" onClick={handleLinkClick}>About</MobileMenuItem>
                <MobileMenuItem href="/services" onClick={handleLinkClick}>Services</MobileMenuItem>
                <MobileMenuItem href="/blog" onClick={handleLinkClick}>Blog</MobileMenuItem>
                <MobileMenuItem href="/contact" onClick={handleLinkClick}>Contact</MobileMenuItem>
              </nav>
              
              <div className="mt-auto">
                <Button asChild className="w-full">
                  <Link to="/contact" onClick={handleLinkClick}>Book a Consultation</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavbar;
