
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext';

interface SaveProjectModalProps {
  onSave: (name: string, isPublic: boolean, author: string) => void;
  onClose: () => void;
  currentName: string;
}

const SaveProjectModal: React.FC<SaveProjectModalProps> = ({ onSave, onClose, currentName }) => {
  const [projectName, setProjectName] = useState(currentName);
  const [isPublic, setIsPublic] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();

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

  const handleSaveClick = () => {
    if (projectName.trim()) {
      onSave(projectName.trim(), isPublic, authorName.trim());
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveClick();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className={`rounded-lg shadow-2xl w-full max-w-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="p-6">
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Save Project
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="project-name" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Project Name
              </label>
              <input
                ref={inputRef}
                id="project-name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., My Awesome Blinker"
                className={`w-full p-2 border rounded-md text-base ${theme === 'dark' ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-500'} focus:ring-cyan-500`}
              />
            </div>
             <div>
                <label htmlFor="author-name" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Your Name (Optional)
                </label>
                <input
                    id="author-name"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Displayed in the community"
                    className={`w-full p-2 border rounded-md text-base ${theme === 'dark' ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-500'} focus:ring-cyan-500`}
                />
              </div>
              <div className="flex items-center">
                <input
                    id="share-community"
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="share-community" className={`ml-3 block text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Share this project with the community
                </label>
              </div>
          </form>
        </div>
        <div className={`px-6 py-4 rounded-b-lg flex justify-end space-x-3 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 bg-white hover:bg-gray-100 border border-gray-300'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={!projectName.trim()}
            className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveProjectModal;