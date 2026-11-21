import React, { useEffect, useRef } from 'react';
import type { ChallengeEvaluationResponse } from '../types';
import { useTheme } from '../ThemeContext';

interface ChallengeFeedbackModalProps {
  result: (ChallengeEvaluationResponse & { type: 'evaluation' }) | { type: 'hint', hint: string };
  onClose: () => void;
}

const ChallengeFeedbackModal: React.FC<ChallengeFeedbackModalProps> = ({ result, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const isEvaluation = result.type === 'evaluation';
  const isCorrect = isEvaluation && result.isCorrect;
  const title = isEvaluation ? "Evaluation Result" : "Here's a Hint!";
  const content = isEvaluation ? result.feedback : result.hint;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className={`rounded-lg shadow-2xl w-full max-w-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            {isEvaluation && !isCorrect && (
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-4 shrink-0">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
              )
            }
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
          </div>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{content}</p>
        </div>
        <div className={`px-6 py-4 rounded-b-lg flex justify-end ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeFeedbackModal;
