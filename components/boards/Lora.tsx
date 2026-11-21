import React from 'react';
import { LORA_PIN_INFO } from '../../data/boardData';

export const LoraModule: React.FC = () => (
    <svg width="180" height="220" viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main board */}
        <rect width="180" height="220" rx="5" className="fill-blue-700 dark:fill-blue-900"/>
        
        {/* RFM9x chip module (the silver can) */}
        <rect x="40" y="60" width="100" height="90" rx="3" className="fill-gray-400 dark:fill-gray-500"/>
        <rect x="42" y="62" width="96" height="86" rx="1" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" fill="none"/>
        <text x="90" y="110" fontFamily="monospace" fontSize="12" className="fill-gray-800 dark:fill-gray-200" textAnchor="middle">RFM9x</text>

        {/* Antenna Connector (SMA style) */}
        <rect x="80" y="10" width="20" height="30" rx="2" fill="#FFC107"/>
        <circle cx="90" cy="25" r="3" fill="#4A90E2" className="stroke-gray-800 dark:stroke-gray-200" strokeWidth="0.5"/>
        
        {/* Crystal Oscillator */}
        <rect x="70" y="170" width="40" height="20" rx="2" className="fill-gray-300 dark:fill-gray-400"/>

        {/* Pin Headers */}
        <rect x="0" y="40" width="16" height="140" rx="2" className="fill-gray-800 dark:fill-gray-700"/>
        <rect x="164" y="40" width="16" height="120" rx="2" className="fill-gray-800 dark:fill-gray-700"/>

        {/* Pin labels and holes */}
        {Object.entries(LORA_PIN_INFO).map(([key, val]) => (
            <g key={key}>
                <rect x={val.x - 4} y={val.y - 4} width="8" height="8" className="fill-yellow-400 dark:fill-yellow-500"/>
                <text 
                    x={val.x < 90 ? val.x + 12 : val.x - 12} 
                    y={val.y + 3} 
                    fontFamily="monospace" 
                    fontSize="9" 
                    className="fill-gray-800 dark:fill-gray-200"
                    textAnchor={val.x < 90 ? 'start' : 'end'}
                >
                    {key}
                </text>
            </g>
        ))}
    </svg>
);
