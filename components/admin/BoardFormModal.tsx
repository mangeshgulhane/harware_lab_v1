import React, { useState, useEffect, useRef } from 'react';
import type { Board } from '../../types';
import { useTheme } from '../../ThemeContext';
import { getBoardDetails, getBoardNameSuggestions } from '../../services/apiService';

interface BoardFormModalProps {
  onSave: (board: Board) => void;
  onClose: () => void;
}

const BoardFormModal: React.FC<BoardFormModalProps> = ({ onSave, onClose }) => {
  const [board, setBoard] = useState<Partial<Board>>({ name: '', description: '', boardComponent: '', language: 'C++', pinout: [] });
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [svgOptions, setSvgOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isFetching) onClose();
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isFetching) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, isFetching]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBoard({ ...board, [e.target.name]: e.target.value });
  };
  
  const generateId = (name: string) => {
      return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  const handleSaveClick = () => {
    if (board.name?.trim() && board.language && board.boardComponent) {
      onSave({ 
          ...board, 
          id: generateId(board.name),
          name: board.name,
          description: board.description || '',
      } as Board);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveClick();
  };

  const handleFetchWithAI = async () => {
    if (!board.name?.trim()) return;
    setIsFetching(true);
    setError(null);
    setSuggestions([]);
    setSvgOptions([]);
    try {
        const details = await getBoardDetails(board.name, additionalPrompt);
        setBoard(prev => ({
            ...prev,
            description: details.description,
            language: details.language,
            pinout: details.pinout,
            boardComponent: details.svgSchematicStrings?.[0] || '',
        }));
        setSvgOptions(details.svgSchematicStrings || []);
    } catch (fetchError) {
        console.error(fetchError);
        setError((fetchError as Error).message);
        try {
            const boardSuggestions = await getBoardNameSuggestions(board.name);
            setSuggestions(boardSuggestions);
        } catch (suggestionError) {
            console.error("Failed to get suggestions either:", suggestionError);
        }
    } finally {
        setIsFetching(false);
    }
  };
  
  const handleSelectSvg = (svgString: string) => {
      setBoard(prev => ({ ...prev, boardComponent: svgString }));
  };

  const handleSuggestionClick = (suggestion: string) => {
      setBoard(prev => ({ ...prev, name: suggestion }));
      setSuggestions([]);
      setError(null);
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className={`rounded-lg shadow-2xl w-full max-w-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <form onSubmit={handleFormSubmit}>
          <div className="p-6">
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Add New Board</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Board Name</label>
                <div className="flex">
                    <input id="name" name="name" type="text" value={board.name} onChange={handleChange} required className={`flex-grow p-2 border rounded-l-md text-base ${theme === 'dark' ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-500'} focus:ring-cyan-500`} />
                    <button type="button" onClick={handleFetchWithAI} disabled={isFetching || !board.name} className="px-3 py-1 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-r-md transition-colors flex items-center justify-center disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed w-32">
                        {isFetching ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : 'Fetch with AI'}
                    </button>
                </div>
                {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
                {suggestions.length > 0 && (
                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <p className="text-xs font-semibold mb-1">Did you mean?</p>
                        <ul className="flex flex-wrap gap-2">
                            {suggestions.map(s => (
                                <li key={s}>
                                    <button type="button" onClick={() => handleSuggestionClick(s)} className="px-2 py-1 text-xs bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 rounded-full hover:bg-cyan-300 dark:hover:bg-cyan-700">{s}</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
              </div>
               <div>
                <label htmlFor="additionalPrompt" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Additional AI Prompt (Optional)
                </label>
                <textarea
                    id="additionalPrompt"
                    name="additionalPrompt"
                    value={additionalPrompt}
                    onChange={(e) => setAdditionalPrompt(e.target.value)}
                    rows={2}
                    placeholder="e.g., 'Make the board color blue', 'Emphasize the USB-C port'"
                    className={`w-full p-2 border rounded-md text-base ${theme === 'dark' ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-500'} focus:ring-cyan-500`}
                />
              </div>
              <div>
                <label htmlFor="description" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Description</label>
                <textarea id="description" name="description" value={board.description} onChange={handleChange} rows={3} className={`w-full p-2 border rounded-md text-base ${theme === 'dark' ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-500'} focus:ring-cyan-500`}></textarea>
              </div>
              {svgOptions.length > 0 && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Select a Schematic</label>
                <div className="grid grid-cols-3 gap-2">
                  {svgOptions.map((svg, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => handleSelectSvg(svg)}
                      className={`p-2 border-2 rounded-md transition-colors ${
                        board.boardComponent === svg
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/50'
                          : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400'
                      }`}
                    >
                      <div className="w-full h-auto text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: svg }} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div>
          <div className={`px-6 py-4 rounded-b-lg flex justify-end space-x-3 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <button type="button" onClick={onClose} disabled={isFetching} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors disabled:opacity-50 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 bg-white hover:bg-gray-100 border border-gray-300'}`}>Cancel</button>
            <button type="submit" disabled={!board.name?.trim() || isFetching} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">Save Board</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardFormModal;