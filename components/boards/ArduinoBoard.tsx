import React from 'react';
import { ARDUINO_PIN_INFO } from '../../data/boardData';

const getShortArduinoPinName = (name: string): string => {
    if (name.startsWith('D')) return name.substring(1);
    if (name.startsWith('GND')) return 'GND';
    if (name === '3.3V') return '3V3';
    return name;
};

const ArduinoBoard: React.FC = () => (
    <svg viewBox="0 0 512 336" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Arduino R3 board schematic">
        <rect width="512" height="336" rx="10" className="fill-cyan-700 dark:fill-[#00838F]"/>
        <rect x="25" y="25" width="462" height="286" rx="5" className="stroke-cyan-500 dark:stroke-[#00ACC1]" strokeWidth="2"/>

        {/* USB Port */}
        <rect x="45" y="130" width="60" height="70" rx="3" className="fill-gray-500 dark:fill-[#616161]"/>
        <rect x="50" y="145" width="50" height="40" rx="2" className="fill-gray-300 dark:fill-[#BDBDBD]"/>

        {/* Power Jack */}
        <circle cx="140" cy="165" r="25" className="fill-gray-700 dark:fill-[#424242]"/>
        <circle cx="140" cy="165" r="10" className="fill-gray-300 dark:fill-[#BDBDBD]"/>

        {/* CPU */}
        <rect x="220" y="120" width="120" height="80" rx="3" className="fill-gray-700 dark:fill-[#424242]"/>
        <text x="280" y="165" className="fill-gray-300 dark:fill-[#BDBDBD]" fontFamily="monospace" fontSize="12" textAnchor="middle">ATmega328P</text>

        {/* Top Header Block */}
        <g>
            <rect x="230" y="28" width="268" height="20" rx="2" className="fill-gray-800 dark:fill-[#212121]" />
            {ARDUINO_PIN_INFO.filter(pin => pin.coords.y < 100).map((pin) => (
                <g key={`pin-group-${pin.name}`}>
                    <rect x={pin.coords.x - 4} y={pin.coords.y - 4} width="8" height="8" className="fill-gray-300 dark:fill-[#BDBDBD]">
                        <title>{pin.description}</title>
                    </rect>
                    <text
                        x={pin.coords.x}
                        y={pin.coords.y - 12}
                        fontFamily="monospace"
                        fontSize="8"
                        className="fill-gray-800 dark:fill-gray-200"
                        textAnchor="middle"
                    >
                        {getShortArduinoPinName(pin.name)}
                    </text>
                </g>
            ))}
        </g>
        
        {/* Bottom Header Block */}
        <g>
             <rect x="180" y="288" width="190" height="20" rx="2" className="fill-gray-800 dark:fill-[#212121]" />
            {ARDUINO_PIN_INFO.filter(pin => pin.coords.y > 100).map((pin) => (
                <g key={`pin-group-${pin.name}`}>
                    <rect x={pin.coords.x - 4} y={pin.coords.y - 4} width="8" height="8" className="fill-gray-300 dark:fill-[#BDBDBD]">
                        <title>{pin.description}</title>
                    </rect>
                     <text
                        x={pin.coords.x}
                        y={pin.coords.y + 16}
                        fontFamily="monospace"
                        fontSize="8"
                        className="fill-gray-800 dark:fill-gray-200"
                        textAnchor="middle"
                    >
                        {getShortArduinoPinName(pin.name)}
                    </text>
                </g>
            ))}
        </g>

        {/* Misc components */}
        <rect x="420" y="150" width="30" height="30" rx="2" className="fill-gray-700 dark:fill-[#424242]"/>
        <circle cx="80" cy="70" r="10" className="fill-gray-700 dark:fill-[#424242]"/>
        <circle cx="450" cy="70" r="10" className="fill-gray-700 dark:fill-[#424242]"/>

        <text x="470" y="310" className="fill-cyan-300 dark:fill-[#4DD0E1]" fontFamily="monospace" fontSize="14" textAnchor="end">Arduino R3</text>
    </svg>
);

export default ArduinoBoard;
