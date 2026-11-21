import React, { useMemo, useState } from 'react';
import type { Component, WiringError, Challenge, UnifiedGeminiResponse, Connection } from '../types';
import { SunIcon, MoonIcon, FloppyDiskIcon, FolderOpenIcon } from './icons';
import { useTheme } from '../ThemeContext';

interface SidebarProps {
  onClear: () => void;
  onGenerateCode: () => void;
  isGenerating: boolean;
  hasDroppedComponents: boolean;
  canGenerateCode: boolean;
  availableComponents: Component[];
  projectIdea: string;
  onProjectIdeaChange: (idea: string) => void;
  onSuggestComponents: () => void;
  isSuggesting: boolean;
  onScaffoldProject: () => void;
  isScaffolding: boolean;
  remainingSuggestions: Record<string, number>;
  totalRemainingCount: number;
  unavailableSuggestions: string[];
  boardName?: string;
  onBack?: () => void;
  // Project management props
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onSave: () => void;
  onLoad: () => void;
  wiringErrors: WiringError[];
  // Challenge props
  challenge: Challenge | null;
  isMcqPassed: boolean;
  onCheckSolution: () => void;
  onGetHint: () => void;
  isCheckingSolution: boolean;
  isGettingHint: boolean;
  userConnections: Connection[];
  // Search props
  componentSearchTerm: string;
  onComponentSearchChange: (term: string) => void;
}

const DraggableComponent: React.FC<{ component: Component; suggestionCount: number }> = ({ component, suggestionCount }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
  };

  const highlightClass = suggestionCount > 0 ? 'ring-2 ring-cyan-400' : '';

  return (
    <div className="flex flex-col items-center">
        <div
          draggable
          onDragStart={handleDragStart}
          className={`relative flex items-center justify-center p-3 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-grab active:cursor-grabbing hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 ${highlightClass}`}
          aria-label={`Drag ${component.name}`}
        >
          {suggestionCount > 0 && (
            <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white shadow">
                {suggestionCount}
            </div>
          )}
          <component.Icon className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
        </div>
        <p className="mt-2 text-center text-xs text-gray-600 dark:text-gray-400 w-16 break-words h-12 flex items-start justify-center">
            {component.name}
        </p>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ 
    onClear, 
    onGenerateCode, 
    isGenerating,
    hasDroppedComponents, 
    canGenerateCode,
    availableComponents,
    projectIdea,
    onProjectIdeaChange,
    onSuggestComponents,
    isSuggesting,
    onScaffoldProject,
    isScaffolding,
    remainingSuggestions,
    totalRemainingCount,
    unavailableSuggestions,
    boardName,
    onBack,
    projectName,
    onProjectNameChange,
    onSave,
    onLoad,
    wiringErrors,
    challenge,
    isMcqPassed,
    onCheckSolution,
    onGetHint,
    isCheckingSolution,
    isGettingHint,
    userConnections,
    componentSearchTerm,
    onComponentSearchChange,
}) => {
    const { theme, toggleTheme } = useTheme();
    
    const anyLoading = isGenerating || isSuggesting || isScaffolding || isCheckingSolution || isGettingHint;

    const helperText = useMemo(() => {
        if (anyLoading && isGenerating) return 'Generating project...';
        if (challenge) {
            if (!isMcqPassed) return 'Answer the question to begin the challenge.';
            if (!hasDroppedComponents) return 'Drag components from the list to start building.';
            if (userConnections.length === 0) return 'Wire your circuit or click "Wire for Me".';
            return 'Write your code and click "Check My Solution".';
        }
        if (!hasDroppedComponents) return 'Drag components onto the canvas to start.';
        if (!canGenerateCode) return 'Add all suggested components to continue.';
        return 'Click Generate when you are ready.';
    }, [hasDroppedComponents, canGenerateCode, isGenerating, challenge, userConnections, isMcqPassed, anyLoading]);

    const groupedComponents = useMemo(() => {
        return availableComponents.reduce((acc, component) => {
            const category = component.category || 'Miscellaneous';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(component);
            return acc;
        }, {} as Record<string, Component[]>);
    }, [availableComponents]);

    const categoryOrder = ['Input Devices', 'Output Devices', 'Sensors', 'Actuators', 'Drivers', 'Power'];
    const sortedCategories = Object.keys(groupedComponents).sort((a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b); // Sort unknown categories alphabetically
        if (indexA === -1) return 1; // Put unknown categories at the end
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

  return (
    <aside className="w-80 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col h-full shadow-lg shrink-0">
        <div className="flex items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            {onBack && (
              <button onClick={onBack} className="mr-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Go back" disabled={anyLoading}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <input
              type="text"
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
              className="text-lg font-bold bg-transparent text-gray-900 dark:text-white truncate w-full focus:ring-1 focus:ring-cyan-500 focus:bg-white dark:focus:bg-gray-700 rounded-md -ml-1 px-1"
              aria-label="Project Name"
              disabled={anyLoading}
            />
             <div className="ml-auto flex items-center">
                <button
                  onClick={onSave}
                  className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Save project"
                  disabled={anyLoading || !!challenge}
                  hidden={!!challenge}
                >
                    <FloppyDiskIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>
                 <button
                  onClick={onLoad}
                  className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Load project"
                  disabled={anyLoading || !!challenge}
                  hidden={!!challenge}
                >
                    <FolderOpenIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <SunIcon className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <MoonIcon className="w-5 h-5 text-gray-700" />
                  )}
                </button>
            </div>
        </div>
        
        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            {challenge ? (
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Challenge Goal</label>
                    <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 bg-white/50 dark:bg-gray-900/50 p-3 rounded-md">{challenge.goal}</p>
                    <div className="flex space-x-2 mt-2">
                         <button
                            onClick={onGenerateCode}
                            disabled={isGenerating || isCheckingSolution || isGettingHint || !hasDroppedComponents || !isMcqPassed}
                            className="flex-1 px-4 py-2 text-sm font-semibold bg-cyan-600 text-white hover:bg-cyan-700 rounded-md transition-colors flex items-center justify-center disabled:bg-gray-400 dark:disabled:bg-gray-600"
                        >
                           {isGenerating ? 'Wiring...' : 'Wire for Me'}
                        </button>
                        <button
                            onClick={onGetHint}
                            disabled={isGettingHint || isCheckingSolution || !isMcqPassed}
                            className="flex-1 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors flex items-center justify-center disabled:bg-gray-400 dark:disabled:bg-gray-600"
                        >
                            {isGettingHint ? '...' : 'Hint'}
                        </button>
                        <button 
                            onClick={onClear} 
                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded-md transition-colors text-white disabled:bg-gray-400"
                            disabled={anyLoading}
                            aria-label="Start Over"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="project-idea" className="block text-sm font-medium text-gray-600 dark:text-gray-300">Have an Idea?</label>
                        {totalRemainingCount > 0 && (
                            <span className="text-xs font-medium text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/50 px-2 py-0.5 rounded-full">
                                {totalRemainingCount} components to add
                            </span>
                        )}
                    </div>
                    <textarea
                        id="project-idea"
                        rows={4}
                        value={projectIdea}
                        onChange={(e) => onProjectIdeaChange(e.target.value)}
                        placeholder="e.g., a blinking light or a moving servo"
                        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm text-gray-800 dark:text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                        disabled={anyLoading}
                    />
                     <div className="flex space-x-2 mt-2">
                        <button
                            onClick={onSuggestComponents}
                            disabled={isSuggesting || isScaffolding || !projectIdea}
                            className="flex-1 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors flex items-center justify-center disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSuggesting ? '...' : 'Suggest'}
                        </button>
                         <button
                            onClick={onScaffoldProject}
                            disabled={isScaffolding || isSuggesting || !projectIdea || isGenerating}
                            className="flex-1 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors flex items-center justify-center disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            {isScaffolding ? '...' : 'Scaffold'}
                        </button>
                         <button 
                            onClick={onClear} 
                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded-md transition-colors text-white disabled:bg-red-400 dark:disabled:bg-red-900 disabled:text-gray-200 dark:disabled:text-gray-500 disabled:cursor-not-allowed"
                            disabled={anyLoading}
                            aria-label="Start a new project"
                        >
                            New
                        </button>
                    </div>
                </>
            )}
            
            {wiringErrors.length > 0 && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200" role="alert">
                    <div className="flex">
                        <div className="py-1 shrink-0"><svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm-1 5v4h2V7H9zm0 6v2h2v-2H9z"/></svg></div>
                        <div>
                            <p className="font-bold text-sm mb-1">Wiring Validation</p>
                            <ul className="list-disc list-inside text-xs space-y-1">
                                {wiringErrors.map((error, i) => <li key={i}><strong>{error.type}:</strong> {error.message}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            {unavailableSuggestions.length > 0 && (
                <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-900/30 border-l-4 border-orange-500 text-orange-800 dark:text-orange-200" role="alert">
                     <div className="flex">
                        <div className="py-1 shrink-0"><svg className="fill-current h-6 w-6 text-orange-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm-1 5v4h2V7H9zm0 6v2h2v-2H9z"/></svg></div>
                        <div>
                            <p className="font-bold text-sm mb-1">Unavailable Components</p>
                            <p className="text-xs mb-2">The AI suggested some components not in our inventory:</p>
                            <ul className="list-disc list-inside text-xs mb-2 font-mono">
                                {unavailableSuggestions.map(id => <li key={id}>{id}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <h2 className="text-base font-semibold text-gray-500 dark:text-gray-400 mb-2">{challenge ? 'Available Components' : 'Component List'}</h2>
        <div className="relative mb-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </span>
            <input
                type="search"
                value={componentSearchTerm}
                onChange={(e) => onComponentSearchChange(e.target.value)}
                placeholder="Search components..."
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-10 pr-4 text-sm text-gray-800 dark:text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                disabled={anyLoading}
                aria-label="Search for components"
            />
        </div>
        <div className="flex-grow overflow-y-auto pr-2 -mr-2">
          {sortedCategories.map(category => (
            <div key={category} className="mb-6">
                <h3 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-2 px-1">{category}</h3>
                <div className="grid grid-cols-3 gap-x-3 gap-y-12">
                    {groupedComponents[category].map((component) => (
                        <DraggableComponent 
                            key={component.id} 
                            component={component} 
                            suggestionCount={remainingSuggestions[component.id] || 0}
                        />
                    ))}
                </div>
            </div>
          ))}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {!challenge && (
              <button
                onClick={onGenerateCode}
                disabled={anyLoading || !canGenerateCode}
                className="w-full px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors flex items-center justify-center disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                  {isGenerating ? '...' : 'Generate Code'}
              </button>
            )}
            
            {challenge && (
                 <button
                    onClick={onCheckSolution}
                    disabled={isCheckingSolution || isGettingHint || !hasDroppedComponents || userConnections.length === 0}
                    className="w-full px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors flex items-center justify-center disabled:bg-gray-400 dark:disabled:bg-gray-600"
                >
                    {isCheckingSolution ? 'Checking...' : 'Check My Solution'}
                </button>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
                {helperText}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                Copyright &copy; 2025 Mangesh Gulhane. All Rights Reserved.
            </p>
        </div>
    </aside>
  );
};

export default Sidebar;