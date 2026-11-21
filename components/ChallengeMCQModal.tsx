import React, { useState, useRef, useEffect } from 'react';
import type { Challenge } from '../types';
import { useTheme } from '../ThemeContext';

interface ChallengeMCQModalProps {
  challenge: Challenge;
  onCorrectAnswer: () => void;
  onClose: () => void;
}

const ChallengeMCQModal: React.FC<ChallengeMCQModalProps> = ({ challenge, onCorrectAnswer, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = () => {
    if (selectedOption === challenge.mcq.correctAnswerIndex) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={`rounded-lg shadow-2xl w-full max-w-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="p-6">
          <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">Challenge Prerequisite</p>
          <h2 className={`text-2xl font-bold mt-1 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {challenge.mcq.question}
          </h2>
          <div className="space-y-3">
            {challenge.mcq.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                disabled={feedback === 'correct'}
                className={`w-full text-left p-3 rounded-md border-2 transition-all duration-200 ${
                  selectedOption === index
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/50'
                    : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400 dark:hover:border-cyan-500'
                } ${feedback === 'correct' ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
          {feedback === 'incorrect' && (
            <p className="mt-4 text-sm text-red-500 text-center">Not quite, try another answer!</p>
          )}
          {feedback === 'correct' && (
            <p className="mt-4 text-sm text-green-500 text-center">Correct! You can now proceed to the lab.</p>
          )}
        </div>
        <div className={`px-6 py-4 rounded-b-lg flex justify-between items-center ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 bg-white hover:bg-gray-100 border border-gray-300'}`}
          >
            Back to Challenges
          </button>
          {feedback === 'correct' ? (
             <button
              onClick={onCorrectAnswer}
              className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              Proceed to Lab
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
              Submit Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeMCQModal;
