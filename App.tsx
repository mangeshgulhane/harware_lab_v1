

import React, { useState, Suspense } from 'react';
import Home from './Home';
import { ThemeProvider } from './ThemeContext';
import { getAllBoards } from './data/store';
import type { Board, Challenge, SavedProject } from './types';

const AdminPage = React.lazy(() => import('./components/admin/AdminPage'));
const LabApp = React.lazy(() => import('./LabApp'));
const AcademyPage = React.lazy(() => import('./components/academy/Academy'));

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'lab' | 'admin' | 'academy'>('home');
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [initialProject, setInitialProject] = useState<SavedProject | null>(null);

  const handleSelectBoardForLab = (boardId: string, options?: { challenge?: Challenge; project?: SavedProject }) => {
    const board = getAllBoards().find(b => b.id === boardId);
    if (board) {
      setSelectedBoard(board);
      setActiveChallenge(options?.challenge || null);
      setInitialProject(options?.project || null);
      setView('lab');
    } else {
      console.error(`Board with id ${boardId} not found.`);
    }
  };
  
  const handleGoToAcademy = () => setView('academy');

  const handleGoToAdmin = () => setView('admin');

  const handleBackToHome = () => {
    setSelectedBoard(null);
    setActiveChallenge(null);
    setInitialProject(null);
    setView('home');
  };
  
  const loadingFallback = (
    <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
    </div>
  );

  let content;
  if (view === 'admin') {
     content = (
      <Suspense fallback={loadingFallback}>
        <AdminPage onBack={handleBackToHome} />
      </Suspense>
    );
  } else if (view === 'academy') {
    content = (
      <Suspense fallback={loadingFallback}>
        <AcademyPage onBack={handleBackToHome} />
      </Suspense>
    );
  }
  else if (view === 'lab' && selectedBoard) {
      content = (
        <Suspense fallback={loadingFallback}>
          <LabApp board={selectedBoard} challenge={activeChallenge} onBack={handleBackToHome} initialProject={initialProject} />
        </Suspense>
      );
  } else {
    content = <Home onSelectBoardForLab={handleSelectBoardForLab} onGoToAcademy={handleGoToAcademy} onGoToAdmin={handleGoToAdmin}/>;
  }
  
  return (
    <ThemeProvider>
      {content}
    </ThemeProvider>
  );
};

export default App;