import React from 'react';
import { L298N_PIN_INFO } from '../../data/boardData';

const L298nMotorDriver: React.FC = () => (
    <svg width="180" height="130" viewBox="0 0 180 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main Board */}
        <rect width="180" height="130" rx="5" className="fill-red-700 dark:fill-red-900"/>
        
        {/* Heatsink */}
        <path d="M70 20 L 70 110 L 110 110 L 110 20 Z" className="fill-gray-500 dark:fill-gray-600"/>
        <path d="M75 25 L 75 105 M85 25 L 85 105 M95 25 L 95 105 M105 25 L 105 105" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="2"/>
        
        {/* Top Screw Terminals */}
        <rect x="10" y="5" width="90" height="20" rx="3" className="fill-blue-500 dark:fill-blue-700"/>
        <circle cx="20" cy="15" r="4" className="fill-gray-300 dark:fill-gray-400"/>
        <circle cx="55" cy="15" r="4" className="fill-gray-300 dark:fill-gray-400"/>
        <circle cx="90" cy="15" r="4" className="fill-gray-300 dark:fill-gray-400"/>
        <text x="20" y="30" fontFamily="monospace" fontSize="8" className="fill-gray-800 dark:fill-gray-200" textAnchor="middle">12V</text>
        <text x="55" y="30" fontFamily="monospace" fontSize="8" className="fill-gray-800 dark:fill-gray-200" textAnchor="middle">GND</text>
        <text x="90" y="30" fontFamily="monospace" fontSize="8" className="fill-gray-800 dark:fill-gray-200" textAnchor="middle">5V</text>

        {/* Bottom Screw Terminals */}
        <rect x="10" y="105" width="45" height="20" rx="3" className="fill-blue-500 dark:fill-blue-700"/>
        <rect x="130" y="105" width="45" height="20" rx="3" className="fill-blue-500 dark:fill-blue-700"/>
        <circle cx="18" cy="115" r="4" className="fill-gray-300 dark:fill-gray-400"/>
        <circle cx="42" cy="115" r="4" className="fill-gray-300 dark:fill-gray-400"/>
        <circle cx="138" cy="115" r="4" className="fill-gray-300 dark:fill-gray-400"/>
        <circle cx="162" cy="115" r="4" className="fill-gray-300 dark:fill-gray-400"/>
        <text x="30" y="100" fontFamily="monospace" fontSize="8" className="fill-gray-800 dark:fill-gray-200" textAnchor="middle">MOT B</text>
        <text x="150" y="100" fontFamily="monospace" fontSize="8" className="fill-gray-800 dark:fill-gray-200" textAnchor="middle">MOT A</text>
        
        {/* Right Pin Header */}
        <rect x="165" y="30" width="10" height="95" rx="2" className="fill-gray-800 dark:fill-gray-700"/>
        {Object.entries(L298N_PIN_INFO).filter(([key]) => ['ENA', 'IN1', 'IN2', 'IN3', 'IN4', 'ENB'].includes(key)).map(([key, val]) => (
            <g key={key}>
                <rect x={val.x-5} y={val.y-2.5} width="10" height="5" className="fill-yellow-400 dark:fill-yellow-500"/>
                <text x={val.x-10} y={val.y+3} fontFamily="monospace" fontSize="8" className="fill-gray-800 dark:fill-gray-200" textAnchor="end">{key}</text>
            </g>
        ))}
        
        {/* Chip Label */}
        <text x="90" y="125" fontFamily="monospace" fontSize="10" className="fill-red-400 dark:fill-red-300" textAnchor="middle">L298N</text>
    </svg>
);

export default L298nMotorDriver;
