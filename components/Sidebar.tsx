import React, { useMemo, useState } from 'react';
import { FLIP_FLOP_DATA } from '../constants';
import type { FlipFlopData } from '../types';
import { ChipIcon, MenuIcon } from './icons/Icons';

interface SidebarProps {
  onSelect: (id: string) => void;
  selectedId: string | null;
  searchTerm: string;
}

const SidebarItem: React.FC<{ item: FlipFlopData; onSelect: (id: string) => void; isSelected: boolean }> = ({ item, onSelect, isSelected }) => (
  <li>
    <button
      onClick={() => onSelect(item.id)}
      className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center transition-all duration-200 group relative ${
        isSelected
          ? 'bg-primary/10 text-primary dark:text-white font-semibold'
          : 'hover:bg-gray-200 dark:hover:bg-gray-700 hover:translate-x-1'
      }`}
    >
        {isSelected && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full"></div>}
      <ChipIcon className={`w-4 h-4 mr-3 transition-colors ${isSelected ? 'text-primary dark:text-white' : 'text-gray-500'}`} />
      {item.name}
    </button>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ onSelect, selectedId, searchTerm }) => {
  const [isOpen, setIsOpen] = useState(false);

  const filteredData = useMemo(() => {
    return FLIP_FLOP_DATA.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const latches = filteredData.filter(item => item.type === 'Latch');
  const counters = filteredData.filter(item => item.type === 'Counter');
  const flipFlops = filteredData.filter(item => item.type === 'Flip-Flop');

  const content = (
      <aside className="w-64 h-full flex-shrink-0 bg-light-card dark:bg-dark-card p-4 flex flex-col border-r border-gray-200/50 dark:border-gray-700/50">
        <div className="text-2xl font-bold text-primary mb-6 flex items-center">
            <ChipIcon className="w-8 h-8 mr-2" />
            <span>LogicSim</span>
        </div>
        <nav className="flex-1 overflow-y-auto -mr-2 pr-2">
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-2 px-3">Latches</h3>
          <ul className="space-y-1 mb-6">
            {latches.map(item => (
              <SidebarItem key={item.id} item={item} onSelect={onSelect} isSelected={item.id === selectedId} />
            ))}
          </ul>
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-2 px-3">Flip-Flops</h3>
          <ul className="space-y-1 mb-6">
            {flipFlops.map(item => (
              <SidebarItem key={item.id} item={item} onSelect={onSelect} isSelected={item.id === selectedId} />
            ))}
          </ul>
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-2 px-3">Counters</h3>
          <ul className="space-y-1">
            {counters.map(item => (
              <SidebarItem key={item.id} item={item} onSelect={onSelect} isSelected={item.id === selectedId} />
            ))}
          </ul>
        </nav>
      </aside>
  );


  return (
    <>
        <div className="hidden lg:block">{content}</div>

        <div className="lg:hidden absolute top-4 left-4 z-20">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md bg-light-card dark:bg-dark-card shadow-md">
                <MenuIcon className="w-6 h-6" />
            </button>
        </div>

        {isOpen && (
            <div className="lg:hidden fixed inset-0 z-10" onClick={() => setIsOpen(false)}>
                 <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                 <div className="relative h-full" onClick={(e) => e.stopPropagation()}>
                    {content}
                 </div>
            </div>
        )}
    </>
  );
};