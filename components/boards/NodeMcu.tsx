import React from 'react';
import { NODEMCU_PIN_INFO } from '../../data/boardData';

export const NodeMcu: React.FC = () => (
    <svg width="128" height="256" viewBox="0 0 256 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main Board */}
        <rect width="256" height="512" rx="10" className="fill-gray-800 dark:fill-black"/>
        
        {/* Silver ESP8266 Module */}
        <rect x="30" y="100" width="196" height="300" rx="5" className="fill-gray-400 dark:fill-gray-500"/>
        <rect x="32" y="102" width="192" height="296" rx="3" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" fill="none"/>
        
        {/* USB Port */}
        <rect x="80" y="20" width="96" height="40" rx="3" className="fill-gray-500 dark:fill-gray-600"/>
        <rect x="88" y="24" width="80" height="32" rx="2" className="fill-gray-300 dark:fill-gray-400"/>

        {/* ESP-12E Chip on module */}
        <rect x="50" y="120" width="156" height="150" rx="2" className="fill-gray-800 dark:fill-black"/>
        <text x="128" y="200" fontFamily="monospace" fontSize="18" className="fill-yellow-400 dark:fill-yellow-500" textAnchor="middle">ESP8266</text>

        {/* Other chips */}
        <rect x="80" y="300" width="96" height="60" rx="2" className="fill-gray-800 dark:fill-black"/>
        <text x="128" y="335" fontFamily="monospace" fontSize="14" className="fill-gray-300 dark:fill-gray-400" textAnchor="middle">CH340G</text>

        {/* Pin Headers */}
        <rect x="10" y="80" width="20" height="412" rx="2" className="fill-gray-700 dark:fill-gray-800"/>
        <rect x="226" y="80" width="20" height="412" rx="2" className="fill-gray-700 dark:fill-gray-800"/>

        {/* Pin labels and holes */}
        {Object.entries(NODEMCU_PIN_INFO).map(([key, val]) => (
            <g key={key}>
                <rect x={val.x - 4} y={val.y - 4} width="8" height="8" className="fill-yellow-400 dark:fill-yellow-500"/>
                <text 
                    x={val.x < 128 ? val.x + 12 : val.x - 12} 
                    y={val.y + 4} 
                    fontFamily="monospace" 
                    fontSize="14" 
                    className="fill-gray-200 dark:fill-gray-300"
                    textAnchor={val.x < 128 ? 'start' : 'end'}
                >
                    {key.split('_')[0]}
                </text>
            </g>
        ))}
    </svg>
);
