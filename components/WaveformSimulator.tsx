import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { FlipFlopData, SimulationInput, WaveformPoint, ClockType } from '../types';
import { Card } from './Card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, TooltipProps } from 'recharts';
import { PlayIcon, PauseIcon, ResetIcon, PlusIcon, TrashIcon, PowerIcon, ZoomInIcon, ZoomOutIcon, ExpandIcon, ArrowLeftIcon, ArrowRightIcon } from './icons/Icons';

interface WaveformSimulatorProps {
  flipFlop: FlipFlopData;
}

const initialCycles = 8;
const signalColors = ['#38bdf8', '#fb923c', '#f87171', '#a78bfa', '#4ade80', '#fbbf24', '#e879f9', '#34d399'];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-light-card dark:bg-dark-card p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg text-sm">
        <p className="font-bold mb-1">{`Time: ${label}`}</p>
        {payload.map((pld, index) => (
          <p key={index} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};


export const WaveformSimulator: React.FC<WaveformSimulatorProps> = ({ flipFlop }) => {
  const ffInputs = useMemo(() => flipFlop.inputs.filter(i => i !== 'CLK'), [flipFlop.inputs]);
  const isLatch = flipFlop.type === 'Latch';
  
  const createInitialInputs = useCallback(() => Array(initialCycles).fill(0).map(() => 
    ffInputs.reduce((acc, input) => ({ ...acc, [input]: input.includes('PRE') || input.includes('CLR') ? 1 : 0 }), {})
  ), [ffInputs]);

  const [inputSequence, setInputSequence] = useState<SimulationInput[]>(createInitialInputs);
  const [clockType, setClockType] = useState<ClockType>(isLatch ? 'level' : 'positive');
  const [waveformData, setWaveformData] = useState<WaveformPoint[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [isClockEnabled, setIsClockEnabled] = useState(!isLatch);
  const [timeDomain, setTimeDomain] = useState<[number, number]>([0, initialCycles]);


  const handleInputChange = (cycleIndex: number, inputName: string, value: number) => {
    const newSequence = [...inputSequence];
    newSequence[cycleIndex][inputName] = value;
    setInputSequence(newSequence);
  };
  
  const addCycle = () => {
    setInputSequence(prev => [...prev, ffInputs.reduce((acc, input) => ({ ...acc, [input]: input.includes('PRE') || input.includes('CLR') ? 1 : 0 }), {})]);
  }
  
  const removeCycle = (index: number) => {
    if (inputSequence.length > 1) {
        setInputSequence(prev => prev.filter((_, i) => i !== index));
    }
  }
  
  const handleResetZoom = useCallback(() => {
    setTimeDomain([0, inputSequence.length]);
  }, [inputSequence.length]);

  const resetSimulation = useCallback(() => {
    setInputSequence(createInitialInputs());
    setIsPlaying(false);
    setIsClockEnabled(!isLatch);
    handleResetZoom();
  }, [createInitialInputs, isLatch, handleResetZoom]);

  useEffect(() => {
    resetSimulation();
    setClockType(isLatch ? 'level' : 'positive');
  }, [flipFlop, resetSimulation, isLatch]);
  
  useEffect(() => {
      handleResetZoom();
  }, [inputSequence.length, handleResetZoom]);

  const handleZoomIn = () => {
    setTimeDomain(([min, max]) => {
      const range = max - min;
      if (range <= 1) return [min, max]; // Min range is 1 cycle
      const center = (min + max) / 2;
      const newRange = Math.max(1, range / 1.5); // Decrease range
      const newMin = center - newRange / 2;
      const newMax = center + newRange / 2;
      return [newMin, newMax];
    });
  };

  const handleZoomOut = () => {
    setTimeDomain(([min, max]) => {
      const range = max - min;
      if (range >= inputSequence.length) return [0, inputSequence.length];
      const center = (min + max) / 2;
      const newRange = Math.min(inputSequence.length, range * 1.5);
      let newMin = center - newRange / 2;
      let newMax = center + newRange / 2;
      
      if (newMin < 0) {
        newMax -= newMin;
        newMin = 0;
      }
      if (newMax > inputSequence.length) {
        newMin -= (newMax - inputSequence.length);
        newMax = inputSequence.length;
      }
      
      return [Math.max(0, newMin), Math.min(inputSequence.length, newMax)];
    });
  };
  
  const handlePan = (direction: 'left' | 'right') => {
    const panAmount = (timeDomain[1] - timeDomain[0]) / 4;
    const shift = direction === 'left' ? -panAmount : panAmount;
    setTimeDomain(([min, max]) => {
        let newMin = min + shift;
        let newMax = max + shift;

        if (newMin < 0) {
            newMin = 0;
            newMax = max - min;
        }
        if (newMax > inputSequence.length) {
            newMax = inputSequence.length;
            newMin = newMax - (max - min);
            if (newMin < 0) newMin = 0;
        }
        return [newMin, newMax];
    });
  };


  useEffect(() => {
    const simulate = () => {
        let state = flipFlop.outputs.reduce((acc, output) => ({ ...acc, [output]: 0 }), {});
        const data: WaveformPoint[] = [];

        for (let i = 0; i < inputSequence.length; i++) {
            const currentInputs = inputSequence[i];
            const clock = isClockEnabled ? (i % 2) : 0;
            const prevClock = isClockEnabled ? ((i > 0 ? i : 1) - 1) % 2 : 0;

            data.push({ time: i, CLK: prevClock, ...currentInputs, ...state });

            const hasAsync = 'PRE' in currentInputs && 'CLR' in currentInputs;
            let asyncOverride = false;
            if (hasAsync) {
                const { PRE, CLR } = currentInputs;
                if (PRE === 0 && CLR === 0) {
                    state = { ...state, Q: 1, "Q'": 1 }; asyncOverride = true;
                } else if (PRE === 0) {
                    state = { ...state, Q: 1, "Q'": 0 }; asyncOverride = true;
                } else if (CLR === 0) {
                    state = { ...state, Q: 0, "Q'": 1 }; asyncOverride = true;
                }
            }
            
            if (!asyncOverride) {
                if (isLatch) {
                    const result = flipFlop.logicFunction({ inputs: currentInputs, state });
                    state = { ...state, ...result };
                } else { // Is a Flip-Flop or Counter
                    let triggered = false;
                    if (isClockEnabled) {
                        if (clockType === 'positive' && prevClock === 0 && clock === 1) triggered = true;
                        if (clockType === 'negative' && prevClock === 1 && clock === 0) triggered = true;
                    }
                    if (triggered) {
                        const result = flipFlop.logicFunction({ inputs: currentInputs, state });
                        state = { ...state, ...result };
                    }
                }
            }
            
            data.push({ time: i + 0.99, CLK: clock, ...currentInputs, ...state });
        }
        setWaveformData(data);
    };

    simulate();
  }, [inputSequence, clockType, flipFlop, isLatch, isClockEnabled]);
  
  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setInputSequence(prev => {
          const next = [...prev];
          const first = next.shift();
          if(first) next.push(first);
          return next;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const outputSignals = flipFlop.outputs;
  const allSignals = (isLatch ? [] : ['CLK']).concat(ffInputs, outputSignals);

  return (
    <Card title="Interactive Waveform Simulator">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsPlaying(!isPlaying)} className="p-2.5 rounded-full bg-gradient-to-br from-primary to-violet-600 text-white shadow-lg hover:opacity-90 transition transform hover:scale-105">
              {isPlaying ? <PauseIcon className="w-5 h-5"/> : <PlayIcon className="w-5 h-5"/>}
            </button>
            <button onClick={resetSimulation} className="p-2.5 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition transform hover:scale-105">
              <ResetIcon className="w-5 h-5"/>
            </button>
          </div>
          {!isLatch && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Clock:</label>
                <select value={clockType} onChange={(e) => setClockType(e.target.value as ClockType)} className="bg-light-card dark:bg-dark-card border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-primary outline-none">
                  <option value="positive">Positive Edge ↑</option>
                  <option value="negative">Negative Edge ↓</option>
                </select>
              </div>
               <button 
                  onClick={() => setIsClockEnabled(!isClockEnabled)}
                  className={`px-3 py-1.5 rounded-full transition flex items-center gap-2 text-sm font-semibold ${
                    isClockEnabled ? 'bg-secondary text-white' : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  <PowerIcon className="w-5 h-5"/>
                  <span>{isClockEnabled ? 'On' : 'Off'}</span>
                </button>
            </div>
          )}
          <div className="flex items-center gap-2">
             <label className="text-sm font-medium">Speed:</label>
             <input type="range" min="100" max="2000" step="100" value={2100 - speed} onChange={e => setSpeed(2100 - Number(e.target.value))} className="w-24 accent-primary"/>
          </div>
          <div className="flex items-center gap-2 border-t pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-4 border-gray-300 dark:border-gray-600">
            <label className="text-sm font-medium">View:</label>
            <button onClick={() => handlePan('left')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Pan left"><ArrowLeftIcon className="w-5 h-5"/></button>
            <button onClick={handleZoomOut} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Zoom out"><ZoomOutIcon className="w-5 h-5"/></button>
            <button onClick={handleResetZoom} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Reset zoom"><ExpandIcon className="w-5 h-5"/></button>
            <button onClick={handleZoomIn} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Zoom in"><ZoomInIcon className="w-5 h-5"/></button>
            <button onClick={() => handlePan('right')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Pan right"><ArrowRightIcon className="w-5 h-5"/></button>
          </div>
        </div>

        {/* Waveform Chart */}
        <div className="w-full h-96">
            <ResponsiveContainer>
                <LineChart data={waveformData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis 
                        dataKey="time" 
                        type="number" 
                        domain={timeDomain} 
                        allowDataOverflow 
                        tickCount={Math.min(20, Math.round(timeDomain[1] - timeDomain[0]) + 1)}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis width={40} tick={false} domain={[-0.2, allSignals.length - 0.8]} ticks={allSignals.map((_, i) => allSignals.length - 1 - i)}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{fontSize: "14px"}} />
                    {allSignals.map((signal, index) => (
                        <Line 
                            key={signal}
                            type="stepAfter"
                            dataKey={signal}
                            stroke={signalColors[index % signalColors.length]}
                            strokeWidth={2.5}
                            dot={false}
                            y={allSignals.length - 1 - index}
                            name={signal}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>

        {/* Input Editor */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border border-gray-300 dark:border-gray-600 font-semibold w-24 bg-gray-50 dark:bg-gray-800">Cycle</th>
                {inputSequence.map((_, index) => (
                  <th key={index} className="p-2 border border-gray-300 dark:border-gray-600 font-mono text-center min-w-[50px] bg-gray-50 dark:bg-gray-800">{index}</th>
                ))}
                <th className="p-2 border border-gray-300 dark:border-gray-600 w-12 bg-gray-50 dark:bg-gray-800"></th>
              </tr>
            </thead>
            <tbody>
              {ffInputs.map(input => (
                <tr key={input}>
                  <td className="p-2 border border-gray-300 dark:border-gray-600 font-semibold bg-gray-50 dark:bg-gray-800">{input}</td>
                  {inputSequence.map((cycle, index) => (
                    <td key={index} className="p-2 border border-gray-300 dark:border-gray-600 text-center">
                      <button 
                        className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700 font-mono text-lg transition-transform transform hover:scale-110"
                        onClick={() => handleInputChange(index, input, cycle[input] === 0 ? 1 : 0)}
                      >
                        {cycle[input]}
                      </button>
                    </td>
                  ))}
                  <td className="p-2 border border-gray-300 dark:border-gray-600"></td>
                </tr>
              ))}
              {ffInputs.length > 0 && (
                <tr>
                  <td className="p-2 border border-gray-300 dark:border-gray-600 font-semibold bg-gray-50 dark:bg-gray-800">Actions</td>
                  {inputSequence.map((_, index) => (
                      <td key={index} className="p-2 border border-gray-300 dark:border-gray-600 text-center">
                          <button onClick={() => removeCycle(index)} className="text-red-500 hover:text-red-700 disabled:opacity-50 transition transform hover:scale-110" disabled={inputSequence.length <= 1}>
                              <TrashIcon className="w-5 h-5 mx-auto"/>
                          </button>
                      </td>
                  ))}
                  <td className="p-2 border border-gray-300 dark:border-gray-600 text-center">
                      <button onClick={addCycle} className="text-green-500 hover:text-green-700 transition transform hover:scale-110">
                          <PlusIcon className="w-5 h-5 mx-auto" />
                      </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};