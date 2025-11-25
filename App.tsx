import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MainContent } from './components/MainContent';
import { FLIP_FLOP_DATA } from './constants';
import type { FlipFlopData } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Feedback } from './components/Feedback';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedFlipFlopId, setSelectedFlipFlopId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleHomeClick = () => {
    setSelectedFlipFlopId(null);
    setSearchTerm('');
  };

  const selectedFlipFlop = useMemo(() => {
    return FLIP_FLOP_DATA.find(ff => ff.id === selectedFlipFlopId) || null;
  }, [selectedFlipFlopId]);

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-sans">
      <Sidebar
        onSelect={setSelectedFlipFlopId}
        selectedId={selectedFlipFlopId}
        searchTerm={searchTerm}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          theme={theme}
          toggleTheme={toggleTheme}
          selectedFlipFlopName={selectedFlipFlop?.name}
          onHomeClick={handleHomeClick}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {selectedFlipFlop ? (
            <MainContent flipFlop={selectedFlipFlop} />
          ) : (
            <WelcomeScreen onSelect={setSelectedFlipFlopId} />
          )}
        </main>
        <footer className="text-center py-4 text-xs text-gray-500 dark:text-gray-400">
          © AKB AI Solutions 2025
        </footer>
      </div>
      <Feedback />
    </div>
  );
};

export default App;