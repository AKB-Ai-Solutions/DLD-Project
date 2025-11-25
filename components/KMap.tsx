
import React from 'react';

interface KMapProps {
  data: string[][];
  equation: string;
  inputs: string[];
}

export const KMap: React.FC<KMapProps> = ({ data, equation, inputs }) => {
    // Basic K-Map for up to 3 variables (D, T, or J,K,Q)
    const isTwoVar = inputs.length <= 1 || (inputs.length === 2 && inputs.includes('Q'));
    const isThreeVar = inputs.length === 2 && !inputs.includes('Q');

    const renderTwoVarMap = () => (
        <div>
            <div className="flex">
                <div className="w-10 h-10 flex items-center justify-center"></div>
                <div className="w-10 h-10 flex items-center justify-center font-mono">0</div>
                <div className="w-10 h-10 flex items-center justify-center font-mono">1</div>
            </div>
            <div className="flex">
                <div className="w-10 h-10 flex items-center justify-center font-mono">{inputs[0]}</div>
                <div className="w-10 h-10 flex items-center justify-center border border-gray-400 font-mono">{data[0][0]}</div>
                <div className="w-10 h-10 flex items-center justify-center border border-gray-400 font-mono">{data[0][1]}</div>
            </div>
        </div>
    );
    
    // This is a simplified representation for demonstration. A full K-map solver is complex.
    const renderThreeVarMap = () => (
      <div>
        <div className="flex">
            <div className="w-10 h-10"></div>
            <div className="w-20 h-10 text-center font-mono">{inputs[0]}{inputs[1]}</div>
        </div>
        <div className="flex">
            <div className="w-10 h-10 flex items-center justify-center font-mono text-xs transform -rotate-90">Q</div>
            <div className="flex flex-col">
                <div className="flex">
                    <div className="w-10 h-10 flex items-center justify-center font-mono">00</div>
                    <div className="w-10 h-10 flex items-center justify-center font-mono">01</div>
                    <div className="w-10 h-10 flex items-center justify-center font-mono">11</div>
                    <div className="w-10 h-10 flex items-center justify-center font-mono">10</div>
                </div>
                 <div className="flex">
                    <div className="w-10 h-10 flex items-center justify-center border border-gray-400 font-mono bg-primary/10">{data[0][0]}</div>
                    <div className="w-10 h-10 flex items-center justify-center border border-gray-400 font-mono bg-secondary/10">{data[0][1]}</div>
                    <div className="w-10 h-10 flex items-center justify-center border border-gray-400 font-mono bg-secondary/10">{data[0][2]}</div>
                    <div className="w-10 h-10 flex items-center justify-center border border-gray-400 font-mono">{data[0][3]}</div>
                </div>
                 <div className="flex">
                    <div className="w-10 h-10 flex items-center justify-center border border-gray-400 font-mono">{data[3][0]}</div>
                    <div className="w-10 h-10 flex items-center justify-center border border-gray-400 font-mono">{data[3][1]}</div>
                    <div className="w-10 h-10 flex items-center justify-center border border-gray-400 font-mono bg-primary/10">{data[3][2]}</div>
                    <div className="w-10 h-10 flex items-center justify-center border border-gray-400 font-mono">{data[3][3]}</div>
                </div>
            </div>
        </div>
      </div>
    )

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <div>
        {isTwoVar ? renderTwoVarMap() : renderThreeVarMap()}
      </div>
      <div className="text-center sm:text-left">
        <p className="text-gray-500 dark:text-gray-400">Simplified Boolean Expression:</p>
        <code className="text-lg font-bold font-mono text-primary">{equation}</code>
        <p className="text-xs text-gray-500 mt-2">(Groupings are highlighted for clarity)</p>
      </div>
    </div>
  );
};
