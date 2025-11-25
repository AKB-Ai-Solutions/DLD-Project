
import React from 'react';
import { FLIP_FLOP_DATA } from '../constants';
import { ChipIcon, ChevronRightIcon } from './icons/Icons';

interface WelcomeScreenProps {
  onSelect: (id: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
      <ChipIcon className="w-24 h-24 text-primary mb-6" />
      <h1 className="text-4xl font-bold mb-2">Welcome to the Digital Logic Simulator</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-12">
        Select a latch or flip-flop from the sidebar to begin. You can explore definitions, diagrams, truth tables, and run interactive waveform simulations.
      </p>
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
        <div className="space-y-3">
          {FLIP_FLOP_DATA.slice(0, 4).map((ff) => (
            <button
              key={ff.id}
              onClick={() => onSelect(ff.id)}
              className="w-full flex items-center justify-between bg-light-card dark:bg-dark-card p-4 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-4 ${ff.type === 'Latch' ? 'bg-secondary' : 'bg-primary'}`}></div>
                <span className="font-medium">{ff.name}</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
