
import React from "react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { MenuItem, renderMenuItem } from "./MenuItem";
import { DesktopDarkModeToggle, DarkModeToggleProps } from "./DarkModeToggle";
import { SearchButton } from "@/components/ui/search/SearchButton";

interface NavbarLogoProps {
  url: string;
  src: string;
  alt: string;
  title: string;
}

interface DesktopNavbarProps {
  logo: NavbarLogoProps;
  menu: MenuItem[];
  ctaButton: {
    text: string;
    url: string;
  };
  darkModeToggle?: DarkModeToggleProps;
}

export const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  logo,
  menu,
  ctaButton,
  darkModeToggle,
}) => {
  return (
    <nav className="hidden justify-between lg:flex">
      <div className="flex items-center gap-6">
        <a href={logo.url} className="flex items-center gap-2">
          <img src={logo.src} className="w-8" alt={logo.alt} />
          <span className="text-lg font-semibold">{logo.title}</span>
        </a>
        <div className="flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              {menu.map((item) => renderMenuItem(item))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <SearchButton variant="ghost" iconOnly />
        {darkModeToggle && (
          <DesktopDarkModeToggle
            isDarkMode={darkModeToggle.isDarkMode}
            onToggle={darkModeToggle.onToggle}
          />
        )}
        <Button asChild size="sm">
          <a href={ctaButton.url}>{ctaButton.text}</a>
        </Button>
      </div>
    </nav>
  );
};
