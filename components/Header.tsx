
import React from 'react';
import { SearchIcon, SunIcon, MoonIcon, HomeIcon } from './icons/Icons';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  selectedFlipFlopName?: string | null;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm, theme, toggleTheme, selectedFlipFlopName, onHomeClick }) => {
  return (
    <header className="flex-shrink-0 bg-light-card dark:bg-dark-card border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
      <div className="flex items-center gap-4">
        {selectedFlipFlopName && (
           <button 
             onClick={onHomeClick}
             className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
             aria-label="Go to home"
           >
             <HomeIcon className="w-6 h-6" />
           </button>
        )}
        <h1 className="text-xl font-semibold text-light-text dark:text-dark-text hidden sm:block">
          {selectedFlipFlopName || 'Digital Logic Simulator'}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search flip-flop..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 w-48 sm:w-64 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
      </div>
    </header>
  );
};
