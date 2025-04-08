
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  className,
  activeClassName = 'text-primary font-medium',
  exact = false,
}) => {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === href 
    : location.pathname.startsWith(href);
  
  return (
    <Link
      to={href}
      className={cn(
        'transition-colors hover:text-primary',
        isActive && activeClassName,
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
