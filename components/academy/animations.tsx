import React, { useState, useEffect } from 'react';

export const WaterAnalogyAnimation: React.FC = () => (
  <svg viewBox="0 0 300 150" className="w-full h-auto">
    <style>{`
      .water-flow {
        stroke-dasharray: 5 5;
        animation: flow 2s linear infinite;
      }
      @keyframes flow {
        to {
          stroke-dashoffset: -10;
        }
      }
      .pump-blades {
        transform-origin: 50px 75px;
        animation: spin 3s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(380deg);
        }
      }
    `}</style>
    {/* Labels */}
    <text x="50" y="20" fontFamily="sans-serif" fontSize="12" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">Voltage (Pressure)</text>
    <text x="175" y="20" fontFamily="sans-serif" fontSize="12" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">Current (Flow)</text>
    <text x="260" y="90" fontFamily="sans-serif" fontSize="12" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">Resistance</text>
    
    {/* Pipe */}
    <path d="M100 50 H220 V100 H100" strokeWidth="10" stroke="#90A4AE" fill="none" />
    <path d="M80 50 H100 M80 100 H100" strokeWidth="10" stroke="#90A4AE" fill="none" />
    
    {/* Water Flow */}
    <path className="water-flow" d="M100 50 H220 V100 H100" strokeWidth="4" stroke="#4FC3F7" fill="none" />
    
    {/* Pump */}
    <circle cx="50" cy="75" r="30" stroke="#78909C" strokeWidth="2" fill="#CFD8DC" />
    <g className="pump-blades" fill="#78909C">
      <rect x="48" y="45" width="4" height="60" rx="2" transform="rotate(20 50 75)" />
      <rect x="20" y="73" width="60" height="4" rx="2" transform="rotate(20 50 75)" />
    </g>
    <path d="M50 45 V30 H80 V50 M50 105 V120 H80 V100" strokeWidth="10" stroke="#90A4AE" fill="none" />
    
    {/* Resistance */}
    <path d="M220 50 H240 L250 65 V85 L240 100 H220" strokeWidth="10" stroke="#90A4AE" fill="none" />
    <path className="water-flow" d="M220 50 H240 L250 65 V85 L240 100 H220" strokeWidth="2" stroke="#4FC3F7" fill="none" />
  </svg>
);

export const OhmLawTriangleAnimation: React.FC = () => (
    <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto">
        <style>{`
            .ohm-segment { transition: opacity 0.3s; cursor: pointer; }
            .ohm-segment:hover { opacity: 0.7; }
        `}</style>
        <path d="M50 10 L10 80 H90 Z" fill="#424242" stroke="#9E9E9E" strokeWidth="2" />
        <line x1="10" y1="45" x2="90" y2="45" stroke="#9E9E9E" strokeWidth="2" />
        <text x="50" y="35" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">V</text>
        <text x="30" y="70" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">I</text>
        <text x="70" y="70" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">R</text>
        <path d="M50 45 L50 80" stroke="#9E9E9E" strokeWidth="2" />

        {/* Interactive overlays */}
        <g className="ohm-segment">
            <title>Voltage = Current × Resistance</title>
            <path d="M50 10 L10 45 H90 Z" fill="transparent" />
        </g>
        <g className="ohm-segment">
            <title>Current = Voltage / Resistance</title>
            <path d="M10 80 H50 V45 L10 80 Z" fill="transparent" />
        </g>
        <g className="ohm-segment">
            <title>Resistance = Voltage / Current</title>
            <path d="M50 45 V80 H90 L50 45 Z" fill="transparent" />
        </g>
    </svg>
);

export const SeriesCircuitAnimation: React.FC = () => (
    <svg viewBox="0 0 300 150" className="w-full h-auto">
        <style>{`
          .series-flow {
            stroke-dasharray: 4 4;
            animation: flow-series 4s linear infinite;
          }
          @keyframes flow-series {
            to { stroke-dashoffset: -16; }
          }
          .resistor-symbol {
            stroke-width: 2;
            stroke: #4CAF50;
            fill: none;
          }
        `}</style>
        {/* Battery */}
        <rect x="20" y="60" width="10" height="30" fill="#757575" />
        <rect x="15" y="65" width="20" height="20" fill="#757575" />
        <text x="25" y="55" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">+</text>
        <text x="25" y="100" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">-</text>
        
        {/* Wires */}
        <path d="M35 75 H70 V50 H230 V75" stroke="#616161" fill="none" strokeWidth="2" />
        
        {/* Resistors */}
        <path className="resistor-symbol" d="M90 50 l5 -10 l10 20 l10 -20 l10 20 l10 -20 l5 10" />
        <text x="115" y="30" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">R1</text>
        
        <path className="resistor-symbol" d="M170 50 l5 -10 l10 20 l10 -20 l10 20 l10 -20 l5 10" />
        <text x="195" y="30" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">R2</text>
        
        {/* Current Flow Animation */}
        <path d="M35 75 H70 V50 H230 V75" stroke="#2196F3" fill="none" strokeWidth="2" className="series-flow" />
    </svg>
);

export const ParallelCircuitAnimation: React.FC = () => (
    <svg viewBox="0 0 300 150" className="w-full h-auto">
        <style>{`
          .parallel-flow {
            stroke-dasharray: 4 4;
            animation: flow-parallel 3s linear infinite;
          }
          @keyframes flow-parallel {
            to { stroke-dashoffset: -16; }
          }
           .resistor-symbol {
            stroke-width: 2;
            stroke: #4CAF50;
            fill: none;
          }
        `}</style>
         {/* Battery */}
        <rect x="20" y="60" width="10" height="30" fill="#757575" />
        <rect x="15" y="65" width="20" height="20" fill="#757575" />
        <text x="25" y="55" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">+</text>
        <text x="25" y="100" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">-</text>

        {/* Wires */}
        <path d="M35 75 H70 M230 75 H270" stroke="#616161" fill="none" strokeWidth="2" />
        <path d="M70 75 V30 H230 V75" stroke="#616161" fill="none" strokeWidth="2" />
        <path d="M70 75 V120 H230 V75" stroke="#616161" fill="none" strokeWidth="2" />

        {/* Resistors */}
        <path className="resistor-symbol" d="M110 30 v10 l5 -3 l10 6 l10 -6 l10 6 l5 -3 v-10" transform="rotate(90 135 45)" />
        <text x="135" y="20" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">R1</text>
        <path className="resistor-symbol" d="M110 120 v-10 l5 3 l10 -6 l10 6 l10 -6 l5 3 v10" transform="rotate(-90 135 105)" />
        <text x="135" y="135" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">R2</text>
        
        {/* Current Flow */}
        <path d="M35 75 H70" stroke="#2196F3" fill="none" strokeWidth="2" className="parallel-flow" />
        <path d="M70 75 V30 H230 V75" stroke="#2196F3" fill="none" strokeWidth="2" className="parallel-flow" />
        <path d="M70 75 V120 H230 V75" stroke="#2196F3" fill="none" strokeWidth="2" className="parallel-flow" />
        <path d="M230 75 H270" stroke="#2196F3" fill="none" strokeWidth="2" className="parallel-flow" />
    </svg>
);

export const BreadboardAnimation: React.FC = () => {
    const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
    const pinHoles = [];
    const groups: { [key: string]: { x: number, y: number }[] } = {};

    // Generate terminal strip holes
    for (let row = 0; row < 12; row++) {
        groups[`row-top-${row}`] = [];
        groups[`row-bottom-${row}`] = [];
        for (let col = 0; col < 5; col++) {
            const topPos = { x: 20 + row * 10, y: 55 + col * 10 };
            const bottomPos = { x: 20 + row * 10, y: 115 + col * 10 };
            pinHoles.push({ group: `row-top-${row}`, ...topPos });
            pinHoles.push({ group: `row-bottom-${row}`, ...bottomPos });
            groups[`row-top-${row}`].push(topPos);
            groups[`row-bottom-${row}`].push(bottomPos);
        }
    }
    // Generate power rail holes
    ['rail-top-pos', 'rail-top-neg', 'rail-bottom-pos', 'rail-bottom-neg'].forEach(id => groups[id] = []);
    for (let i = 0; i < 24; i++) {
        const x = 20 + i * 5;
        pinHoles.push({ group: 'rail-top-pos', x, y: 25 });
        pinHoles.push({ group: 'rail-top-neg', x, y: 35 });
        pinHoles.push({ group: 'rail-bottom-pos', x, y: 175 });
        pinHoles.push({ group: 'rail-bottom-neg', x, y: 185 });
        groups['rail-top-pos'].push({ x, y: 25 });
        groups['rail-top-neg'].push({ x, y: 35 });
        groups['rail-bottom-pos'].push({ x, y: 175 });
        groups['rail-bottom-neg'].push({ x, y: 185 });
    }

    return (
        <svg viewBox="0 0 160 220" className="w-full h-auto max-w-sm mx-auto">
            <rect x="5" y="5" width="150" height="210" rx="5" fill="#FAFAFA" stroke="#E0E0E0" />
            <rect x="10" y="22" width="140" height="16" fill="#E0E0E0" />
            <rect x="10" y="182" width="140" height="16" fill="#E0E0E0" />
            <rect x="12" y="24" width="136" height="4" fill="#EF5350" />
            <rect x="12" y="32" width="136" height="4" fill="#42A5F5" />
            <rect x="12" y="184" width="136" height="4" fill="#42A5F5" />
            <rect x="12" y="192" width="136" height="4" fill="#EF5350" />
            
            {pinHoles.map((hole, i) => (
                <circle key={i} cx={hole.x} cy={hole.y} r="1.5"
                    className={`transition-colors duration-150 ${hoveredGroup === hole.group ? 'fill-cyan-500' : 'fill-gray-500'}`}
                    onMouseEnter={() => setHoveredGroup(hole.group)}
                    onMouseLeave={() => setHoveredGroup(null)}
                />
            ))}
        </svg>
    );
};

export const MultimeterAnimation: React.FC = () => (
    <svg viewBox="0 0 450 180" className="w-full h-auto">
        <defs>
            <marker id="arrowhead" markerWidth="5" markerHeight="3.5" refX="5" refY="1.75" orient="auto">
                <polygon points="0 0, 5 1.75, 0 3.5" fill="currentColor"/>
            </marker>
        </defs>
        {/* Voltage Measurement */}
        <g transform="translate(0, 20)">
            <text x="75" y="-10" textAnchor="middle" fontSize="10" className="font-bold fill-gray-800 dark:fill-gray-200">Measure Voltage (Parallel)</text>
            <rect x="65" y="30" width="20" height="40" fill="#757575" /><rect x="70" y="25" width="10" height="10" fill="#757575" />
            <text x="75" y="20" textAnchor="middle" fontSize="8" className="fill-gray-800 dark:fill-gray-200">1.5V</text>
            <path d="M40 50 h25" stroke="black" strokeWidth="1" />
            <path d="M85 50 h25" stroke="red" strokeWidth="1" />
            <path d="M40 50 v-30 h 70 v 30" stroke="#757575" fill="none" />
            <text x="75" y="15" textAnchor="middle" fontSize="8" className="fill-gray-800 dark:fill-gray-200">V~</text>
        </g>
        {/* Current Measurement */}
        <g transform="translate(150, 20)">
            <text x="75" y="-10" textAnchor="middle" fontSize="10" className="font-bold fill-gray-800 dark:fill-gray-200">Measure Current (Series)</text>
            <rect x="35" y="30" width="20" height="40" fill="#757575" /><rect x="40" y="25" width="10" height="10" fill="#757575" />
             <path d="M55 50 h20" stroke="black" strokeWidth="1" />
            <path d="M115 50 h20" stroke="red" strokeWidth="1" />
            <path d="M75 50 v-30 h40 v30" stroke="#757575" fill="none" />
            <text x="95" y="15" textAnchor="middle" fontSize="8" className="fill-gray-800 dark:fill-gray-200">A~</text>
            <path d="M135 50 l10 -10 m-10 10 l10 10" stroke="#F44336" strokeWidth="1" />
            <path d="M145 50 h-10 v20 h10 v-20" fill="none" stroke="#F44336" strokeWidth="1" />
            <path d="M15 50 h20" stroke="black" strokeWidth="1" />
             <path d="M145 70 h-20" stroke="black" strokeWidth="1" />
            <path d="M155 40 L165 40 M160 35 L160 45" stroke="#4CAF50" strokeWidth="1" />
            <text x="160" y="30" fontSize="8" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">LED</text>
        </g>
        {/* Resistance Measurement */}
        <g transform="translate(300, 20)">
            <text x="75" y="-10" textAnchor="middle" fontSize="10" className="font-bold fill-gray-800 dark:fill-gray-200">Measure Resistance (Out of Circuit)</text>
            <path d="M60 50 l5 -10 l10 20 l10 -20 l10 20 l10 -20 l5 10" stroke="#4CAF50" fill="none" strokeWidth="2" />
             <text x="85" y="70" textAnchor="middle" fontSize="8" className="fill-gray-800 dark:fill-gray-200">220Ω</text>
            <path d="M40 50 h20" stroke="black" strokeWidth="1" />
            <path d="M110 50 h20" stroke="red" strokeWidth="1" />
            <path d="M40 50 v-30 h 90 v 30" stroke="#757575" fill="none" />
            <text x="85" y="15" textAnchor="middle" fontSize="10" className="fill-gray-800 dark:fill-gray-200">Ω</text>
        </g>
    </svg>
);

export const ResistorColorCodeAnimation: React.FC = () => (
    <svg viewBox="0 0 300 120" className="w-full h-auto max-w-lg mx-auto">
        {/* Resistor body */}
        <rect x="50" y="40" width="200" height="40" rx="10" fill="#FBE9E7" />
        <rect x="20" y="58" width="30" height="4" fill="#BDBDBD" />
        <rect x="250" y="58" width="30" height="4" fill="#BDBDBD" />

        {/* Bands */}
        <rect x="70" y="40" width="10" height="40" fill="brown" />
        <rect x="100" y="40" width="10" height="40" fill="black" />
        <rect x="130" y="40" width="10" height="40" fill="red" />
        <rect x="180" y="40" width="10" height="40" fill="gold" />

        {/* Labels */}
        <text x="75" y="30" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">1st Digit</text>
        <text x="105" y="30" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">2nd Digit</text>
        <text x="135" y="30" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">Multiplier</text>
        <text x="185" y="30" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">Tolerance</text>
        
        <text x="75" y="95" fontSize="12" textAnchor="middle" fontWeight="bold" className="fill-gray-800 dark:fill-gray-200">1</text>
        <text x="105" y="95" fontSize="12" textAnchor="middle" fontWeight="bold" className="fill-gray-800 dark:fill-gray-200">0</text>
        <text x="135" y="95" fontSize="12" textAnchor="middle" fontWeight="bold" className="fill-gray-800 dark:fill-gray-200">x 100</text>
        <text x="185" y="95" fontSize="12" textAnchor="middle" fontWeight="bold" className="fill-gray-800 dark:fill-gray-200">± 5%</text>
        
        <text x="150" y="115" fontSize="12" textAnchor="middle" fontWeight="bold" className="fill-cyan-600 dark:fill-cyan-400">Result: 1000 Ω or 1kΩ (± 5%)</text>
    </svg>
);

export const PowerLawAnimation: React.FC = () => (
    <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto">
        <style>{`.ohm-segment { transition: opacity 0.3s; cursor: pointer; } .ohm-segment:hover { opacity: 0.7; }`}</style>
        <path d="M50 10 L10 80 H90 Z" fill="#424242" stroke="#9E9E9E" strokeWidth="2" />
        <line x1="10" y1="45" x2="90" y2="45" stroke="#9E9E9E" strokeWidth="2" />
        <text x="50" y="35" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">P</text>
        <text x="30" y="70" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">V</text>
        <text x="70" y="70" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">I</text>
        <path d="M50 45 L50 80" stroke="#9E9E9E" strokeWidth="2" />
        <g className="ohm-segment">
            <title>Power = Voltage × Current</title>
            <path d="M50 10 L10 45 H90 Z" fill="transparent" />
        </g>
        <g className="ohm-segment">
            <title>Voltage = Power / Current</title>
            <path d="M10 80 H50 V45 L10 80 Z" fill="transparent" />
        </g>
        <g className="ohm-segment">
            <title>Current = Power / Voltage</title>
            <path d="M50 45 V80 H90 L50 45 Z" fill="transparent" />
        </g>
    </svg>
);

export const ShortCircuitAnimation: React.FC = () => (
    <svg viewBox="0 0 300 150" className="w-full h-auto">
        <style>{`
          .flow { stroke-dasharray: 4 4; animation: short-circuit-flow 2s linear infinite; }
          @keyframes short-circuit-flow { to { stroke-dashoffset: -16; } }
          .spark { animation: spark-animation 0.5s infinite; transform-origin: center; opacity: 0; }
          @keyframes spark-animation {
              0% { opacity: 0; transform: scale(0.5); }
              50% { opacity: 1; transform: scale(1.2); }
              100% { opacity: 0; transform: scale(0.5); }
          }
        `}</style>
        {/* Normal Circuit */}
        <text x="75" y="15" textAnchor="middle" fontSize="10" className="font-bold fill-gray-800 dark:fill-gray-200">Normal Circuit</text>
        <g transform="translate(0, 20)">
            <rect x="20" y="60" width="10" height="30" fill="#757575" /><rect x="15" y="65" width="20" height="20" fill="#757575" />
            <path d="M35 75 H50 V40 H100 V75" stroke="#616161" fill="none" strokeWidth="2" />
            <path d="M60 40 l5 -5 l5 10 l5 -5 l5 5" stroke="#4CAF50" fill="none" strokeWidth="2" />
            <path d="M85 40 l-5 -5 l-5 5 l2.5 5 l5 0 l2.5 -5 z" fill="#F44336" stroke="#D32F2F" />
            <path d="M35 75 H50 V40 H100 V75" stroke="#2196F3" fill="none" strokeWidth="2" className="flow" />
        </g>
        
        {/* Short Circuit */}
        <text x="225" y="15" textAnchor="middle" fontSize="10" className="font-bold text-red-500">Short Circuit!</text>
        <g transform="translate(150, 20)">
            <rect x="20" y="60" width="10" height="30" fill="#757575" /><rect x="15" y="65" width="20" height="20" fill="#757575" />
            <path d="M35 75 H 125" stroke="red" fill="none" strokeWidth="2" />
            <path d="M80 75" className="spark" stroke="yellow" strokeWidth="3" fill="none">
                 <path d="M-10 0 L10 0 M0 -10 L0 10 M-7 -7 L7 7 M-7 7 L7 -7" />
            </path>
            <path d="M35 75 H 125" stroke="#EF5350" fill="none" strokeWidth="2" className="flow" style={{ animationDuration: '0.2s' }} />
             <text x="80" y="100" textAnchor="middle" fontSize="8" className="fill-red-500">R ≈ 0, so I → ∞</text>
        </g>
    </svg>
);

export const CapacitorAnimation: React.FC = () => {
  const [state, setState] = useState<'charging' | 'discharging'>('charging');

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 300 150" className="w-full h-auto">
        <style>{`
          .charge-flow { stroke-dasharray: 4 4; animation: charge-flow-anim 2s linear infinite; }
          @keyframes charge-flow-anim { to { stroke-dashoffset: -16; } }
          .charge-fill { animation: charge-fill-anim 3s ease-in forwards; }
          @keyframes charge-fill-anim { from { height: 0; } to { height: 30px; } }
        `}</style>
        {/* Battery */}
        <g>
            <rect x="20" y="60" width="10" height="30" fill="#757575" /><rect x="15" y="65" width="20" height="20" fill="#757575" />
            <text x="25" y="55" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">+</text>
            <text x="25" y="100" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">-</text>
        </g>
        {/* Capacitor */}
        <g>
          <path d="M120 40 V110 M130 40 V110" stroke="#FFC107" strokeWidth="3" />
          <path d="M100 75 h20 M130 75 h20" stroke="#616161" strokeWidth="2" />
          {state === 'charging' && <rect x="120" y="75" width="10" height="0" fill="#FFEB3B" className="charge-fill" />}
          {state === 'discharging' && <rect x="120" y="75" width="10" height="30" fill="#FFEB3B" className="charge-fill" style={{ animation: 'charge-fill-anim 3s ease-out reverse forwards' }} />}
          <text x="125" y="30" textAnchor="middle" fontSize="10" className="fill-gray-800 dark:fill-gray-200">Capacitor</text>
        </g>
        {/* LED */}
        <g>
          <path d="M240 75 l-10 -15 h20 l-10 15 v20" stroke="#D32F2F" fill="none" strokeWidth="2"/>
          <path d="M232 63 l6 6 m-3-10 l3 3 m-3 3 l3-3" stroke="white" strokeWidth="1" opacity={state === 'discharging' ? 1 : 0.3} />
        </g>
        {/* Switch and Wires */}
        <path d="M35 75 h30" stroke="#616161" fill="none" strokeWidth="2" />
        <path d="M100 75 h-5" stroke="#616161" fill="none" strokeWidth="2" />
        <path d="M150 75 h50" stroke="#616161" fill="none" strokeWidth="2" />
        <path d="M240 95 v20 h-90" stroke="#616161" fill="none" strokeWidth="2" />
        <path d="M65 75 l10 -10" stroke="#616161" fill="none" strokeWidth="2" transform={state === 'charging' ? 'rotate(0 65 75)' : 'rotate(45 65 75)'}/>
        <circle cx="65" cy="75" r="3" fill="#616161" />
        <circle cx="75" cy="65" r="3" fill={state === 'charging' ? '#616161' : 'none'} />
        <circle cx="100" cy="75" r="3" fill="#616161" />
        <circle cx="150" cy="75" r="3" fill="#616161" />
        <circle cx="200" cy="75" r="3" fill={state === 'discharging' ? '#616161' : 'none'} />
        {/* Flow */}
        {state === 'charging' && <path d="M35 75 h35 l10 -10" stroke="#2196F3" fill="none" strokeWidth="2" className="charge-flow" />}
        {state === 'discharging' && <path d="M150 75 h55" stroke="#2196F3" fill="none" strokeWidth="2" className="charge-flow" />}
      </svg>
      <div className="flex space-x-2 mt-2">
        <button onClick={() => setState('charging')} className={`px-3 py-1 text-sm rounded-md ${state === 'charging' ? 'bg-cyan-600 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>Charge</button>
        <button onClick={() => setState('discharging')} className={`px-3 py-1 text-sm rounded-md ${state === 'discharging' ? 'bg-cyan-600 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>Discharge</button>
      </div>
    </div>
  )
};

export const InductorAnimation: React.FC = () => (
    <svg viewBox="0 0 300 150" className="w-full h-auto">
        <style>{`
            .inductor-glow { animation: inductor-glow-anim 3s ease-in; }
            @keyframes inductor-glow-anim { from { opacity: 0; } to { opacity: 1; } }
            .mag-field { stroke-dasharray: 2 4; stroke-opacity: 0; animation: mag-field-anim 3s ease-in; }
            @keyframes mag-field-anim { 0% { stroke-opacity: 0; } 50% { stroke-opacity: 0.7; } 100% { stroke-opacity: 0.7; } }
        `}</style>
        <g>
            <rect x="20" y="60" width="10" height="30" fill="#757575" /><rect x="15" y="65" width="20" height="20" fill="#757575" />
            <path d="M35 75 H 265" stroke="#616161" fill="none" strokeWidth="2" />
        </g>
        {/* Inductor Symbol */}
        <g>
            <path d="M100 75 A 10 10 0 0 1 110 75 A 10 10 0 0 1 120 75 A 10 10 0 0 1 130 75" stroke="#4A148C" fill="none" strokeWidth="3" />
            <text x="115" y="60" fontSize="10" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">Inductor</text>
            <ellipse cx="115" cy="75" rx="30" ry="15" stroke="#9C27B0" className="mag-field" fill="none"/>
            <ellipse cx="115" cy="75" rx="40" ry="20" stroke="#9C27B0" className="mag-field" style={{animationDelay: '0.2s'}} fill="none"/>
        </g>
        {/* LED */}
        <g>
          <path d="M200 75 l-10 -15 h20 l-10 15 v20" stroke="#D32F2F" fill="none" strokeWidth="2"/>
          <path d="M192 63 l6 6 m-3-10 l3 3 m-3 3 l3-3" stroke="white" strokeWidth="1" className="inductor-glow" />
        </g>
        <text x="10" y="10" fontSize="8" className="fill-gray-500 dark:fill-gray-400">Press "Run" to see the LED fade in slowly.</text>
        <rect x="0" y="0" width="300" height="150" fill="transparent" id="inductor-anim-trigger"/>
    </svg>
);

export const DiodeAnimation: React.FC = () => (
    <svg viewBox="0 0 300 150" className="w-full h-auto">
        <style>{`
          .flow { stroke-dasharray: 4 4; animation: diode-flow-anim 2s linear infinite; }
          @keyframes diode-flow-anim { to { stroke-dashoffset: -16; } }
          .blocked { animation: blocked-anim 1s ease-in-out infinite alternate; }
          @keyframes blocked-anim { to { transform: translateX(2px); } }
        `}</style>
        {/* Forward Bias */}
        <g>
            <text x="75" y="15" textAnchor="middle" fontSize="10" className="font-bold text-green-600 dark:text-green-400">Forward Bias (Current Flows)</text>
            <rect x="20" y="60" width="10" height="30" fill="#757575" /><rect x="15" y="65" width="20" height="20" fill="#757575" />
            <path d="M35 75 H 125" stroke="#616161" fill="none" strokeWidth="2" />
            <path d="M70 75 l-10 -10 h20 v20 h-20z M80 75 h10" stroke="#FF5722" fill="none" strokeWidth="2"/>
            <path d="M35 75 H 125" stroke="#2196F3" fill="none" strokeWidth="2" className="flow" />
        </g>
        
        {/* Reverse Bias */}
        <g transform="translate(150, 0)">
            <text x="75" y="15" textAnchor="middle" fontSize="10" className="font-bold text-red-600 dark:text-red-400">Reverse Bias (Current Blocked)</text>
            <rect x="120" y="60" width="10" height="30" fill="#757575" /><rect x="115" y="65" width="20" height="20" fill="#757575" />
            <path d="M25 75 H 115" stroke="#616161" fill="none" strokeWidth="2" />
            <path d="M70 75 l10 -10 h-20 v20 h20z M60 75 h-10" stroke="#FF5722" fill="none" strokeWidth="2"/>
            <path d="M25 75 H 60" stroke="#2196F3" fill="none" strokeWidth="2" className="flow blocked" />
        </g>
    </svg>
);

export const TransistorSwitchAnimation: React.FC = () => {
    const [isSwitchedOn, setIsSwitchedOn] = useState(false);
    return (
        <div className="flex flex-col items-center">
            <svg viewBox="0 0 400 200" className="w-full h-auto">
                <style>{`
                    .flow { stroke-dasharray: 4 4; animation: transistor-flow-anim 2s linear infinite; }
                    @keyframes transistor-flow-anim { to { stroke-dashoffset: -16; } }
                    .motor-blades { transform-origin: 300px 75px; transition: transform 0.5s linear; }
                `}</style>
                {/* Control Circuit */}
                <g>
                    <text x="50" y="15" fontSize="10" className="font-bold fill-gray-800 dark:fill-gray-200">Control Circuit (Low Power)</text>
                    <rect x="20" y="100" width="5" height="15" fill="#757575" /><rect x="17.5" y="102.5" width="10" height="10" fill="#757575" />
                    <text x="22.5" y="98" fontSize="8" textAnchor="middle">+</text>
                    <path d="M27.5 107.5 H 50" stroke="#616161" fill="none" strokeWidth="1.5" />
                    <circle cx="50" cy="107.5" r="2" fill="#616161" />
                    <path d="M50 107.5 L 60 97.5" stroke="#616161" fill="none" strokeWidth="1.5" className="transition-transform duration-200" transform={isSwitchedOn ? 'rotate(45 50 107.5)' : 'none'}/>
                    <circle cx="60" cy="97.5" r="2" fill={isSwitchedOn ? 'none' : '#616161'} />
                    <path d="M60 97.5 h 20" stroke="#616161" fill="none" strokeWidth="1.5"/>
                    <path d="M80 97.5 l2.5 -5 l5 10 l5 -10 l5 10 l2.5 -5" stroke="#4CAF50" fill="none" strokeWidth="1.5" />
                    <path d="M95 97.5 H 150" stroke="#616161" fill="none" strokeWidth="1.5" />
                    {isSwitchedOn && <path d="M27.5 107.5 H 50 L 60 107.5 H 150" stroke="#2196F3" fill="none" strokeWidth="1.5" className="flow" />}
                </g>

                {/* Load Circuit */}
                 <g>
                    <text x="300" y="15" fontSize="10" className="font-bold fill-gray-800 dark:fill-gray-200">Load Circuit (High Power)</text>
                    <rect x="220" y="40" width="10" height="30" fill="#D32F2F" /><rect x="215" y="45" width="20" height="20" fill="#D32F2F" />
                    <text x="225" y="35" fontSize="8" textAnchor="middle">+</text>
                    <path d="M235 55 h 40" stroke="#616161" fill="none" strokeWidth="2" />
                     {/* Motor */}
                    <circle cx="300" cy="75" r="20" fill="#BDBDBD" />
                    <g className="motor-blades" style={{transform: isSwitchedOn ? 'rotate(720deg)' : 'none'}} fill="#757575">
                        <rect x="299" y="55" width="2" height="40" />
                        <rect x="280" y="74" width="40" height="2" />
                    </g>
                    <path d="M275 55 H 325" stroke="#616161" fill="none" strokeWidth="2" />
                     {isSwitchedOn && <path d="M235 55 h 65 M300 55 v -20" stroke="#EF5350" fill="none" strokeWidth="2" className="flow" />}
                </g>
                
                {/* Transistor */}
                <g>
                    <circle cx="175" cy="107.5" r="25" stroke="#616161" fill="none" strokeWidth="2"/>
                    <path d="M150 107.5 h 10" stroke="#616161" fill="none" strokeWidth="2" />
                    <path d="M160 92.5 v 30" stroke="#616161" fill="none" strokeWidth="2" />
                    <path d="M175 55 v 35" stroke="#616161" fill="none" strokeWidth="2" />
                    <path d="M175 132.5 v 30 H 20 V 107.5 H 27.5 M235 55 v 77.5 H 175" stroke="#616161" fill="none" strokeWidth="2" />
                    <path d="M175 125 l-8 8 m0 -8 l8 8" stroke="#616161" fill="none" strokeWidth="2" />
                    <text x="145" y="100" fontSize="10" textAnchor="end">B</text>
                    <text x="170" y="50" fontSize="10" textAnchor="end">C</text>
                    <text x="170" y="172" fontSize="10" textAnchor="end">E</text>
                    {isSwitchedOn && <path d="M175 55 v 77.5" stroke="#EF5350" fill="none" strokeWidth="2" className="flow" style={{ animationDuration: '0.5s' }} />}
                </g>

            </svg>
            <button onClick={() => setIsSwitchedOn(prev => !prev)} className={`px-4 py-2 text-sm rounded-md transition-colors ${isSwitchedOn ? 'bg-cyan-600 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                {isSwitchedOn ? 'Turn Control Switch OFF' : 'Turn Control Switch ON'}
            </button>
        </div>
    );
};

export const SensorAnimation: React.FC = () => {
    const [lightLevel, setLightLevel] = useState(50); // 0-100
    const ldrResistance = 10000 * (1 - lightLevel / 100); // High resistance in dark, low in light
    const fixedResistance = 10000;
    const totalResistance = fixedResistance + ldrResistance;
    const outputVoltage = (ldrResistance / totalResistance) * 5;

    return (
        <div className="flex flex-col items-center">
            <svg viewBox="0 0 300 150" className="w-full h-auto">
                 <text x="10" y="15" fontSize="10" className="font-bold fill-gray-800 dark:fill-gray-200">Voltage Divider with Photoresistor</text>
                
                {/* 5V Source */}
                <path d="M20 30 h20 v-5 h-20z M25 30 v-5 M35 30 v-5" stroke="#D32F2F" fill="none" strokeWidth="1"/>
                <text x="30" y="15" fontSize="8" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">+5V</text>
                <path d="M30 30 v 20" stroke="#616161" fill="none" strokeWidth="1.5"/>

                {/* Fixed Resistor */}
                <path d="M30 50 l2.5 -5 l5 10 l5 -10 l5 10 l5-10 l2.5 5" transform="translate(45,0) rotate(90 30 50)" stroke="#4CAF50" fill="none" strokeWidth="1.5" />
                <text x="90" y="65" fontSize="8" className="fill-gray-800 dark:fill-gray-200">R_fixed (10kΩ)</text>

                {/* Analog Out */}
                <path d="M30 100 h 100" stroke="#616161" fill="none" strokeWidth="1.5"/>
                <text x="140" y="104" fontSize="8" className="fill-cyan-600 dark:fill-cyan-400 font-bold">Analog Out: {outputVoltage.toFixed(2)}V</text>

                {/* LDR */}
                <g transform="translate(0, 50)">
                    <circle cx="30" cy="75" r="15" stroke="#FFC107" fill="none" strokeWidth="1.5"/>
                    <path d="M18 75 h24 m-21 -5 l5 10 l5-10 l5 10" stroke="#FFC107" fill="none" strokeWidth="1.5"/>
                </g>
                <text x="15" y="140" fontSize="8" className="fill-gray-800 dark:fill-gray-200">LDR</text>
                 <path d="M30 100 v 10 M30 140 v 10" stroke="#616161" fill="none" strokeWidth="1.5"/>

                {/* Ground */}
                <path d="M30 150 h-10 v-5 h20 v5 h-10 M30 145 v-5" stroke="#424242" fill="none" strokeWidth="1.5"/>
                
                {/* Voltage Meter */}
                <g transform="translate(200, 50)">
                    <rect x="0" y="0" width="80" height="50" rx="5" fill="#E0E0E0" stroke="#9E9E9E"/>
                    <rect x="10" y="10" width="60" height="30" fill="white"/>
                    <rect x="10" y="40" width="60" height="0" fill="#29B6F6" style={{height: `${(outputVoltage/5)*30}px`, transition:'height 0.2s'}} />
                    <text x="40" y="28" fontSize="10" textAnchor="middle" fill="black">V</text>
                </g>
            </svg>
            <div className="w-full max-w-xs px-4 mt-2">
                <label htmlFor="light-slider" className="text-sm font-medium fill-gray-800 dark:fill-gray-200">Light Level</label>
                <input 
                    id="light-slider"
                    type="range" 
                    min="0" 
                    max="100" 
                    value={lightLevel} 
                    onChange={e => setLightLevel(Number(e.target.value))} 
                    className="w-full"
                />
            </div>
        </div>
    );
};

export const AnalogVsDigitalAnimation: React.FC = () => (
    <svg viewBox="0 0 300 150" className="w-full h-auto">
        <style>{`
            .analog-wave { stroke-dasharray: 250; stroke-dashoffset: 250; animation: draw-wave 2s ease-out forwards; }
            .digital-wave { stroke-dasharray: 250; stroke-dashoffset: 250; animation: draw-wave 2s ease-out 1s forwards; opacity: 0; animation-fill-mode: forwards; }
            @keyframes draw-wave { to { stroke-dashoffset: 0; opacity: 1; } }
            .sample-dot { animation: pop-in 0.5s ease-out forwards; transform: scale(0); opacity: 0; }
            @keyframes pop-in { to { transform: scale(1); opacity: 1; } }
        `}</style>
        {/* Axes */}
        <path d="M20 130 L20 20 L280 20" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
        <text x="10" y="25" fontSize="8" className="fill-gray-500 dark:fill-gray-400">Value</text>
        <text x="275" y="15" fontSize="8" className="fill-gray-500 dark:fill-gray-400">Time</text>

        {/* Analog Wave */}
        <path d="M20 75 Q 50 25, 80 75 T 140 75 T 200 75 T 260 75" stroke="#29B6F6" strokeWidth="2.5" fill="none" className="analog-wave"/>
        <text x="50" y="140" textAnchor="middle" fontSize="10" className="font-bold fill-[#29B6F6]">Analog (Continuous)</text>
        
        {/* Digital Wave */}
        <g className="digital-wave">
            <path d="M20 100 H50 V50 H110 V100 H170 V50 H230 V100 H260" stroke="#F06292" strokeWidth="2.5" fill="none" />
            <text x="210" y="140" textAnchor="middle" fontSize="10" className="font-bold fill-[#F06292]">Digital (Discrete)</text>
        </g>

        {/* Sampling Points */}
        {[35, 65, 95, 125, 155, 185, 215, 245].map((x, i) => (
             <circle key={i} cx={x} cy={x % 60 < 30 ? 50 : 100} r="3" fill="#F06292" className="sample-dot" style={{animationDelay: `${1.2 + i * 0.1}s`}} />
        ))}
    </svg>
);

export const LogicLevelsAnimation: React.FC = () => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => (prev + 1) % 16);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <svg viewBox="0 0 300 100" className="w-full h-auto">
            {/* Logic Levels */}
            <g>
                <path d="M20 20 H 150" stroke="#616161" fill="none" strokeWidth="1.5" />
                <path d="M20 80 H 150" stroke="#616161" fill="none" strokeWidth="1.5" />
                <rect x="15" y="10" width="10" height="20" fill="#757575"/><rect x="12.5" y="12.5" width="15" height="15" fill="#757575"/>
                <path d="M20 80 v5 h-10 v-5 h20 v5 h-10 m0 -2.5 v5" stroke="#424242" fill="none" strokeWidth="1.5"/>
                <text x="85" y="15" textAnchor="middle" fontSize="10" className="font-bold fill-green-500">HIGH / 1 (+5V)</text>
                <text x="85" y="95" textAnchor="middle" fontSize="10" className="font-bold fill-red-500">LOW / 0 (GND)</text>
            </g>
            {/* Binary Counter */}
            <g transform="translate(200, 10)">
                <text x="40" y="10" textAnchor="middle" fontSize="10" className="font-bold fill-gray-800 dark:fill-gray-200">Binary Counting</text>
                <text x="40" y="55" textAnchor="middle" fontSize="24" fontFamily="monospace" className="fill-cyan-500">{count.toString(2).padStart(4, '0')}</text>
                <text x="40" y="80" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-gray-400">(Decimal: {count})</text>
            </g>
        </svg>
    );
};

export const LogicGatesAnimation: React.FC = () => {
    const [gate, setGate] = useState<'AND' | 'OR' | 'NOT'>('AND');
    const [inputA, setInputA] = useState(false);
    const [inputB, setInputB] = useState(false);

    let output = false;
    let truthTable: {a: number, b: number, out: number}[] = [];

    switch (gate) {
        case 'AND':
            output = inputA && inputB;
            truthTable = [{a:0, b:0, out:0}, {a:0, b:1, out:0}, {a:1, b:0, out:0}, {a:1, b:1, out:1}];
            break;
        case 'OR':
            output = inputA || inputB;
            truthTable = [{a:0, b:0, out:0}, {a:0, b:1, out:1}, {a:1, b:0, out:1}, {a:1, b:1, out:1}];
            break;
        case 'NOT':
            output = !inputA;
            truthTable = [{a:0, b:-1, out:1}, {a:1, b:-1, out:0}]; // Use -1 for unused input
            break;
    }

    const GateSymbol = () => {
        if (gate === 'AND') return <path d="M120 40 H140 C 170 40, 170 100, 140 100 H120 Z" />;
        if (gate === 'OR') return <path d="M120 35 C 130 50, 130 90, 120 105 Q 140 70, 170 70 Q 140 70, 120 35 Z" />;
        if (gate === 'NOT') return <path d="M120 55 L 120 85 L 150 70 Z M150 70 H 160" />;
    };
    
    return (
        <div className="flex flex-col items-center">
            <div className="flex space-x-2 mb-4">
                {(['AND', 'OR', 'NOT'] as const).map(g => (
                    <button key={g} onClick={() => setGate(g)} className={`px-3 py-1 text-sm rounded-md ${gate === g ? 'bg-cyan-600 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>{g}</button>
                ))}
            </div>
            <svg viewBox="0 0 300 140" className="w-full h-auto">
                {/* Inputs */}
                <g>
                    <text x="40" y="35" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">Input A</text>
                    <rect x="25" y="40" width="30" height="15" rx="3" className={`cursor-pointer ${inputA ? 'fill-green-500' : 'fill-gray-400'}`} onClick={() => setInputA(p => !p)} />
                    <text x="40" y="50" textAnchor="middle" fontSize="10" className="fill-white pointer-events-none">{inputA ? '1' : '0'}</text>
                    <path d="M55 47.5 H120" stroke={inputA ? '#4CAF50' : '#9E9E9E'} strokeWidth="2" fill="none" />
                </g>
                {gate !== 'NOT' && <g>
                    <text x="40" y="85" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200">Input B</text>
                    <rect x="25" y="90" width="30" height="15" rx="3" className={`cursor-pointer ${inputB ? 'fill-green-500' : 'fill-gray-400'}`} onClick={() => setInputB(p => !p)} />
                    <text x="40" y="100" textAnchor="middle" fontSize="10" className="fill-white pointer-events-none">{inputB ? '1' : '0'}</text>
                    <path d="M55 97.5 H120" stroke={inputB ? '#4CAF50' : '#9E9E9E'} strokeWidth="2" fill="none" />
                </g>}

                {/* Gate */}
                <g stroke="currentColor" strokeWidth="2.5" fill="none">
                    <GateSymbol />
                    {gate === 'NOT' && <circle cx="155" cy="70" r="3.5" fill="currentColor" stroke="none" />}
                </g>

                {/* Output */}
                <g>
                    <path d="M170 70 H220" stroke={output ? '#4CAF50' : '#9E9E9E'} strokeWidth="2" fill="none" />
                    <path d="M220 70 l-5 -10 l-5 10 l2.5 5 l5 0 l2.5 -5 z" fill={output ? "#F44336" : "#BDBDBD"} stroke={output ? "#D32F2F" : "#757575"} />
                    <text x="250" y="75" textAnchor="middle" fontSize="12" className="font-bold fill-gray-800 dark:fill-gray-200">Output: {output ? 1 : 0}</text>
                </g>
            </svg>
            <div className="mt-4 font-mono text-sm">
                <p className="font-bold mb-2">Truth Table:</p>
                <table className="w-full text-center">
                    <thead>
                        <tr className="border-b-2 border-gray-400 dark:border-gray-500">
                            <th className="px-4">A</th>{gate !== 'NOT' && <th className="px-4">B</th>}<th className="px-4 font-bold text-cyan-600 dark:text-cyan-400">Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {truthTable.map((row, i) => {
                            const isActive = inputA === !!row.a && (gate === 'NOT' || inputB === !!row.b);
                            return (
                                <tr key={i} className={`transition-colors ${isActive ? 'bg-cyan-100 dark:bg-cyan-900/50' : ''}`}>
                                    <td>{row.a}</td>{row.b !== -1 && <td>{row.b}</td>}<td>{row.out}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const IcAnd555TimerAnimation: React.FC = () => (
    <svg viewBox="0 0 300 200" className="w-full h-auto">
        <style>{`
            .component { animation: fly-in 1.5s ease-out forwards; opacity: 0; }
            @keyframes fly-in { from { transform: translate(-50px, -20px) scale(0); opacity: 0; } to { transform: none; opacity: 1; } }
            .ic-lid { animation: lid-close 1s ease-in 1.5s forwards; transform-origin: center; }
            @keyframes lid-close { to { transform: scaleY(1); } }
            .blink { animation: blink-anim 1s step-end infinite; }
            @keyframes blink-anim { 50% { opacity: 0; } }
        `}</style>
        {/* What is an IC */}
        <g>
            <text x="75" y="15" textAnchor="middle" fontSize="10" className="font-bold fill-gray-800 dark:fill-gray-200">What is an IC?</text>
            <rect x="25" y="40" width="100" height="120" rx="5" className="fill-gray-700 dark:fill-gray-800" />
            
            {/* Components */}
            <path d="M40 60 l2 -4 l4 8 l4 -8 l4 8 l2-4" stroke="#4CAF50" fill="none" strokeWidth="1" className="component" />
            <path d="M60 70 l2 -4 l4 8 l4 -8 l4 8 l2-4" stroke="#4CAF50" fill="none" strokeWidth="1" className="component" style={{animationDelay: '0.2s'}} />
            <circle cx="85" cy="85" r="5" stroke="#FF5722" fill="none" strokeWidth="1" className="component" style={{animationDelay: '0.4s'}}/>
            <path d="M45 100 v10 M55 100 v10" stroke="#FFC107" strokeWidth="1.5" className="component" style={{animationDelay: '0.6s'}}/>
            <path d="M70 110 l-4 -4 h8 v8 h-8z M74 110 h4" stroke="#FF5722" fill="none" strokeWidth="1" className="component" style={{animationDelay: '0.8s'}}/>
            
            <rect x="25" y="40" width="100" height="120" rx="5" className="fill-gray-700 dark:fill-gray-800 ic-lid" style={{transform: 'scaleY(0)'}}/>
            
            <text x="75" y="105" textAnchor="middle" fontSize="12" fontFamily="monospace" className="fill-gray-400 component" style={{animationDelay: '2s'}}>IC</text>
        </g>

        {/* 555 Timer Example */}
        <g transform="translate(150, 0)">
             <text x="75" y="15" textAnchor="middle" fontSize="10" className="font-bold fill-gray-800 dark:fill-gray-200">555 Timer Blinker</text>
             <rect x="35" y="80" width="80" height="40" rx="3" className="fill-gray-800"/>
             <text x="75" y="105" textAnchor="middle" fontSize="12" fontFamily="monospace" className="fill-gray-400">555</text>
             {/* Pins and wires */}
             <path d="M75 80 v-20 h-20 v-20 h60 v20 h-20" stroke="#616161" fill="none"/>
             <path d="M115 100 h20" stroke="#616161" fill="none"/>
             <path d="M35 100 h-20 v 60 h 60" stroke="#616161" fill="none"/>

             <path d="M135 100 l-5 -10 l-5 10 l2.5 5 l5 0 l2.5 -5 z" className="blink" fill="#F44336" stroke="#D32F2F" />
        </g>
    </svg>
);