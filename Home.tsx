
import React, { useState, useEffect } from 'react';
import type { Board, Challenge, ProductKit, SavedProject } from './types';
import { getAllBoards } from './data/store';
import { CHALLENGES } from './data/challenges';
import { PRODUCT_KITS } from './data/shopData';
import { loadCommunityProjects } from './services/apiService';
import RaspberryPiBoard from './components/boards/RaspberryPiBoard';
import ArduinoBoard from './components/boards/ArduinoBoard';
import BlogPage from './components/BlogPage';
import ProductModal from './components/ProductModal';

interface HomeProps {
  onSelectBoardForLab: (boardId: string, options?: { challenge?: Challenge; project?: SavedProject }) => void;
  onGoToAcademy: () => void;
  onGoToAdmin: () => void;
}

const FallbackBoardIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5M19.5 8.25h-1.5m-15 3.75H3m18 0h-1.5M19.5 12h-1.5m0 3.75h-1.5m-15-3.75H3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Zm0 0a5.25 5.25 0 1 0 10.5 0 5.25 5.25 0 0 0-10.5 0Z" />
    </svg>
);


const BoardVisual: React.FC<{ boardComponent?: string }> = ({ boardComponent }) => {
    if (boardComponent === 'RaspberryPiBoard') {
        return <RaspberryPiBoard />;
    }
    if (boardComponent === 'ArduinoBoard') {
        return <ArduinoBoard />;
    }
    if (boardComponent && boardComponent.trim().startsWith('<svg')) {
        return <div className="w-full h-full text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: boardComponent }} />;
    }
    return <FallbackBoardIcon />;
};

const BoardCard: React.FC<{
  board: Board;
  onClick: () => void;
}> = ({ board, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 hover:ring-2 hover:ring-cyan-500 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 flex flex-col"
    aria-label={`Select ${board.name}`}
  >
    <div className="h-64 bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8 overflow-hidden">
        <BoardVisual boardComponent={board.boardComponent} />
    </div>
    <div className="p-6 text-left flex-grow">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{board.name}</h3>
      <p className="text-gray-600 dark:text-gray-400">{board.description}</p>
    </div>
  </button>
);

const ChallengeCard: React.FC<{ challenge: Challenge; onClick: () => void; }> = ({ challenge, onClick }) => {
    const difficultyColors = {
        Beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        Advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return (
        <button
            onClick={onClick}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-cyan-500/20 hover:ring-2 hover:ring-cyan-500 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-left p-6 w-full"
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{challenge.title}</h3>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${difficultyColors[challenge.difficulty]}`}>
                    {challenge.difficulty}
                </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{challenge.goal}</p>
        </button>
    );
};

const ProductCard: React.FC<{ kit: ProductKit; onClick: () => void; }> = ({ kit, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 hover:ring-2 hover:ring-cyan-500 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 flex flex-col text-left"
        >
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="absolute">{kit.imagePlaceholder}</span>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-md font-bold text-gray-900 dark:text-white mb-2">{kit.name}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 flex-grow">{kit.goal}</p>
            </div>
            <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 text-xs">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Price:</span>
                    <span className="font-mono bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">TBD</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                    <span>Shipping:</span>
                    <span>2-3 days</span>
                </div>
            </div>
        </button>
    );
};

const CommunityProjectCard: React.FC<{ project: SavedProject; onClick: () => void; }> = ({ project, onClick }) => {
    const board = getAllBoards().find(b => b.id === project.boardType);

    return (
        <button
            onClick={onClick}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-cyan-500/20 hover:ring-2 hover:ring-cyan-500 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-left p-6 w-full flex flex-col"
        >
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h3>
                    {board && <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{board.name}</span>}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{project.state.projectIdea}</p>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                <p>By: {project.author || 'Anonymous'}</p>
                <p>Shared on: {new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
        </button>
    );
};

const Home: React.FC<HomeProps> = ({ onSelectBoardForLab, onGoToAcademy, onGoToAdmin }) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [view, setView] = useState<'sandbox' | 'challenges' | 'blog' | 'shop' | 'community'>('sandbox');
  const [selectedKit, setSelectedKit] = useState<ProductKit | null>(null);
  const [communityProjects, setCommunityProjects] = useState<SavedProject[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);

  useEffect(() => {
    setBoards(getAllBoards());
  }, []);
  
  useEffect(() => {
    if (view === 'community') {
        const fetchCommunityProjects = async () => {
            setIsLoadingCommunity(true);
            try {
                const projects = await loadCommunityProjects(); 
                setCommunityProjects(projects);
            } catch (error) {
                console.error("Failed to load community projects", error);
            } finally {
                setIsLoadingCommunity(false);
            }
        };
        fetchCommunityProjects();
    }
  }, [view]);

  const challengesByBoard = CHALLENGES.reduce((acc, challenge) => {
    if (!acc[challenge.boardId]) {
        acc[challenge.boardId] = [];
    }
    acc[challenge.boardId].push(challenge);
    return acc;
  }, {} as Record<string, Challenge[]>);

  const renderContent = () => {
    if (view === 'community') {
      return (
          <>
              <div className="text-center mb-12">
                  <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3">Community Projects</h1>
                  <p className="text-xl text-gray-500 dark:text-gray-400">Explore projects shared by other users.</p>
              </div>
              {isLoadingCommunity ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              ) : communityProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                      {communityProjects.map(project => (
                          <CommunityProjectCard 
                              key={project.id} 
                              project={project} 
                              onClick={() => onSelectBoardForLab(project.boardType, { project })} 
                          />
                      ))}
                  </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No community projects have been shared yet. Be the first!</p>
              )}
          </>
      )
    }
    if (view === 'blog') {
        return <BlogPage />;
    }
    if (view === 'shop') {
        return (
            <>
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3">Hardware Kits Shop</h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400">Get everything you need to start building, all in one box.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
                    {PRODUCT_KITS.map(kit => (
                        <ProductCard key={kit.id} kit={kit} onClick={() => setSelectedKit(kit)} />
                    ))}
                </div>
            </>
        )
    }
    if (view === 'challenges') {
        return (
            <>
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3">Learning Challenges</h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400">Test your skills with guided projects.</p>
                </div>
                <div className="w-full max-w-5xl space-y-8">
                    {boards.map(board => (
                        challengesByBoard[board.id] && (
                            <div key={board.id}>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 border-b-2 border-cyan-500 pb-2">{board.name} Challenges</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {challengesByBoard[board.id].map(challenge => (
                                        <ChallengeCard key={challenge.id} challenge={challenge} onClick={() => onSelectBoardForLab(challenge.boardId, { challenge })} />
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </>
        );
    }

    return (
        <>
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3">AI Powered Interactive Hardware Lab™</h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">Choose your platform to start building in the sandbox.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl">
              {boards.map(board => (
                  <BoardCard
                    key={board.id}
                    board={board}
                    onClick={() => onSelectBoardForLab(board.id)}
                  />
              ))}
            </div>
        </>
    );
  };


  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
       <div className="absolute top-6 right-6 z-10 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shadow-md flex items-center space-x-1">
            <button onClick={() => setView('sandbox')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'sandbox' ? 'bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}>Sandbox</button>
            <button onClick={() => setView('community')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'community' ? 'bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}>Community</button>
            <button onClick={onGoToAcademy} className="px-3 py-1.5 text-sm font-semibold rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50">Academy</button>
            <button onClick={() => setView('challenges')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'challenges' ? 'bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}>Challenges</button>
            <button onClick={() => setView('blog')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'blog' ? 'bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}>Blog</button>
            <button onClick={() => setView('shop')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'shop' ? 'bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}>Shop</button>
            <button onClick={onGoToAdmin} className="px-3 py-1.5 text-sm font-semibold rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50">Admin</button>
      </div>
      <main className="flex flex-col items-center justify-center flex-grow w-full pt-16">
        {renderContent()}
      </main>
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400 shrink-0">
        <p>Copyright &copy; 2025 Mangesh Gulhane. All Rights Reserved.</p>
      </footer>
      {selectedKit && <ProductModal kit={selectedKit} onClose={() => setSelectedKit(null)} />}
    </div>
  );
};

export default Home;
