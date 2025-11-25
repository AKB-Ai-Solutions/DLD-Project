import type React from 'react';

export type FlipFlopType = 'Latch' | 'Flip-Flop' | 'Counter';

export interface TableRow {
  [key: string]: string | number;
}

export interface SimulationInput {
  [key: string]: number;
}

export interface WaveformPoint {
  time: number;
  [key: string]: number;
}

export type ClockType = 'positive' | 'negative' | 'level';

export interface LogicFunctionParams {
  inputs: SimulationInput;
  state: { [key: string]: number };
}

export interface FlipFlopData {
  id: string;
  name: string;
  type: FlipFlopType;
  description: string;
  inputs: string[];
  outputs: string[];
  characteristicTable: TableRow[];
  excitationTable: TableRow[];
  characteristicEquation: string;
  symbolSvg: React.ReactNode;
  circuitSvg: React.ReactNode;
  // FIX: Changed return type to only allow number values. The 'note' property was causing type errors and was not used in the simulation.
  logicFunction: (params: LogicFunctionParams) => { [key: string]: number };
  kMapData?: string[][];
  kMapEquation?: string;
}
