
import React, { useEffect, useState } from 'react';
import type { UnifiedGeminiResponse } from '../types';
import CollapsibleSection from './CollapsibleSection';
import CodeEditor from './CodeEditor';

interface CodePanelProps {
  projectData: UnifiedGeminiResponse | null;
  isLoading: boolean;
  theme: 'light' | 'dark';
  language: 'Python' | 'C++';
  isEditable?: boolean;
  userCode?: { filename: string; content: string; }[];
  onUserCodeChange?: (code: string, index: number) => void;
  onAnalyzeCode?: () => void;
  isAnalyzingCode?: boolean;
  codeErrors?: string[];
  isChallengeMode?: boolean;
}

const getLanguageFromFilename = (filename: string | undefined, boardLanguage: 'Python' | 'C++'): 'python' | 'cpp' => {
    if (!filename) return boardLanguage === 'Python' ? 'python' : 'cpp';
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension === 'py') return 'python';
    if (['ino', 'cpp', 'h'].includes(extension || '')) return 'cpp';
    return boardLanguage === 'Python' ? 'python' : 'cpp';
}

const FormattedExplanation: React.FC<{ text: string }> = ({ text }) => {
    const sections = text.split(/(?=###\s)/); // Split while keeping the delimiter
    return (
        <div>
            {sections.map((section, index) => {
                const titleMatch = section.match(/^###\s(.*?)\n/);
                const title = titleMatch ? titleMatch[1] : null;
                const content = title ? section.substring(titleMatch[0].length) : section;

                return (
                    <div key={index} className={title ? 'mt-4' : ''}>
                        {title && <h3 className="font-bold text-base mb-2">{title}</h3>}
                        {content.split('\n').map((paragraph, pIndex) => {
                            const trimmed = paragraph.trim();
                            if (trimmed.startsWith('* ')) {
                                return (
                                    <ul key={pIndex} className="list-disc list-inside ml-2 mb-2">
                                        <li>{trimmed.substring(2)}</li>
                                    </ul>
                                );
                            }
                            return <p key={pIndex} className="mb-2 last:mb-0">{paragraph}</p>;
                        })}
                    </div>
                );
            })}
        </div>
    );
};

const CodePanel: React.FC<CodePanelProps> = ({ 
    projectData, 
    isLoading, 
    theme,
    language,
    isEditable = false,
    userCode = [],
    onUserCodeChange,
    onAnalyzeCode,
    isAnalyzingCode = false,
    codeErrors = [],
    isChallengeMode = false
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [copiedStates, setCopiedStates] = useState<boolean[]>([]);
  const [explanationCopied, setExplanationCopied] = useState(false);

  const codeFiles = isEditable ? userCode : projectData?.code || [];

  useEffect(() => {
    setActiveTabIndex(0);
    setCopiedStates(new Array(codeFiles.length).fill(false));
  }, [codeFiles.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopiedStates(prev => prev.map(() => false));
    }, 2000);
    return () => clearTimeout(timer);
  }, [copiedStates]);

   useEffect(() => {
    if (explanationCopied) {
      const timer = setTimeout(() => setExplanationCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [explanationCopied]);

  useEffect(() => {
    setExplanationCopied(false);
  }, [projectData]);

  const handleCopyCode = (index: number) => {
    const codeToCopy = codeFiles[index]?.content;
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy);
      setCopiedStates(prev => {
          const newStates = [...prev];
          newStates[index] = true;
          return newStates;
      });
    }
  };

  const handleCopyExplanation = () => {
     if (projectData?.explanation) {
      navigator.clipboard.writeText(projectData.explanation);
      setExplanationCopied(true);
    }
  }

  if (isLoading && !isAnalyzingCode) {
    return (
       <aside className="bg-gray-100 dark:bg-gray-800 p-6 flex flex-col items-center justify-center text-center shadow-lg h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">Generating Project...</h2>
        <p className="text-sm text-gray-500 dark:text-gray-500">The AI is creating your code and wiring diagram.</p>
      </aside>
    );
  }

  if (codeFiles.length === 0 && !isChallengeMode) {
    return (
      <aside className="bg-gray-100 dark:bg-gray-800 p-6 flex flex-col items-center justify-center text-center shadow-lg h-full">
        <div className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">Project Details</h2>
        <p className="text-sm text-gray-500">Add components to the canvas and click "Generate Code" to see your project details here.</p>
      </aside>
    );
  }

  const { explanation, connections } = projectData || {};
  const activeFile = codeFiles[activeTabIndex];
  const codeTitle = language === 'Python' ? 'Python Code' : 'C++/Arduino Code';

  return (
    <aside className="bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 flex flex-col h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 shrink-0">{isChallengeMode ? 'Your Solution' : 'Your Project'}</h2>
      
        {!isChallengeMode && connections && connections.length > 0 && (
            <CollapsibleSection title="All Connections" defaultOpen={true}>
                <div className="bg-white/50 dark:bg-gray-900/50 p-3 rounded-md max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                    <thead className="text-left text-gray-500 dark:text-gray-400">
                    <tr>
                        <th className="p-1 font-semibold">From</th>
                        <th className="p-1 font-semibold">Pin</th>
                        <th className="p-1 font-semibold">To</th>
                        <th className="p-1 font-semibold">Pin</th>
                    </tr>
                    </thead>
                    <tbody>
                    {connections.map((conn, index) => (
                        <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="p-1 text-gray-700 dark:text-gray-300">{conn.from.ownerName}</td>
                        <td className="p-1 font-mono text-cyan-700 dark:text-cyan-300">{conn.from.pin}</td>
                        <td className="p-1 text-gray-700 dark:text-gray-300">{conn.to.ownerName}</td>
                        <td className="p-1 font-mono text-cyan-700 dark:text-cyan-300">{conn.to.pin}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </CollapsibleSection>
        )}
        
        <CollapsibleSection title={codeTitle} defaultOpen={true}>
            <div className="relative bg-gray-900 rounded-md overflow-hidden h-96 flex flex-col">
                {codeFiles.length > 1 && (
                    <div className="flex border-b border-gray-700 bg-gray-800 shrink-0">
                        {codeFiles.map((file, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTabIndex(index)}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                    activeTabIndex === index
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                                }`}
                            >
                                {file.filename}
                            </button>
                        ))}
                    </div>
                )}
                <div className="absolute top-2 right-2 z-10 flex space-x-2">
                    {isEditable && !isChallengeMode && onAnalyzeCode && activeTabIndex === 0 && (
                         <button
                            onClick={onAnalyzeCode}
                            disabled={isAnalyzingCode || isLoading}
                            className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors text-white disabled:bg-gray-500"
                        >
                            {isAnalyzingCode ? 'Analyzing...' : 'Analyze Code'}
                        </button>
                    )}
                    <button
                        onClick={() => handleCopyCode(activeTabIndex)}
                        className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-white"
                    >
                        {copiedStates[activeTabIndex] ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <div className="flex-grow min-h-0">
                    <CodeEditor 
                        code={activeFile?.content || ''} 
                        language={getLanguageFromFilename(activeFile?.filename, language)} 
                        theme={theme} 
                        isEditable={isEditable} 
                        onChange={(newContent) => onUserCodeChange?.(newContent, activeTabIndex)}
                    />
                </div>
            </div>
             {isEditable && codeErrors && codeErrors.length > 0 && activeTabIndex === 0 && (
              <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 text-sm" role="alert">
                <p className="font-bold mb-1">AI Code Analysis:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  {codeErrors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            )}
        </CollapsibleSection>

        {!isChallengeMode && explanation && (
            <CollapsibleSection title="Explanation" defaultOpen={true}>
                <div className="relative text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-white/50 dark:bg-gray-900/50 p-3 rounded-md max-h-48 overflow-y-auto">
                <button
                        onClick={handleCopyExplanation}
                        className="absolute top-2 right-2 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors z-10"
                    >
                        {explanationCopied ? 'Copied!' : 'Copy'}
                    </button>
                <FormattedExplanation text={explanation} />
                </div>
            </CollapsibleSection>
        )}
    </aside>
  );
};

export default CodePanel;
