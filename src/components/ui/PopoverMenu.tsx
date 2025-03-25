import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import { Mic, Image } from 'lucide-react';
import '@reach/menu-button/styles.css';

interface PopoverMenuProps {
  onMicClick: () => void;
  onImageClick: () => void;
}

export const PopoverMenu: React.FC<PopoverMenuProps> = ({ onMicClick, onImageClick }) => {
  return (
    <Menu>
      <MenuButton className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none">
        <span className="sr-only">Open menu</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </MenuButton>
      <MenuList className="bg-white border border-gray-200 rounded-lg shadow-lg">
        <MenuItem onSelect={onMicClick} className="flex items-center gap-2 p-2 hover:bg-gray-100">
          <Mic className="w-5 h-5 text-gray-700" />
          <span>Mic</span>
        </MenuItem>
        <MenuItem onSelect={onImageClick} className="flex items-center gap-2 p-2 hover:bg-gray-100">
          <Image className="w-5 h-5 text-gray-700" />
          <span>Image</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
