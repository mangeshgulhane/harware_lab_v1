import React from 'react';
import { RASPBERRY_PI_PIN_INFO } from '../../data/boardData';

const getShortPiPinName = (name: string): string => {
    const baseName = name.split('(')[0].trim();
    if (baseName.startsWith('GPIO')) {
        return baseName;
    }
    if (baseName.includes('3.3V')) return '3V3';
    if (baseName.includes('5V')) return '5V';
    if (baseName.includes('GND')) return 'GND';
    if (baseName.startsWith('ID_')) return baseName.split(' ')[0];
    return baseName;
};


const RaspberryPiBoard: React.FC = () => (
    <svg viewBox="0 0 512 324" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Raspberry Pi 4 B Board schematic">
        <rect width="512" height="324" rx="10" className="fill-green-700 dark:fill-[#2E7D32]"/>
        <rect x="25" y="25" width="462" height="274" rx="5" className="stroke-green-500 dark:stroke-[#4CAF50]" strokeWidth="2"/>
        
        {/* USB Ports */}
        <g>
            <rect x="30" y="50" width="80" height="50" rx="3" className="fill-gray-500 dark:fill-[#616161]"/>
            <rect x="35" y="55" width="25" height="40" rx="2" className="fill-gray-300 dark:fill-[#BDBDBD]"/>
            <rect x="75" y="55" width="25" height="40" rx="2" className="fill-gray-300 dark:fill-[#BDBDBD]"/>
            <rect x="30" y="110" width="80" height="50" rx="3" className="fill-blue-700 dark:fill-[#3F51B5]"/>
            <rect x="35" y="115" width="25" height="40" rx="2" className="fill-blue-300 dark:fill-[#9FA8DA]"/>
            <rect x="75" y="115" width="25" height="40" rx="2" className="fill-blue-300 dark:fill-[#9FA8DA]"/>
        </g>
        
        {/* Ethernet Port */}
        <g>
            <rect x="30" y="170" width="80" height="60" rx="3" className="fill-gray-500 dark:fill-[#616161]"/>
            <rect x="40" y="180" width="60" height="40" rx="2" className="fill-gray-300 dark:fill-[#BDBDBD]"/>
        </g>
        
        {/* CPU */}
        <rect x="180" y="120" width="80" height="80" rx="3" className="fill-gray-400 dark:fill-[#757575]"/>
        <text x="220" y="165" className="fill-gray-800 dark:fill-[#E0E0E0]" fontFamily="monospace" fontSize="12" textAnchor="middle">SOC</text>

        {/* GPIO Header */}
        <g>
            <rect x="420" y="25" width="40" height="212" rx="3" className="fill-gray-700 dark:fill-[#424242]"/>
            {RASPBERRY_PI_PIN_INFO.map((pin) => (
                <g key={`pin-group-${pin.num}`}>
                    <circle cx={pin.x} cy={pin.y} r="3" className="fill-yellow-400 dark:fill-[#FFC107]" >
                        <title>{`Pin ${pin.num}: ${pin.name}`}</title>
                    </circle>
                    <text
                        x={pin.num % 2 !== 0 ? pin.x - 8 : pin.x + 8}
                        y={pin.y + 2} // Vertically center align
                        fontFamily="monospace"
                        fontSize="6"
                        className="fill-gray-800 dark:fill-gray-200"
                        textAnchor={pin.num % 2 !== 0 ? "end" : "start"}
                    >
                        {getShortPiPinName(pin.name)}
                    </text>
                </g>
            ))}
        </g>

        {/* Misc components */}
        <rect x="150" y="40" width="50" height="30" rx="2" className="fill-gray-700 dark:fill-[#424242]"/>
        <rect x="250" y="60" width="40" height="40" rx="2" className="fill-gray-700 dark:fill-[#424242]"/>
        <rect x="320" y="250" width="60" height="40" rx="2" className="fill-gray-700 dark:fill-[#424242]"/>

        <text x="470" y="300" className="fill-green-400 dark:fill-[#66BB6A]" fontFamily="monospace" fontSize="14" textAnchor="end">Raspberry Pi 4 B</text>
    </svg>
);

export default RaspberryPiBoard;
