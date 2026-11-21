import React, { useEffect, useRef } from 'react';
import type { ProductKit } from '../types';
import { useTheme } from '../ThemeContext';

const ProductModal: React.FC<{ kit: ProductKit; onClose: () => void; }> = ({ kit, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={`rounded-lg shadow-2xl w-full max-w-3xl flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        style={{ height: 'clamp(400px, 90vh, 700px)'}}
      >
        <div className="p-6 border-b flex justify-between items-start" style={{borderColor: theme === 'dark' ? '#374151' : '#E5E7EB'}}>
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{kit.name}</h2>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{kit.goal}</p>
          </div>
          <button onClick={onClose} className="p-2 -m-2 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 text-2xl leading-none" aria-label="Close">&times;</button>
        </div>
        <div className="p-6 flex-grow overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">What's Inside:</h3>
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className={`text-xs uppercase ${theme === 'dark' ? 'text-gray-400 bg-gray-700' : 'text-gray-700 bg-gray-50'}`}>
                <tr>
                  <th scope="col" className="px-4 py-3">Sensor Type</th>
                  <th scope="col" className="px-4 py-3">Component</th>
                  <th scope="col" className="px-4 py-3">What it Teaches</th>
                </tr>
              </thead>
              <tbody>
                {kit.sensors.map((sensor, index) => (
                  <tr key={index} className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/50' : 'bg-white border-b-gray-200 hover:bg-gray-50'}`}>
                    <td className="px-4 py-4 font-medium whitespace-nowrap">{sensor.type}</td>
                    <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">{sensor.name}</td>
                    <td className="px-4 py-4">{sensor.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={`px-6 py-4 rounded-b-lg flex justify-end border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-gray-800">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
