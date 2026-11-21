import React, { useState, useMemo, Suspense } from 'react';
import { getAdminData, saveAdminData } from '../../data/store';
import type { AdminData, Board, StoredComponent } from '../../types';
import BoardFormModal from './BoardFormModal';
import ComponentFormModal from './ComponentFormModal';
import { useTheme } from '../../ThemeContext';

const ApiInsightsDashboard = React.lazy(() => import('./ApiInsightsDashboard'));

interface AdminPageProps {
  onBack: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
    const [adminData, setAdminData] = useState<AdminData>(getAdminData());
    const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
    const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
    const [editingComponent, setEditingComponent] = useState<StoredComponent | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('hardware');
    const { theme } = useTheme();

    const handleSave = (newData: Partial<AdminData>) => {
        const updatedData = { ...adminData, ...newData };
        saveAdminData(updatedData);
        setAdminData(updatedData);
    };

    const handleSaveBoard = (board: Board) => {
        handleSave({ boards: [...adminData.boards, board] });
        setIsBoardModalOpen(false);
    };

    const handleDeleteBoard = (boardId: string) => {
        const boardToDelete = adminData.boards.find(b => b.id === boardId);
        if (!boardToDelete) return;

        if (window.confirm(`Are you sure you want to delete the board "${boardToDelete.name}"? This will also remove it from all supported components.`)) {
            const newBoards = adminData.boards.filter(b => b.id !== boardId);
            
            const newComponents = adminData.components.map(c => {
                if (c.supportedBoards.includes(boardId)) {
                    return {
                        ...c,
                        supportedBoards: c.supportedBoards.filter(bId => bId !== boardId)
                    };
                }
                return c;
            });

            handleSave({ boards: newBoards, components: newComponents });
        }
    };

    const handleBoardToComponent = (boardId: string) => {
        const board = adminData.boards.find(b => b.id === boardId);
        if (!board || !board.boardComponent) {
            alert("Board data is incomplete and cannot be converted.");
            return;
        }

        const newComponent: StoredComponent = {
            id: `${board.id}-as-component`,
            name: `${board.name} (Component)`,
            Icon: board.boardComponent,
            description: `A component version of the ${board.name} board for diagramming.`,
            voltage: board.language === 'Python' ? '3.3V / 5V' : '5V',
            pinout: board.pinout?.map(p => ({
                pin: p.name,
                description: p.name,
                x: p.x,
                y: p.y
            })) || [],
            supportedBoards: [],
            category: 'Boards',
            width: 256
        };

        const existingIndex = adminData.components.findIndex(c => c.id === newComponent.id);
        let newComponents;
        if (existingIndex > -1) {
            if (!window.confirm(`A component for "${board.name}" already exists. Overwrite it?`)) return;
            newComponents = [...adminData.components];
            newComponents[existingIndex] = newComponent;
        } else {
            newComponents = [...adminData.components, newComponent];
        }
        handleSave({ components: newComponents });
    };

    const handleSaveComponent = (component: StoredComponent) => {
        const existingIndex = adminData.components.findIndex(c => c.id === component.id);
        let newComponents;
        if (existingIndex > -1) {
            newComponents = [...adminData.components];
            newComponents[existingIndex] = component;
        } else {
            newComponents = [...adminData.components, component];
        }
        handleSave({ components: newComponents });
        setIsComponentModalOpen(false);
        setEditingComponent(null);
    };
    
    const handleDeleteComponent = (componentId: string) => {
        if(window.confirm(`Are you sure you want to delete component "${componentId}"?`)) {
            const newComponents = adminData.components.filter(c => c.id !== componentId);
            handleSave({ components: newComponents });
        }
    }
    
    const openNewComponentModal = () => {
        setEditingComponent(null);
        setIsComponentModalOpen(true);
    }
    
    const openEditComponentModal = (component: StoredComponent) => {
        setEditingComponent(component);
        setIsComponentModalOpen(true);
    }

    const filteredComponents = useMemo(() => {
        if (!searchTerm) return adminData.components;
        return adminData.components.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [adminData.components, searchTerm]);

    const TabButton = ({ tabId, children }: { tabId: string; children: React.ReactNode }) => {
        const isActive = activeTab === tabId;
        return (
             <button
                onClick={() => setActiveTab(tabId)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
                    isActive
                    ? 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-200' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700/50'
                }`}
            >
                {children}
            </button>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
             {isBoardModalOpen && <BoardFormModal onClose={() => setIsBoardModalOpen(false)} onSave={handleSaveBoard} />}
             {isComponentModalOpen && <ComponentFormModal onClose={() => {setIsComponentModalOpen(false); setEditingComponent(null);}} onSave={handleSaveComponent} existingComponent={editingComponent} allBoards={adminData.boards} />}
            <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md shrink-0 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Go back to home">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                {/* Left Vertical Nav */}
                <aside className="w-64 bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
                     <h2 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-4 px-2">Management</h2>
                     <nav className="space-y-2">
                         <TabButton tabId="hardware">
                           Hardware Management
                         </TabButton>
                         <TabButton tabId="apiInsights">
                           API Insights
                         </TabButton>
                     </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'hardware' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Boards Section */}
                            <section className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Boards</h2>
                                    <button onClick={() => setIsBoardModalOpen(true)} className="px-3 py-1 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors">Add Board</button>
                                </div>
                                <ul className="space-y-2 overflow-y-auto">
                                    {adminData.boards.map(board => (
                                        <li key={board.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center">
                                            <div>
                                                <p className="font-bold">{board.name}</p>
                                                <p className="text-xs font-mono text-gray-500 dark:text-gray-400">{board.id}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                 <button
                                                    onClick={() => handleBoardToComponent(board.id)}
                                                    className="text-sm text-green-500 hover:underline px-2 py-1 hover:bg-green-100 dark:hover:bg-green-900/50 rounded"
                                                    aria-label={`Make ${board.name} a component`}
                                                >
                                                    Make Component
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBoard(board.id)}
                                                    className="text-sm text-red-500 hover:underline px-2 py-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                                                    aria-label={`Delete ${board.name}`}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Components Section */}
                            <section className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
                                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                                    <h2 className="text-xl font-semibold">Components ({filteredComponents.length})</h2>
                                     <div className="flex-grow max-w-sm">
                                       <input 
                                            type="text"
                                            placeholder="Search components..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className={`w-full p-2 border rounded-md text-sm ${theme === 'dark' ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-500'} focus:ring-cyan-500`}
                                       />
                                    </div>
                                    <button onClick={openNewComponentModal} className="px-3 py-1 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors">Add Component</button>
                                </div>
                                <div className="flex-grow overflow-y-auto pr-2">
                                    <ul className="space-y-2">
                                        {filteredComponents.map(comp => (
                                            <li key={comp.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold">{comp.name}</p>
                                                    <p className="text-xs font-mono text-gray-500 dark:text-gray-400">{comp.id}</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {comp.supportedBoards.map(boardId => (
                                                            <span key={boardId} className="px-1.5 py-0.5 text-xs rounded-full bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200">{adminData.boards.find(b => b.id === boardId)?.name || boardId}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button onClick={() => openEditComponentModal(comp)} className="text-sm text-blue-500 hover:underline">Edit</button>
                                                    <button onClick={() => handleDeleteComponent(comp.id)} className="text-sm text-red-500 hover:underline">Delete</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>
                        </div>
                    )}
                    {activeTab === 'apiInsights' && (
                        <Suspense fallback={<div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div></div>}>
                            <ApiInsightsDashboard />
                        </Suspense>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;