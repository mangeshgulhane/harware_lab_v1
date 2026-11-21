import React from 'react';
import type { Challenge } from '../types';
import { useTheme } from '../ThemeContext';

interface ChallengeSuccessModalProps {
  challenge: Challenge;
  onNext: () => void;
}

const ChallengeSuccessModal: React.FC<ChallengeSuccessModalProps> = ({ challenge, onNext }) => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-green-900 bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className={`rounded-lg shadow-2xl w-full max-w-md text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="p-8">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Challenge Complete!
            </h2>
            <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>You successfully completed "{challenge.title}".</p>
        
            <button
                onClick={onNext}
                className="w-full px-4 py-3 text-base font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors"
            >
                Back to Challenges
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeSuccessModal;
