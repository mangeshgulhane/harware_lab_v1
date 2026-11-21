import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Board, StoredComponent, SimulationValidationRule } from '../../types';
import { useTheme } from '../../ThemeContext';
import { iconMap } from '../../utils/iconMap';
import { getComponentDetails } from '../../services/apiService';

interface ComponentFormModalProps {
  onSave: (component: StoredComponent) => void;
  onClose: () => void;
  existingComponent: StoredComponent | null;
  allBoards: Board[];
}

const emptyComponent: Omit<StoredComponent, 'id'> = {
  name: '',
  Icon: 'LedIcon',
  description: '',
  voltage: '',
  category: '',
  pinout: [],
  supportedBoards: [],
  simulation: { isInput: false },
};

const ComponentFormModal: React.FC<ComponentFormModalProps> = ({ onSave, onClose, existingComponent, allBoards }) => {
    const [component, setComponent] = useState<Omit<StoredComponent, 'id'> & { id?: string }>(
        existingComponent ? { ...existingComponent } : emptyComponent
    );
    const [simulation, setSimulation] = useState(
        existingComponent?.simulation || { isInput: false }
    );
    const [validationRule, setValidationRule] = useState<Partial<SimulationValidationRule>>(
        existingComponent?.simulation?.validationRule || { type: 'number', errorMessage: '' }
    );
    const [isFetching, setIsFetching] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const iconKeys = Object.keys(iconMap);

    const isCustomIcon = component.Icon.trim().startsWith('<svg');

    const closeModal = useCallback(() => {
        if (!isFetching) onClose();
    }, [isFetching, onClose]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && closeModal();
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) closeModal();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeModal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setComponent({ ...component, [e.target.name]: e.target.value });
    };
    
    const handleIconChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setComponent({ ...component, Icon: e.target.value });
    };

    const handlePinoutChange = (index: number, field: 'pin' | 'description', value: string) => {
        const newPinout = [...(component.pinout || [])];
        newPinout[index] = { ...newPinout[index], [field]: value };
        setComponent({ ...component, pinout: newPinout });
    };

    const addPinout = () => setComponent({ ...component, pinout: [...(component.pinout || []), { pin: '', description: '' }] });
    const removePinout = (index: number) => setComponent({ ...component, pinout: (component.pinout || []).filter((_, i) => i !== index) });

    const handleBoardToggle = (boardId: string) => {
        const supportedBoards = component.supportedBoards || [];
        const newBoards = supportedBoards.includes(boardId)
            ? supportedBoards.filter(id => id !== boardId)
            : [...supportedBoards, boardId];
        setComponent({ ...component, supportedBoards: newBoards });
    };

    const handleSimulationChange = (field: keyof typeof simulation | keyof typeof validationRule, value: any) => {
        if (field === 'isInput') {
            setSimulation(prev => ({ ...prev, isInput: value }));
            if (!value) {
                setValidationRule({ type: 'number', errorMessage: '' });
            }
        } else {
             if (field === 'type') {
                // Reset conditional fields when type changes
                setValidationRule(prev => ({ type: value, errorMessage: prev.errorMessage || ''}));
            } else {
                setValidationRule(prev => ({ ...prev, [field]: value }));
            }
        }
    };
    
    const generateId = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const handleSaveClick = () => {
        if (!component.name.trim()) return;
        const finalId = component.id || generateId(component.name);
        
        const finalComponent: StoredComponent = {
            ...(component as StoredComponent),
            id: finalId,
            simulation: simulation.isInput 
                ? { isInput: true, validationRule: validationRule as SimulationValidationRule } 
                : { isInput: false },
        };
        onSave(finalComponent);
    };

    const handleFetchWithAI = async () => {
        if (!component.name.trim()) return;
        setIsFetching(true);
        try {
            const details = await getComponentDetails(component.name);
            setComponent(prev => ({
                ...prev,
                description: details.description || prev.description,
                voltage: details.voltage || prev.voltage,
                pinout: details.pinout || prev.pinout,
                Icon: details.svgIconString || prev.Icon,
            }));
        } catch (error) {
            console.error("Failed to fetch component details with AI", error);
            alert("Could not fetch details. Please try again or enter manually.");
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className={`rounded-lg shadow-2xl w-full max-w-2xl flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`} style={{ height: 'clamp(400px, 90vh, 800px)'}}>
                <div className="p-6 border-b" style={{borderColor: theme === 'dark' ? '#374151' : '#E5E7EB'}}>
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{existingComponent ? 'Edit' : 'Add'} Component</h2>
                </div>

                <div className="p-6 flex-grow overflow-y-auto space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Component Name</label>
                            <div className="flex">
                                <input id="name" name="name" type="text" value={component.name} onChange={handleChange} required className={`flex-grow p-2 border rounded-l-md text-base ${theme === 'dark' ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-500'} focus:ring-cyan-500`} />
                                <button type="button" onClick={handleFetchWithAI} disabled={isFetching || !component.name} className="px-3 py-1 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-r-md transition-colors flex items-center justify-center disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
                                    {isFetching ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : 'Fetch with AI'}
                                </button>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="Icon" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Icon</label>
                            <select id="Icon" name="Icon" value={isCustomIcon ? 'custom' : component.Icon} onChange={handleIconChange} className={`w-full p-2 border rounded-md text-base ${theme === 'dark' ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-500'} focus:ring-cyan-500`}>
                                {isCustomIcon && <option key="custom" value="custom">Custom (AI Generated)</option>}
                                {iconKeys.map(key => <option key={key} value={key}>{key.replace('Icon', '')}</option>)}
                            </select>
                            {isCustomIcon && (
                                <div className="mt-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                                    <div className="w-8 h-8 text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: component.Icon }} />
                                    <p className="ml-2 text-xs text-gray-500 dark:text-gray-400">AI-generated icon preview.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Description</label>
                        <textarea id="description" name="description" value={component.description} onChange={handleChange} rows={3} className={`w-full p-2 border rounded-md text-base ${theme === 'dark' ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-500'} focus:ring-cyan-500`}></textarea>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="voltage" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Voltage</label>
                            <input id="voltage" name="voltage" type="text" value={component.voltage} onChange={handleChange} className={`w-full p-2 border rounded-md text-base ${theme === 'dark' ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-500'} focus:ring-cyan-500`} />
                        </div>
                        <div>
                            <label htmlFor="category" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Category</label>
                            <input id="category" name="category" type="text" value={component.category} onChange={handleChange} required placeholder="e.g., Sensors" className={`w-full p-2 border rounded-md text-base ${theme === 'dark' ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-500'} focus:ring-cyan-500`} />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="width" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Canvas Width (px)
                        </label>
                        <input
                            id="width"
                            name="width"
                            type="number"
                            value={component.width || ''}
                            onChange={handleChange}
                            placeholder="e.g., 192"
                            className={`w-full p-2 border rounded-md text-base ${theme === 'dark' ? 'bg-gray-900 border-gray-600 text-gray-200 focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-800 focus:border-cyan-500'} focus:ring-cyan-500`}
                        />
                    </div>
                     <div>
                        <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Pinout</h4>
                        <div className="space-y-2">
                        {(component.pinout || []).map((p, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <input type="text" value={p.pin} onChange={e => handlePinoutChange(i, 'pin', e.target.value)} placeholder="Pin Name" className={`w-1/3 p-1 border rounded-md text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} />
                                <input type="text" value={p.description} onChange={e => handlePinoutChange(i, 'description', e.target.value)} placeholder="Description" className={`flex-grow p-1 border rounded-md text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} />
                                <button type="button" onClick={() => removePinout(i)} className="text-red-500 hover:text-red-700 p-1">&times;</button>
                            </div>
                        ))}
                        </div>
                        <button type="button" onClick={addPinout} className="mt-2 text-sm text-cyan-600 hover:text-cyan-500">+ Add Pin</button>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Simulation Settings</h4>
                        <label className="flex items-center space-x-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700 w-fit">
                            <input type="checkbox" checked={simulation.isInput} onChange={e => handleSimulationChange('isInput', e.target.checked)} className="rounded text-cyan-600 focus:ring-cyan-500" />
                            <span>Is Interactive Input?</span>
                        </label>
                        {simulation.isInput && (
                            <div className="p-3 border rounded-md space-y-3 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                                 <div>
                                    <label htmlFor="type" className="block text-xs font-medium mb-1">Validation Type</label>
                                    <select id="type" value={validationRule.type} onChange={e => handleSimulationChange('type', e.target.value)} className={`w-full p-1 border rounded-md text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                                        <option value="number">Number</option>
                                        <option value="regex">Regex</option>
                                    </select>
                                </div>
                                {validationRule.type === 'number' && (
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <label htmlFor="min" className="block text-xs font-medium mb-1">Min Value</label>
                                            <input type="number" id="min" value={validationRule.min ?? ''} onChange={e => handleSimulationChange('min', e.target.value ? parseFloat(e.target.value) : undefined)} className={`w-full p-1 border rounded-md text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="max" className="block text-xs font-medium mb-1">Max Value</label>
                                            <input type="number" id="max" value={validationRule.max ?? ''} onChange={e => handleSimulationChange('max', e.target.value ? parseFloat(e.target.value) : undefined)} className={`w-full p-1 border rounded-md text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
                                        </div>
                                    </div>
                                )}
                                {validationRule.type === 'regex' && (
                                    <div>
                                        <label htmlFor="pattern" className="block text-xs font-medium mb-1">Regex Pattern</label>
                                        <input type="text" id="pattern" value={validationRule.pattern ?? ''} onChange={e => handleSimulationChange('pattern', e.target.value)} placeholder="e.g., ^\d+$" className={`w-full p-1 border rounded-md text-sm font-mono ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="errorMessage" className="block text-xs font-medium mb-1">Error Message</label>
                                    <input type="text" id="errorMessage" value={validationRule.errorMessage} onChange={e => handleSimulationChange('errorMessage', e.target.value)} required className={`w-full p-1 border rounded-md text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Supported Boards</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {allBoards.map(board => (
                                <label key={board.id} className="flex items-center space-x-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                                    <input type="checkbox" checked={component.supportedBoards.includes(board.id)} onChange={() => handleBoardToggle(board.id)} className="rounded text-cyan-600 focus:ring-cyan-500" />
                                    <span>{board.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`px-6 py-4 rounded-b-lg flex justify-end space-x-3 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <button type="button" onClick={closeModal} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 bg-white hover:bg-gray-100 border border-gray-300'}`}>Cancel</button>
                    <button type="button" onClick={handleSaveClick} disabled={!component.name.trim()} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">Save Component</button>
                </div>
            </div>
        </div>
    );
};

export default ComponentFormModal;
