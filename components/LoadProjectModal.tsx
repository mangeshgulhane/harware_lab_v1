import React, { useState, useEffect, useRef } from 'react';
import type { SavedProject } from '../types';
import { useTheme } from '../ThemeContext';
import { loadProjects } from '../services/apiService';

interface LoadProjectModalProps {
  onLoad: (project: SavedProject) => void;
  onDelete: (projectId: string) => Promise<boolean>;
  onClose: () => void;
  boardType: string;
}

const LoadProjectModal: React.FC<LoadProjectModalProps> = ({ onLoad, onDelete, onClose, boardType }) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedProjects = await loadProjects(boardType);
        const sorted = fetchedProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setProjects(sorted);
      } catch (e) {
        console.error("Failed to load projects from database", e);
        setError("Could not fetch projects. Please try again later.");
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [boardType]);

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
  
  const handleDeleteClick = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      const success = await onDelete(projectId);
      if (success) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
      }
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      );
    }
    if (error) {
       return (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }
    if (projects.length === 0) {
      return (
        <div className="text-center py-10">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            No saved projects found for this board type.
          </p>
        </div>
      );
    }
    return (
      <ul className="space-y-3">
        {projects.map(project => (
          <li key={project.id} className={`p-3 rounded-lg flex items-center justify-between transition-colors ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div>
              <p className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{project.name}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Saved on {new Date(project.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleDeleteClick(project.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${theme === 'dark' ? 'text-red-400 hover:bg-red-900/50' : 'text-red-600 hover:bg-red-100'}`}
              >
                Delete
              </button>
              <button
                onClick={() => onLoad(project)}
                className="px-3 py-1 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors"
              >
                Load
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className={`rounded-lg shadow-2xl w-full max-w-lg flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        style={{ height: 'clamp(300px, 80vh, 600px)'}}
      >
        <div className="p-6 border-b" style={{borderColor: theme === 'dark' ? '#374151' : '#E5E7EB'}}>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Load Project
          </h2>
        </div>
        <div className="p-6 flex-grow overflow-y-auto">
          {renderContent()}
        </div>
        <div className={`px-6 py-4 rounded-b-lg flex justify-end ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 bg-white hover:bg-gray-100 border border-gray-300'}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadProjectModal;