import React from 'react';
import type { DroppedComponent } from '../types';

interface ComponentInspectorProps {
  component: DroppedComponent;
  position: { x: number; y: number };
}

const ComponentInspector: React.FC<ComponentInspectorProps> = ({ component, position }) => {
  if (!component.description) {
    return null;
  }

  return (
    <div
      className="absolute z-50 p-4 rounded-lg shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-300 dark:border-gray-600 w-64 text-sm transition-opacity duration-200 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(10px, 10px)', // Offset from cursor
      }}
    >
      <h3 className="font-bold text-base text-cyan-600 dark:text-cyan-400 mb-2">{component.displayName}</h3>
      {component.description && <p className="text-gray-700 dark:text-gray-300 mb-3">{component.description}</p>}
      {component.voltage && (
        <div className="mb-3">
          <span className="font-semibold text-gray-600 dark:text-gray-400">Voltage: </span>
          <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">{component.voltage}</span>
        </div>
      )}
      {component.pinout && component.pinout.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-1">Pinout:</h4>
          <ul className="space-y-1">
            {component.pinout.map((pin, index) => (
              <li key={index} className="flex justify-between">
                <span className="font-mono text-cyan-700 dark:text-cyan-300">{pin.pin}</span>
                <span className="text-gray-600 dark:text-gray-400 text-right">{pin.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComponentInspector;