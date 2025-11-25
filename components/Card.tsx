import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-light-card dark:bg-dark-card rounded-xl shadow-lg overflow-hidden border border-black/5 dark:border-white/10 ${className}`}>
      <div className="p-4 sm:p-6 border-b border-black/5 dark:border-white/10">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};