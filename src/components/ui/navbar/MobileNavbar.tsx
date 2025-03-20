import React from "react";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Accordion } from "@/components/ui/accordion";
import { MenuItem } from "./MenuItem";
import { renderMobileMenuItem } from "./MobileMenuItem";
import { MobileDarkModeToggle, DarkModeToggleProps } from "./DarkModeToggle";
import { SearchButton } from "@/components/ui/search/SearchButton";
import { SearchBar } from "@/components/ui/search/SearchBar";
import { Logo3D } from "@/components/3d/Logo3D";

interface NavbarLogoProps {
  url: string;
  src: string;
  alt: string;
  title: string;
}

interface MobileNavbarProps {
  logo: NavbarLogoProps;
  menu: MenuItem[];
  mobileExtraLinks: {
    name: string;
    url: string;
  }[];
  ctaButton: {
    text: string;
    url: string;
  };
  darkModeToggle?: DarkModeToggleProps;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({
  logo,
  menu,
  mobileExtraLinks,
  ctaButton,
  darkModeToggle,
}) => {
  return (
    <div className="block lg:hidden">
      <div className="flex items-center justify-between">
        <a href={logo.url} className="flex items-center gap-2">
          <Logo3D size="w-10 h-10" />
          <span className="text-lg font-semibold">{logo.title}</span>
        </a>
        <div className="flex items-center gap-2">
          <SearchButton variant="ghost" iconOnly size="icon" />
          {darkModeToggle && (
            <MobileDarkModeToggle
              isDarkMode={darkModeToggle.isDarkMode}
              onToggle={darkModeToggle.onToggle}
            />
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <a href={logo.url} className="flex items-center gap-2">
                    <Logo3D size="w-10 h-10" />
                    <span className="text-lg font-semibold">
                      {logo.title}
                    </span>
                  </a>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 mb-6">
                <SearchBar onSearch={() => {}} className="w-full" />
              </div>
              <div className="flex flex-col gap-6">
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-4"
                >
                  {menu.map((item) => renderMobileMenuItem(item))}
                </Accordion>
                <div className="border-t py-4">
                  <div className="grid grid-cols-2 justify-start">
                    {mobileExtraLinks.map((link, idx) => (
                      <a
                        key={idx}
                        className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                        href={link.url}
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button asChild>
                    <a href={ctaButton.url}>{ctaButton.text}</a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
