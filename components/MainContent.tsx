import React from 'react';
import type { FlipFlopData } from '../types';
import { Card } from './Card';
import { TableCard } from './TableCard';
import { KMap } from './KMap';
import { WaveformSimulator } from './WaveformSimulator';

interface MainContentProps {
  flipFlop: FlipFlopData;
}

const AnimatedDiv: React.FC<{ children: React.ReactNode, delay: number, className?: string }> = ({ children, delay, className }) => (
    <div 
        className={`animate-slide-up-fade ${className}`}
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
        {children}
    </div>
);

export const MainContent: React.FC<MainContentProps> = ({ flipFlop }) => {
  return (
    <div className="space-y-8">
      <AnimatedDiv delay={100}>
        <Card title="Description">
          <p className="text-gray-600 dark:text-gray-300">{flipFlop.description}</p>
          <div className="mt-4">
              <span className="font-semibold">Characteristic Equation: </span>
              <code className="bg-gray-200 dark:bg-gray-700 rounded px-2 py-1 text-sm font-mono">{flipFlop.characteristicEquation}</code>
          </div>
        </Card>
      </AnimatedDiv>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatedDiv delay={200}><Card title="Symbol">{flipFlop.symbolSvg}</Card></AnimatedDiv>
        <AnimatedDiv delay={250}><Card title="Internal Circuit (Conceptual)">{flipFlop.circuitSvg}</Card></AnimatedDiv>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <AnimatedDiv delay={300}><TableCard title="Characteristic Table" data={flipFlop.characteristicTable} /></AnimatedDiv>
         <AnimatedDiv delay={350}><TableCard title="Excitation Table" data={flipFlop.excitationTable} /></AnimatedDiv>
      </div>

       {flipFlop.kMapData && flipFlop.kMapEquation && (
         <AnimatedDiv delay={400}>
            <Card title="Karnaugh Map (for Q+)">
                <KMap data={flipFlop.kMapData} equation={flipFlop.kMapEquation} inputs={flipFlop.inputs.filter(i => i !== 'CLK')} />
            </Card>
         </AnimatedDiv>
        )}
      
      <AnimatedDiv delay={450}>
        <WaveformSimulator flipFlop={flipFlop} />
      </AnimatedDiv>

    </div>
  );
};