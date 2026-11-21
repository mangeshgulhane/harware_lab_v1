
import React from 'react';
import type { UnifiedGeminiResponse } from './types';
import CodePanel from './components/CodePanel';

interface LabCodePanelProps {
  projectData: UnifiedGeminiResponse | null;
  isLoading: boolean;
  theme: 'light' | 'dark';
  language: 'Python' | 'C++';
  isEditable?: boolean;
  userCode?: { filename: string; content: string; }[];
  onUserCodeChange?: (code: string, index: number) => void;
  isChallengeMode?: boolean;
  onAnalyzeCode?: () => void;
  isAnalyzingCode?: boolean;
  codeErrors?: string[];
}

const LabCodePanel: React.FC<LabCodePanelProps> = (props) => {
    // This component now simply routes all props to the unified CodePanel.
    return <CodePanel {...props} />;
};

export default LabCodePanel;
