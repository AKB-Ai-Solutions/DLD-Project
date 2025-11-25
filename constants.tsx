import React from 'react';
import type { FlipFlopData } from './types';

// Helper for SVGs
const SvgWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 200 150" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">{children}</svg>
);
const DiagramText: React.FC<{ x: number, y: number, children: React.ReactNode, className?: string }> = ({ x, y, children, className }) => (
  <text x={x} y={y} fontSize="10" className={`fill-current ${className}`} textAnchor="middle" dominantBaseline="middle">{children}</text>
);

export const FLIP_FLOP_DATA: FlipFlopData[] = [
  {
    id: 'sr-latch',
    name: 'SR Latch (NOR)',
    type: 'Latch',
    description: 'The SR Latch is a simple bistable multivibrator. It has two inputs, S (Set) and R (Reset), and two outputs, Q and Q\'. The state Q=1, Q\'=0 is the "Set" state, while Q=0, Q\'=1 is the "Reset" state. An invalid state occurs when both S and R are high.',
    inputs: ['S', 'R'],
    outputs: ['Q', "Q'"],
    characteristicTable: [
      { S: 0, R: 0, Q: 'Q (No Change)', "Q'": "Q' (No Change)" },
      { S: 0, R: 1, Q: 0, "Q'": 1 },
      { S: 1, R: 0, Q: 1, "Q'": 0 },
      { S: 1, R: 1, Q: 0, "Q'": 0, Note: 'Invalid State' },
    ],
    excitationTable: [
        { Q: 0, 'Q+1': 0, S: 0, R: 'X' },
        { Q: 0, 'Q+1': 1, S: 1, R: 0 },
        { Q: 1, 'Q+1': 0, S: 0, R: 1 },
        { Q: 1, 'Q+1': 1, S: 'X', R: 0 },
    ],
    characteristicEquation: "Q+ = S + R'Q (when SR=0)",
    // FIX: Removed 'note' property from return value to match the updated type definition which only allows numbers.
    logicFunction: ({ inputs, state }) => {
        const { S, R } = inputs;
        const { Q: q = 0 } = state;
        if (S === 1 && R === 1) return { Q: 0, "Q'": 0 };
        if (S === 1) return { Q: 1, "Q'": 0 };
        if (R === 1) return { Q: 0, "Q'": 1 };
        return { Q: q, "Q'": q === 1 ? 0 : 1 }; // No change
    },
    symbolSvg: (
      <SvgWrapper>
        <rect x="50" y="30" width="100" height="90" className="stroke-current fill-transparent" strokeWidth="2" />
        <DiagramText x={100} y={45}>SR Latch</DiagramText>
        <line x1="20" y1="55" x2="50" y2="55" className="stroke-current" strokeWidth="2" />
        <DiagramText x={35} y={50}>S</DiagramText>
        <line x1="20" y1="95" x2="50" y2="95" className="stroke-current" strokeWidth="2" />
        <DiagramText x={35} y={90}>R</DiagramText>
        <line x1="150" y1="55" x2="180" y2="55" className="stroke-current" strokeWidth="2" />
        <DiagramText x={165} y={50}>Q</DiagramText>
        <line x1="150" y1="95" x2="180" y2="95" className="stroke-current" strokeWidth="2" />
        <DiagramText x={165} y={90}>Q'</DiagramText>
      </SvgWrapper>
    ),
    circuitSvg: (
      <svg viewBox="0 0 250 150" className="w-full h-auto">
        {/* NOR gates */}
        <path d="M100 40 C 120 40, 120 60, 100 60 L 80 60 L 80 40 Z" className="stroke-current fill-transparent" strokeWidth="1"/>
        <circle cx="125" cy="50" r="3" className="stroke-current fill-current"/>
        <path d="M100 90 C 120 90, 120 110, 100 110 L 80 110 L 80 90 Z" className="stroke-current fill-transparent" strokeWidth="1"/>
        <circle cx="125" cy="100" r="3" className="stroke-current fill-current"/>
        {/* Inputs */}
        <line x1="20" y1="40" x2="80" y2="40" className="stroke-current" strokeWidth="1"/>
        <text x="40" y="35" fontSize="10" className="fill-current">R</text>
        <line x1="20" y1="110" x2="80" y2="110" className="stroke-current" strokeWidth="1"/>
        <text x="40" y="120" fontSize="10" className="fill-current">S</text>
        {/* Outputs */}
        <line x1="128" y1="50" x2="180" y2="50" className="stroke-current" strokeWidth="1"/>
        <text x="160" y="45" fontSize="10" className="fill-current">Q</text>
        <line x1="128" y1="100" x2="180" y2="100" className="stroke-current" strokeWidth="1"/>
        <text x="160" y="105" fontSize="10" className="fill-current">Q'</text>
        {/* Feedback paths */}
        <line x1="140" y1="50" x2="140" y2="90" className="stroke-current" strokeWidth="1" />
        <line x1="140" y1="90" x2="80" y2="90" className="stroke-current" strokeWidth="1" />
        <line x1="140" y1="100" x2="140" y2="60" className="stroke-current" strokeWidth="1" />
        <line x1="140" y1="60" x2="80" y2="60" className="stroke-current" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 'd-flip-flop-pe',
    name: 'D Flip-Flop (Positive Edge)',
    type: 'Flip-Flop',
    description: 'The D Flip-Flop captures the value of the D input at a definite portion of the clock cycle (such as the rising edge). That captured value becomes the Q output. At other times, the output Q does not change.',
    inputs: ['D', 'CLK'],
    outputs: ['Q', "Q'"],
    characteristicTable: [
      { CLK: '↑', D: 0, 'Q+1': 0, "Q'+1": 1, Note: 'Reset' },
      { CLK: '↑', D: 1, 'Q+1': 1, "Q'+1": 0, Note: 'Set' },
      { CLK: 'not ↑', D: 'X', 'Q+1': 'Q', "Q'+1": "Q'", Note: 'No Change' },
    ],
    excitationTable: [
        { Q: 0, 'Q+1': 0, D: 0 },
        { Q: 0, 'Q+1': 1, D: 1 },
        { Q: 1, 'Q+1': 0, D: 0 },
        { Q: 1, 'Q+1': 1, D: 1 },
    ],
    characteristicEquation: 'Q+ = D',
    logicFunction: ({ inputs }) => {
        const { D } = inputs;
        return { Q: D, "Q'": D === 1 ? 0 : 1 };
    },
    symbolSvg: (
      <SvgWrapper>
        <rect x="50" y="30" width="100" height="90" className="stroke-current fill-transparent" strokeWidth="2" />
        <DiagramText x={100} y={45}>D FF</DiagramText>
        <line x1="20" y1="75" x2="50" y2="75" className="stroke-current" strokeWidth="2" />
        <DiagramText x={35} y="70">D</DiagramText>
        <line x1="50" y1="105" x2="70" y2="105" className="stroke-current" strokeWidth="2" />
        <polygon points="50,100 60,105 50,110" className="fill-current stroke-current" />
        <DiagramText x={80} y={100}>CLK</DiagramText>
        <line x1="150" y1="55" x2="180" y2="55" className="stroke-current" strokeWidth="2" />
        <DiagramText x={165} y={50}>Q</DiagramText>
        <line x1="150" y1="95" x2="180" y2="95" className="stroke-current" strokeWidth="2" />
        <DiagramText x={165} y={90}>Q'</DiagramText>
      </SvgWrapper>
    ),
    circuitSvg: (
       <svg viewBox="0 0 300 150" className="w-full h-auto">
        <text x="150" y="75" textAnchor="middle" className="fill-current text-sm">Complex: Often built with gated latches. Showing symbol is more standard.</text>
      </svg>
    ),
    kMapData: [['0', '1']],
    kMapEquation: 'Q+ = D',
  },
  {
    id: 'jk-flip-flop-pe',
    name: 'JK Flip-Flop (Positive Edge)',
    type: 'Flip-Flop',
    description: 'The JK flip-flop is a universal flip-flop, meaning it can be configured to work as an SR flip-flop, a D flip-flop, or a T flip-flop. It augments the SR flip-flop by interpreting the S=1, R=1 condition as a "flip" or "toggle" command.',
    inputs: ['J', 'K', 'CLK'],
    outputs: ['Q', "Q'"],
    characteristicTable: [
      { CLK: '↑', J: 0, K: 0, 'Q+1': 'Q', Note: 'No Change' },
      { CLK: '↑', J: 0, K: 1, 'Q+1': 0, Note: 'Reset' },
      { CLK: '↑', J: 1, K: 0, 'Q+1': 1, Note: 'Set' },
      { CLK: '↑', J: 1, K: 1, 'Q+1': "Q'", Note: 'Toggle' },
    ],
    excitationTable: [
        { Q: 0, 'Q+1': 0, J: 0, K: 'X' },
        { Q: 0, 'Q+1': 1, J: 1, K: 'X' },
        { Q: 1, 'Q+1': 0, J: 'X', K: 1 },
        { Q: 1, 'Q+1': 1, J: 'X', K: 0 },
    ],
    characteristicEquation: "Q+ = JQ' + K'Q",
    logicFunction: ({ inputs, state }) => {
        const { J, K } = inputs;
        const { Q: q = 0 } = state;
        if (J === 0 && K === 0) return { Q: q, "Q'": q === 1 ? 0 : 1 }; // No change
        if (J === 0 && K === 1) return { Q: 0, "Q'": 1 }; // Reset
        if (J === 1 && K === 0) return { Q: 1, "Q'": 0 }; // Set
        if (J === 1 && K === 1) return { Q: q === 1 ? 0 : 1, "Q'": q }; // Toggle
        return { Q: q, "Q'": q === 1 ? 0 : 1 };
    },
    symbolSvg: (
      <SvgWrapper>
        <rect x="50" y="30" width="100" height="90" className="stroke-current fill-transparent" strokeWidth="2" />
        <DiagramText x={100} y={45}>JK FF</DiagramText>
        <line x1="20" y1="55" x2="50" y2="55" className="stroke-current" strokeWidth="2" />
        <DiagramText x={35} y={50}>J</DiagramText>
        <line x1="20" y1="95" x2="50" y2="95" className="stroke-current" strokeWidth="2" />
        <DiagramText x={35} y={90}>K</DiagramText>
        <line x1="50" y1="105" x2="70" y2="105" className="stroke-current" strokeWidth="2" />
        <polygon points="50,100 60,105 50,110" className="fill-current stroke-current" />
        <DiagramText x={80} y={100}>CLK</DiagramText>
        <line x1="150" y1="55" x2="180" y2="55" className="stroke-current" strokeWidth="2" />
        <DiagramText x={165} y={50}>Q</DiagramText>
        <line x1="150" y1="95" x2="180" y2="95" className="stroke-current" strokeWidth="2" />
        <DiagramText x={165} y={90}>Q'</DiagramText>
      </SvgWrapper>
    ),
    circuitSvg: (
       <svg viewBox="0 0 300 150" className="w-full h-auto">
        <text x="150" y="75" textAnchor="middle" className="fill-current text-sm">Complex: Often built with gated latches. Showing symbol is more standard.</text>
      </svg>
    ),
    kMapData: [
        ['0', '1', '1', '0'],
        ['0', 'X', 'X', '1'],
        ['1', 'X', 'X', '0'],
        ['1', '0', '0', '1'],
    ],
    kMapEquation: "Q+ = JQ' + K'Q",
  },
  {
    id: 'jk-flip-flop-async',
    name: 'JK Flip-Flop (Async PRE/CLR)',
    // FIX: Corrected typo from 'Flip-Hop' to 'Flip-Flop'.
    type: 'Flip-Flop',
    description: 'A JK flip-flop with asynchronous, active-low Preset (PRE) and Clear (CLR) inputs. PRE sets Q to 1, and CLR resets Q to 0, overriding any clock or J/K inputs. Normal clocked operation occurs only when both PRE and CLR are high (inactive).',
    inputs: ['J', 'K', 'CLK', 'PRE', 'CLR'],
    outputs: ['Q', "Q'"],
    characteristicTable: [
      { PRE: 0, CLR: 1, CLK: 'X', J: 'X', K: 'X', 'Q+1': 1, Note: 'Async Set (Preset)' },
      { PRE: 1, CLR: 0, CLK: 'X', J: 'X', K: 'X', 'Q+1': 0, Note: 'Async Reset (Clear)' },
      { PRE: 0, CLR: 0, CLK: 'X', J: 'X', K: 'X', 'Q+1': '?', Note: 'Invalid State' },
      { PRE: 1, CLR: 1, CLK: '↑', J: 0, K: 0, 'Q+1': 'Q', Note: 'No Change' },
      { PRE: 1, CLR: 1, CLK: '↑', J: 0, K: 1, 'Q+1': 0, Note: 'Reset' },
      { PRE: 1, CLR: 1, CLK: '↑', J: 1, K: 0, 'Q+1': 1, Note: 'Set' },
      { PRE: 1, CLR: 1, CLK: '↑', J: 1, K: 1, 'Q+1': "Q'", Note: 'Toggle' },
    ],
    excitationTable: [
        { Q: 0, 'Q+1': 0, J: 0, K: 'X' },
        { Q: 0, 'Q+1': 1, J: 1, K: 'X' },
        { Q: 1, 'Q+1': 0, J: 'X', K: 1 },
        { Q: 1, 'Q+1': 1, J: 'X', K: 0 },
    ],
    characteristicEquation: "Q+ = JQ' + K'Q (when PRE=1, CLR=1)",
    logicFunction: ({ inputs, state }) => {
        const { J, K } = inputs;
        const { Q: q = 0 } = state;
        if (J === 0 && K === 0) return { Q: q, "Q'": q === 1 ? 0 : 1 };
        if (J === 0 && K === 1) return { Q: 0, "Q'": 1 };
        if (J === 1 && K === 0) return { Q: 1, "Q'": 0 };
        if (J === 1 && K === 1) return { Q: q === 1 ? 0 : 1, "Q'": q };
        return { Q: q, "Q'": q === 1 ? 0 : 1 };
    },
    symbolSvg: (
      <SvgWrapper>
        <rect x="50" y="30" width="100" height="90" className="stroke-current fill-transparent" strokeWidth="2" />
        <DiagramText x={100} y={45}>JK FF</DiagramText>
        <line x1="100" y1="5" x2="100" y2="30" className="stroke-current" strokeWidth="2" />
        <DiagramText x={90} y={15}>PRE</DiagramText>
        <circle cx="100" cy="27" r="3" className="stroke-current fill-light-card dark:fill-dark-card" strokeWidth="1.5" />
        <line x1="100" y1="145" x2="100" y2="120" className="stroke-current" strokeWidth="2" />
        <DiagramText x={90} y={135}>CLR</DiagramText>
        <circle cx="100" cy="123" r="3" className="stroke-current fill-light-card dark:fill-dark-card" strokeWidth="1.5" />
        <line x1="20" y1="55" x2="50" y2="55" className="stroke-current" strokeWidth="2" />
        <DiagramText x={35} y={50}>J</DiagramText>
        <line x1="50" y1="75" x2="70" y2="75" className="stroke-current" strokeWidth="2" />
        <polygon points="50,70 60,75 50,80" className="fill-current stroke-current" />
        <DiagramText x={35} y={75}>CLK</DiagramText>
        <line x1="20" y1="95" x2="50" y2="95" className="stroke-current" strokeWidth="2" />
        <DiagramText x={35} y={90}>K</DiagramText>
        <line x1="150" y1="55" x2="180" y2="55" className="stroke-current" strokeWidth="2" />
        <DiagramText x={165} y={50}>Q</DiagramText>
        <line x1="150" y1="95" x2="180" y2="95" className="stroke-current" strokeWidth="2" />
        <DiagramText x={165} y={90}>Q'</DiagramText>
      </SvgWrapper>
    ),
    circuitSvg: (
       <svg viewBox="0 0 300 150" className="w-full h-auto">
        <text x="150" y="75" textAnchor="middle" className="fill-current text-sm">Complex: Often built with NAND gates. Showing symbol is more standard.</text>
      </svg>
    ),
    kMapData: [
        ['0', '1', '1', '0'],
        ['0', 'X', 'X', '1'],
        ['1', 'X', 'X', '0'],
        ['1', '0', '0', '1'],
    ],
    kMapEquation: "Q+ = JQ' + K'Q",
  },
   {
    id: 't-flip-flop-pe',
    name: 'T Flip-Flop (Positive Edge)',
    type: 'Flip-Flop',
    description: 'The T or "Toggle" Flip-Flop changes its output on each clock edge if the T input is high. If T is low, the output holds its value. It is useful for counters and frequency division.',
    inputs: ['T', 'CLK'],
    outputs: ['Q', "Q'"],
    characteristicTable: [
      { CLK: '↑', T: 0, 'Q+1': 'Q', Note: 'No Change' },
      { CLK: '↑', T: 1, 'Q+1': "Q'", Note: 'Toggle' },
    ],
    excitationTable: [
        { Q: 0, 'Q+1': 0, T: 0 },
        { Q: 0, 'Q+1': 1, T: 1 },
        { Q: 1, 'Q+1': 0, T: 1 },
        { Q: 1, 'Q+1': 1, T: 0 },
    ],
    characteristicEquation: "Q+ = T ⊕ Q = TQ' + T'Q",
    logicFunction: ({ inputs, state }) => {
        const { T } = inputs;
        const { Q: q = 0 } = state;
        if (T === 1) {
            return { Q: q === 1 ? 0 : 1, "Q'": q }; // Toggle
        }
        return { Q: q, "Q'": q === 1 ? 0 : 1 }; // No change
    },
    symbolSvg: (
      <SvgWrapper>
        <rect x="50" y="30" width="100" height="90" className="stroke-current fill-transparent" strokeWidth="2" />
        <DiagramText x={100} y={45}>T FF</DiagramText>
        <line x1="20" y1="75" x2="50" y2="75" className="stroke-current" strokeWidth="2" />
        <DiagramText x={35} y="70">T</DiagramText>
        <line x1="50" y1="105" x2="70" y2="105" className="stroke-current" strokeWidth="2" />
        <polygon points="50,100 60,105 50,110" className="fill-current stroke-current" />
        <DiagramText x={80} y={100}>CLK</DiagramText>
        <line x1="150" y1="55" x2="180" y2="55" className="stroke-current" strokeWidth="2" />
        <DiagramText x={165} y={50}>Q</DiagramText>
        <line x1="150" y1="95" x2="180" y2="95" className="stroke-current" strokeWidth="2" />
        <DiagramText x={165} y={90}>Q'</DiagramText>
      </SvgWrapper>
    ),
    circuitSvg: (
      <svg viewBox="0 0 300 150" className="w-full h-auto">
        <text x="150" y="75" textAnchor="middle" className="fill-current text-sm">Often made from a JK-FF by tying J and K together to form T.</text>
      </svg>
    ),
    kMapData: [['0', '1'], ['1', '0']],
    kMapEquation: "Q+ = T ⊕ Q",
  },
  {
    id: 'up-counter-jk',
    name: '3-Bit Async Up Counter',
    type: 'Counter',
    description: 'A 3-bit asynchronous (ripple) up counter built using negative-edge-triggered JK flip-flops. Each flip-flop is in toggle mode (J=K=1). The output of each flip-flop (Q) clocks the next one, creating a ripple effect. The counter cycles through binary values from 0 (000) to 7 (111).',
    inputs: ['CLK'],
    outputs: ['Q2', 'Q1', 'Q0'],
    characteristicTable: [ // Using this table to show state transitions
        { 'Current State (Q2 Q1 Q0)': '000', 'Next State': '001' },
        { 'Current State (Q2 Q1 Q0)': '001', 'Next State': '010' },
        { 'Current State (Q2 Q1 Q0)': '010', 'Next State': '011' },
        { 'Current State (Q2 Q1 Q0)': '011', 'Next State': '100' },
        { 'Current State (Q2 Q1 Q0)': '100', 'Next State': '101' },
        { 'Current State (Q2 Q1 Q0)': '101', 'Next State': '110' },
        { 'Current State (Q2 Q1 Q0)': '110', 'Next State': '111' },
        { 'Current State (Q2 Q1 Q0)': '111', 'Next State': '000' },
    ],
    excitationTable: [],
    characteristicEquation: "Counts up on each clock cycle.",
    logicFunction: ({ state }) => {
        const { Q0 = 0, Q1 = 0, Q2 = 0 } = state;
        let count = (Q2 << 2) | (Q1 << 1) | Q0;
        count = (count + 1) % 8;
        return {
            Q2: (count >> 2) & 1,
            Q1: (count >> 1) & 1,
            Q0: count & 1,
        };
    },
    symbolSvg: (
      <svg viewBox="0 0 220 120" className="w-full h-auto">
        <rect x="10" y="20" width="200" height="80" className="stroke-current fill-transparent" strokeWidth="2" />
        <DiagramText x={110} y={35}>3-Bit Up Counter</DiagramText>
        <line x1="10" y1="70" x2="30" y2="70" className="stroke-current" strokeWidth="2" />
        <polygon points="10,65 20,70 10,75" className="fill-current stroke-current" />
        <DiagramText x={40} y={65}>CLK</DiagramText>
        <line x1="210" y1="45" x2="230" y2="45" className="stroke-current" strokeWidth="2" />
        <DiagramText x={220} y={40}>Q2</DiagramText>
        <line x1="210" y1="65" x2="230" y2="65" className="stroke-current" strokeWidth="2" />
        <DiagramText x={220} y={60}>Q1</DiagramText>
        <line x1="210" y1="85" x2="230" y2="85" className="stroke-current" strokeWidth="2" />
        <DiagramText x={220} y={80}>Q0</DiagramText>
      </svg>
    ),
    circuitSvg: (
      <svg viewBox="-10 0 300 130" className="w-full h-auto">
        <DiagramText x={140} y={10}>Circuit: 3-Bit Asynchronous Up Counter</DiagramText>
        {/* JK FF 0 */}
        <rect x="20" y="30" width="70" height="70" className="stroke-current fill-transparent" strokeWidth="1"/>
        <DiagramText x={55} y={40}>FF0</DiagramText>
        <DiagramText x={15} y={50}>J</DiagramText><DiagramText x={15} y={80}>K</DiagramText>
        <polygon points="20,62 30,65 20,68" className="fill-current stroke-current"/><circle cx="30" cy="65" r="2" className="stroke-current fill-light-card dark:fill-dark-card" strokeWidth="1"/>
        <DiagramText x={95} y={50}>Q0</DiagramText>
        {/* JK FF 1 */}
        <rect x="110" y="30" width="70" height="70" className="stroke-current fill-transparent" strokeWidth="1"/>
        <DiagramText x={145} y={40}>FF1</DiagramText>
        <DiagramText x={105} y={50}>J</DiagramText><DiagramText x={105} y={80}>K</DiagramText>
        <polygon points="110,62 120,65 110,68" className="fill-current stroke-current"/><circle cx="120" cy="65" r="2" className="stroke-current fill-light-card dark:fill-dark-card" strokeWidth="1"/>
        <DiagramText x={185} y={50}>Q1</DiagramText>
        {/* JK FF 2 */}
        <rect x="200" y="30" width="70" height="70" className="stroke-current fill-transparent" strokeWidth="1"/>
        <DiagramText x={235} y={40}>FF2</DiagramText>
        <DiagramText x={195} y={50}>J</DiagramText><DiagramText x={195} y={80}>K</DiagramText>
        <polygon points="200,62 210,65 200,68" className="fill-current stroke-current"/><circle cx="210" cy="65" r="2" className="stroke-current fill-light-card dark:fill-dark-card" strokeWidth="1"/>
        <DiagramText x={275} y={50}>Q2</DiagramText>
        {/* J=K=1 Lines */}
        <line x1="0" y1="110" x2="200" y2="110" className="stroke-current" strokeWidth="1" />
        <DiagramText x="-5" y={110}>1</DiagramText>
        <line x1="20" y1="50" x2="15" y2="50" /><line x1="15" y1="50" x2="15" y2="110" /><line x1="15" y1="110" x2="0" y2="110" />
        <line x1="20" y1="80" x2="15" y2="80" /><line x1="15" y1="80" x2="15" y2="110" />
        <line x1="110" y1="50" x2="105" y2="50" /><line x1="105" y1="50" x2="105" y2="110" /><line x1="105" y1="110" x2="0" y2="110" />
        <line x1="110" y1="80" x2="105" y2="80" /><line x1="105" y1="80" x2="105" y2="110" />
        <line x1="200" y1="50" x2="195" y2="50" /><line x1="195" y1="50" x2="195" y2="110" /><line x1="195" y1="110" x2="0" y2="110" />
        <line x1="200" y1="80" x2="195" y2="80" /><line x1="195" y1="80" x2="195" y2="110" />
        {/* CLK lines */}
        <line x1="0" y1="65" x2="20" y2="65" className="stroke-current" strokeWidth="1" />
        <DiagramText x="10" y="60}>CLK</DiagramText>
        <line x1="90" y1="50" x2="110" y2="65" className="stroke-current" strokeWidth="1" />
        <line x1="180" y1="50" x2="200" y2="65" className="stroke-current" strokeWidth="1" />
      </svg>
    ),
  },
   {
    id: 'down-counter-jk',
    name: '3-Bit Async Down Counter',
    type: 'Counter',
    description: "A 3-bit asynchronous (ripple) down counter. Like the up counter, it uses JK flip-flops in toggle mode. However, the clock for the next stage is driven by the inverted output (Q') of the previous stage. This causes the counter to cycle downwards from 7 (111) to 0 (000).",
    inputs: ['CLK'],
    outputs: ['Q2', 'Q1', 'Q0'],
    characteristicTable: [ // State transitions
        { 'Current State (Q2 Q1 Q0)': '111', 'Next State': '110' },
        { 'Current State (Q2 Q1 Q0)': '110', 'Next State': '101' },
        { 'Current State (Q2 Q1 Q0)': '101', 'Next State': '100' },
        { 'Current State (Q2 Q1 Q0)': '100', 'Next State': '011' },
        { 'Current State (Q2 Q1 Q0)': '011', 'Next State': '010' },
        { 'Current State (Q2 Q1 Q0)': '010', 'Next State': '001' },
        { 'Current State (Q2 Q1 Q0)': '001', 'Next State': '000' },
        { 'Current State (Q2 Q1 Q0)': '000', 'Next State': '111' },
    ],
    excitationTable: [],
    characteristicEquation: "Counts down on each clock cycle.",
    logicFunction: ({ state }) => {
        const { Q0 = 0, Q1 = 0, Q2 = 0 } = state;
        let count = (Q2 << 2) | (Q1 << 1) | Q0;
        count = (count - 1 + 8) % 8; // +8 handles wrap-around from 0 to 7
        return {
            Q2: (count >> 2) & 1,
            Q1: (count >> 1) & 1,
            Q0: count & 1,
        };
    },
    symbolSvg: (
      <svg viewBox="0 0 220 120" className="w-full h-auto">
        <rect x="10" y="20" width="200" height="80" className="stroke-current fill-transparent" strokeWidth="2" />
        <DiagramText x={110} y={35}>3-Bit Down Counter</DiagramText>
        <line x1="10" y1="70" x2="30" y2="70" className="stroke-current" strokeWidth="2" />
        <polygon points="10,65 20,70 10,75" className="fill-current stroke-current" />
        <DiagramText x={40} y={65}>CLK</DiagramText>
        <line x1="210" y1="45" x2="230" y2="45" className="stroke-current" strokeWidth="2" />
        <DiagramText x={220} y={40}>Q2</DiagramText>
        <line x1="210" y1="65" x2="230" y2="65" className="stroke-current" strokeWidth="2" />
        <DiagramText x={220} y={60}>Q1</DiagramText>
        <line x1="210" y1="85" x2="230" y2="85" className="stroke-current" strokeWidth="2" />
        <DiagramText x={220} y={80}>Q0</DiagramText>
      </svg>
    ),
    circuitSvg: (
      <svg viewBox="-10 0 300 130" className="w-full h-auto">
        <DiagramText x={140} y={10}>Circuit: 3-Bit Asynchronous Down Counter</DiagramText>
        {/* JK FF 0 */}
        <rect x="20" y="30" width="70" height="70" className="stroke-current fill-transparent" strokeWidth="1"/>
        <DiagramText x={55} y={40}>FF0</DiagramText>
        <DiagramText x={15} y={50}>J</DiagramText><DiagramText x={15} y={80}>K</DiagramText>
        <polygon points="20,62 30,65 20,68" className="fill-current stroke-current"/><circle cx="30" cy="65" r="2" className="stroke-current fill-light-card dark:fill-dark-card" strokeWidth="1"/>
        <DiagramText x={95} y={80}>Q0'</DiagramText>
        {/* JK FF 1 */}
        <rect x="110" y="30" width="70" height="70" className="stroke-current fill-transparent" strokeWidth="1"/>
        <DiagramText x={145} y={40}>FF1</DiagramText>
        <DiagramText x={105} y={50}>J</DiagramText><DiagramText x={105} y={80}>K</DiagramText>
        <polygon points="110,62 120,65 110,68" className="fill-current stroke-current"/><circle cx="120" cy="65" r="2" className="stroke-current fill-light-card dark:fill-dark-card" strokeWidth="1"/>
        <DiagramText x={185} y={80}>Q1'</DiagramText>
        {/* JK FF 2 */}
        <rect x="200" y="30" width="70" height="70" className="stroke-current fill-transparent" strokeWidth="1"/>
        <DiagramText x={235} y={40}>FF2</DiagramText>
        <DiagramText x={195} y={50}>J</DiagramText><DiagramText x={195} y={80}>K</DiagramText>
        <polygon points="200,62 210,65 200,68" className="fill-current stroke-current"/><circle cx="210" cy="65" r="2" className="stroke-current fill-light-card dark:fill-dark-card" strokeWidth="1"/>
        <DiagramText x={275} y={50}>Q2</DiagramText>
        {/* J=K=1 Lines */}
        <line x1="0" y1="110" x2="200" y2="110" className="stroke-current" strokeWidth="1" />
        <DiagramText x="-5" y={110}>1</DiagramText>
        <line x1="20" y1="50" x2="15" y2="50" /><line x1="15" y1="50" x2="15" y2="110" /><line x1="15" y1="110" x2="0" y2="110" />
        <line x1="20" y1="80" x2="15" y2="80" /><line x1="15" y1="80" x2="15" y2="110" />
        <line x1="110" y1="50" x2="105" y2="50" /><line x1="105" y1="50" x2="105" y2="110" /><line x1="105" y1="110" x2="0" y2="110" />
        <line x1="110" y1="80" x2="105" y2="80" /><line x1="105" y1="80" x2="105" y2="110" />
        <line x1="200" y1="50" x2="195" y2="50" /><line x1="195" y1="50" x2="195" y2="110" /><line x1="195" y1="110" x2="0" y2="110" />
        <line x1="200" y1="80" x2="195" y2="80" /><line x1="195" y1="80" x2="195" y2="110" />
        {/* CLK lines (Q' -> CLK) */}
        <line x1="0" y1="65" x2="20" y2="65" className="stroke-current" strokeWidth="1" />
        <DiagramText x="10" y="60}>CLK</DiagramText>
        <line x1="90" y1="80" x2="110" y2="65" className="stroke-current" strokeWidth="1" />
        <line x1="180" y1="80" x2="200" y2="65" className="stroke-current" strokeWidth="1" />
        {/* Outputs Q0, Q1, Q2 */}
        <line x1="90" y1="50" x2="100" y2="50" className="stroke-current" strokeWidth="1"/><DiagramText x={100} y={45}>Q0</DiagramText>
        <line x1="180" y1="50" x2="190" y2="50" className="stroke-current" strokeWidth="1"/><DiagramText x={190} y={45}>Q1</DiagramText>
        <line x1="270" y1="50" x2="280" y2="50" className="stroke-current" strokeWidth="1"/><DiagramText x={280} y={45}>Q2</DiagramText>
      </svg>
    ),
  },
];