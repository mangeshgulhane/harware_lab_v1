import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import LabCanvas from './LabCanvas';
import LabCodePanel from './LabCodePanel';
import { getComponentsForBoard, validateConnections } from './data/store';
import { 
    getArduinoUnifiedProjectInfo, 
    getComponentSuggestionsForArduino, 
    getComponentSuggestionsForPi, 
    getUnifiedProjectInfo, 
    getProjectScaffoldForPi, 
    getProjectScaffoldForArduino, 
    evaluateChallengeSolution, 
    getChallengeHint, 
    updateSimulationFromCode,
    saveProject,
    loadProjects,
    deleteProject,
    checkProjectFeasibility
} from './services/apiService';
import type { DroppedComponent, UnifiedGeminiResponse, ComponentState, SimulationStep, SavedProject, Component, Board, WiringError, ProjectScaffoldResponse, Challenge, Connection, ChallengeEvaluationResponse } from './types';
import { useTheme } from './ThemeContext';
import SaveProjectModal from './components/SaveProjectModal';
import LoadProjectModal from './components/LoadProjectModal';
import ChallengeFeedbackModal from './components/ChallengeFeedbackModal';
import ChallengeSuccessModal from './components/ChallengeSuccessModal';
import ChallengeMCQModal from './components/ChallengeMCQModal';
import { BREADBOARD_WIDTH } from './data/boardData';
import { PowerSupplyIcon } from './components/icons';

interface LabAppProps {
  board: Board;
  challenge: Challenge | null;
  onBack: () => void;
  initialProject?: SavedProject | null;
}

const GRID_SIZE = 20;

const DEFAULT_POWER_SUPPLY: DroppedComponent = {
    id: 'power-supply',
    name: 'Power Supply',
    Icon: PowerSupplyIcon,
    description: "Provides power to the circuit. Connect V+ to the board's power input (e.g., 5V or VIN) and GND to a ground pin.",
    voltage: '5V-12V',
    category: 'Power',
    pinout: [
      { pin: 'V+', description: 'Positive Voltage Output' },
      { pin: 'GND', description: 'Ground' },
    ],
    x: 200,
    y: 600,
    instanceId: 'power-supply-default',
    displayName: 'Power Supply',
};

const getNewProjectState = (): SavedProject['state'] => ({
    droppedComponents: [DEFAULT_POWER_SUPPLY],
    projectData: null,
    projectIdea: '',
    suggestedComponents: {},
});

const FeasibilityErrorModal: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
    const { theme } = useTheme();
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className={`rounded-lg shadow-2xl w-full max-w-sm text-center p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Project Not Possible</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors w-full"
                >
                    OK
                </button>
            </div>
        </div>
    );
};


const LabApp: React.FC<LabAppProps> = ({ board, challenge, onBack, initialProject }) => {
  const allAvailableComponents = useMemo(() => getComponentsForBoard(board.id), [board.id]);
  const [availableComponents, setAvailableComponents] = useState<Component[]>(allAvailableComponents);
  
  const [currentProject, setCurrentProject] = useState<Omit<SavedProject, 'state'>>({
      id: `proj_${Date.now()}`,
      name: challenge?.title || 'Untitled Project',
      boardType: board.id,
      createdAt: new Date().toISOString(),
  });
  const [projectState, setProjectState] = useState<SavedProject['state']>(getNewProjectState());
  const { droppedComponents, projectData, projectIdea, suggestedComponents } = projectState;

  const [isGenerating, setIsGenerating] = useState(false);
  const [isScaffolding, setIsScaffolding] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [unavailableSuggestions, setUnavailableSuggestions] = useState<string[]>([]);
  const [wiringErrors, setWiringErrors] = useState<WiringError[]>([]);
  const [feasibilityError, setFeasibilityError] = useState<string | null>(null);

  const isChallengeMode = !!challenge;

  const [isMcqPassed, setIsMcqPassed] = useState(!challenge);
  const [userConnections, setUserConnections] = useState<Connection[]>([]);
  const [userCode, setUserCode] = useState<{ filename: string; content: string; }[]>([]);
  const [isCheckingSolution, setIsCheckingSolution] = useState(false);
  const [isGettingHint, setIsGettingHint] = useState(false);
  const [challengeFeedback, setChallengeFeedback] = useState<(ChallengeEvaluationResponse & { type: 'evaluation' }) | { type: 'hint', hint: string } | null>(null);
  const [isChallengeComplete, setIsChallengeComplete] = useState(false);
  
  const [isAnalyzingCode, setIsAnalyzingCode] = useState(false);
  const [codeErrors, setCodeErrors] = useState<string[]>([]);
  const [componentSearchTerm, setComponentSearchTerm] = useState('');

  const [panelWidth, setPanelWidth] = useState(450);
  const [isResizing, setIsResizing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [componentStates, setComponentStates] = useState<Record<string, ComponentState>>({});
  const [userInputs, setUserInputs] = useState<Record<string, string | number>>({});
  const [simulationInputErrors, setSimulationInputErrors] = useState<Record<string, string>>({});
  const simulationTimeoutsRef = useRef<number[]>([]);
  const { theme } = useTheme();
  
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const buzzerNodesRef = useRef<Record<string, { oscillator: OscillatorNode, gainNode: GainNode }>>({});
  
  const filteredAvailableComponents = useMemo(() => {
    if (!componentSearchTerm) {
        return availableComponents;
    }
    const lowerCaseTerm = componentSearchTerm.toLowerCase();
    return availableComponents.filter(component => 
        component.name.toLowerCase().includes(lowerCaseTerm) ||
        component.category.toLowerCase().includes(lowerCaseTerm)
    );
  }, [availableComponents, componentSearchTerm]);

  useEffect(() => {
    if (challenge) {
        const challengeComponentIds = new Set(challenge.availableComponentIds);
        setAvailableComponents(allAvailableComponents.filter(c => challengeComponentIds.has(c.id) || c.id === 'breadboard'));
        setProjectIdea(challenge.goal);
    } else {
        setAvailableComponents(allAvailableComponents);
    }
    setIsMcqPassed(!challenge);
    setUserCode(challenge ? [{ filename: board.language === 'Python' ? 'main.py' : 'sketch.ino', content: board.language === 'Python' ? '# Your Python code here\n' : '// Your C++ code here\n' }] : []);
    setUserConnections([]);
  }, [board.id, board.language, challenge, allAvailableComponents]);

  useEffect(() => {
    if (projectData?.code) {
        setUserCode(projectData.code);
    } else if (challenge) {
        // In challenge mode, don't clear user code unless explicitly reset.
    } else {
        setUserCode([]);
    }
  }, [projectData?.code, challenge]);

  useEffect(() => {
    const connectionsToValidate = challenge ? userConnections : projectData?.connections;

    if (connectionsToValidate && connectionsToValidate.length > 0) {
        const componentsToValidate = (projectData && 'placedComponents' in projectData && Array.isArray((projectData as any).placedComponents))
            ? (projectData as ProjectScaffoldResponse).placedComponents.map(pc => {
                const details = allAvailableComponents.find(c => c.id === pc.id);
                if (!details) return null;
                return { ...details, ...pc, x: pc.x, y: pc.y, instanceId: pc.instanceId, displayName: pc.displayName };
              }).filter((c): c is DroppedComponent => c !== null)
            : droppedComponents;

        const errors = validateConnections(connectionsToValidate, componentsToValidate, board);
        setWiringErrors(errors);
    } else {
        setWiringErrors([]);
    }
  }, [projectData, droppedComponents, userConnections, challenge, allAvailableComponents, board]);
  
  const handleLoadProject = useCallback((project: SavedProject) => {
      clearSimulation();
      setGenerationError(null);
      setCurrentProject({
          id: project.id,
          name: project.name,
          boardType: project.boardType,
          createdAt: project.createdAt,
          author: project.author,
          isPublic: project.isPublic,
      });
      
      const componentCounts: { [key: string]: number } = {};
      
      // Re-hydrate components with their Icon functions and ensure displayName exists.
      const hydratedComponents = (project.state.droppedComponents || []).map(savedComp => {
          const fullComponentDef = allAvailableComponents.find(c => c.id === savedComp.id);
          if (!fullComponentDef) {
              console.warn(`Component with id "${savedComp.id}" not found in current board configuration.`);
              return null; // Component definition not found, skip it.
          }
          
          let displayName = savedComp.displayName;
          if (!displayName) {
              const baseName = fullComponentDef.name;
              const count = (componentCounts[savedComp.id] || 0) + 1;
              componentCounts[savedComp.id] = count;
              displayName = `${baseName} ${count}`;
          }

          return {
              ...fullComponentDef, // This brings back the Icon function and other defaults
              ...savedComp,       // This overwrites with saved positions, instanceId, etc.
              displayName,        // Ensure displayName is set
          };
      }).filter((c): c is DroppedComponent => c !== null);

      setUserCode(project.state.projectData?.code || []);
      setProjectState({
          ...project.state,
          droppedComponents: hydratedComponents,
          suggestedComponents: project.state.suggestedComponents || {},
      });
      setWiringErrors([]);
      setIsLoadModalOpen(false);
  }, [allAvailableComponents]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (initialProject) {
        handleLoadProject(initialProject);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProject]);


  const setDroppedComponents = (updater: React.SetStateAction<DroppedComponent[]>) => {
      setProjectState(prev => ({ ...prev, droppedComponents: typeof updater === 'function' ? updater(prev.droppedComponents) : updater }));
  };
  
  const setProjectData = (updater: React.SetStateAction<UnifiedGeminiResponse | null>) => {
      setProjectState(prev => {
        const newProjectData = typeof updater === 'function'
            ? (updater as (prevState: UnifiedGeminiResponse | null) => UnifiedGeminiResponse | null)(prev.projectData)
            : updater;
        return {...prev, projectData: newProjectData };
      });
  };

  const setProjectIdea = (idea: string) => {
      setProjectState(prev => ({...prev, projectIdea: idea}));
  };
  const setSuggestedComponents = (components: Record<string, number>) => {
      setProjectState(prev => ({...prev, suggestedComponents: components}));
  };

  const handleUserInput = (instanceId: string, value: string) => {
    setUserInputs(prev => ({ ...prev, [instanceId]: value }));

    const component = droppedComponents.find(c => c.instanceId === instanceId);
    if (component?.id === 'button') {
        setComponentStates(prev => ({
            ...prev,
            [instanceId]: {
                ...prev[instanceId],
                isPressed: value === '1'
            }
        }));
    } else if (component?.id === 'keypad-4x4') {
        setComponentStates(prev => ({
            ...prev,
            [instanceId]: {
                ...prev[instanceId],
                pressedKey: value
            }
        }));
    }
    const rule = component?.simulation?.validationRule;

    if (rule) {
        let isValid = true;
        let errorMessage = '';

        if (rule.type === 'number') {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || (rule.min !== undefined && numValue < rule.min) || (rule.max !== undefined && numValue > rule.max)) {
                isValid = false;
                errorMessage = rule.errorMessage;
            }
        } else if (rule.type === 'regex' && rule.pattern) {
            try {
                const regex = new RegExp(rule.pattern);
                if (!regex.test(value)) {
                    isValid = false;
                    errorMessage = rule.errorMessage;
                }
            } catch (e) {
                console.error("Invalid regex pattern in component definition:", e);
                isValid = false;
                errorMessage = "Invalid validation pattern.";
            }
        }

        setSimulationInputErrors(prev => {
            const newErrors = { ...prev };
            if (!isValid) {
                newErrors[instanceId] = errorMessage;
            } else {
                delete newErrors[instanceId];
            }
            return newErrors;
        });
    }
  };
  
  useEffect(() => {
    if (!isSimulating || !projectData?.simulationTriggers || Object.keys(simulationInputErrors).length > 0) return;

    setComponentStates(prevStates => {
      const newStates = { ...prevStates };
      let stateChanged = false;

      projectData.simulationTriggers!.forEach(trigger => {
        const sourceValue = userInputs[trigger.source.instanceId];
        if (sourceValue === undefined) return;

        const numericSource = parseFloat(String(sourceValue));
        const numericTrigger = parseFloat(String(trigger.source.value));

        let conditionMet = false;
        if (!isNaN(numericSource) && !isNaN(numericTrigger)) {
            switch (trigger.source.condition) {
                case '>': conditionMet = numericSource > numericTrigger; break;
                case '<': conditionMet = numericSource < numericTrigger; break;
                case '>=': conditionMet = numericSource >= numericTrigger; break;
                case '<=': conditionMet = numericSource <= numericTrigger; break;
                case '==': conditionMet = numericSource == numericTrigger; break;
                case '!=': conditionMet = numericSource != numericTrigger; break;
            }
        } else {
             switch (trigger.source.condition) {
                case '==': conditionMet = sourceValue == trigger.source.value; break;
                case '!=': conditionMet = sourceValue != trigger.source.value; break;
            }
        }

        if (conditionMet) {
            trigger.actions.forEach(action => {
                const currentState = newStates[action.instanceId] || {};
                const newState = { ...currentState };
                let actionApplied = false;

                switch(action.action) {
                    case 'on': 
                        const targetOn = droppedComponents.find(c => c.instanceId === action.instanceId);
                        if (targetOn?.id === 'dc-motor') {
                            if (!currentState.isSpinning) { newState.isSpinning = true; actionApplied = true; }
                        } else {
                            if (!currentState.isOn) { newState.isOn = true; actionApplied = true; }
                        }
                         if (targetOn?.id === 'rgb-led' && action.value) {
                             if (currentState.color !== action.value) {
                                newState.color = action.value as string;
                                actionApplied = true;
                            }
                        }
                        break;
                    case 'off': 
                        const targetOff = droppedComponents.find(c => c.instanceId === action.instanceId);
                        if (targetOff?.id === 'dc-motor') {
                            if (currentState.isSpinning) { newState.isSpinning = false; actionApplied = true; }
                        } else {
                            if (currentState.isOn) { newState.isOn = false; actionApplied = true; }
                        }
                        if (targetOff?.id === 'rgb-led') {
                            if (currentState.color !== undefined) {
                                newState.color = undefined;
                                actionApplied = true;
                            }
                        }
                        break;
                    case 'rotate': if (currentState.angle !== action.value) { newState.angle = action.value as number; actionApplied = true; } break;
                    case 'display':
                        const targetDisplay = droppedComponents.find(c => c.instanceId === action.instanceId);
                        if (targetDisplay?.id === 'lcd-1602') {
                            if (action.line === 1 && currentState.textLine1 !== action.value) {
                                newState.textLine1 = action.value as string;
                                actionApplied = true;
                            } else if (action.line === 2 && currentState.textLine2 !== action.value) {
                                newState.textLine2 = action.value as string;
                                actionApplied = true;
                            }
                        } else {
                            if (currentState.displayValue !== action.value) {
                                newState.displayValue = action.value as string;
                                actionApplied = true;
                            }
                        }
                        break;
                }
                
                if (actionApplied) {
                    newStates[action.instanceId] = newState;
                    stateChanged = true;
                }
            });
        }
      });
      
      return stateChanged ? newStates : prevStates;
    });

  }, [userInputs, isSimulating, projectData?.simulationTriggers, droppedComponents, simulationInputErrors]);

  const clearSimulation = () => {
      simulationTimeoutsRef.current.forEach(window.clearTimeout);
      simulationTimeoutsRef.current = [];
      Object.values(buzzerNodesRef.current).forEach(({ oscillator }) => {
        try {
          oscillator.stop();
        } catch (e) {
          // Ignore if already stopped
        }
      });
      buzzerNodesRef.current = {};
      setComponentStates({});
      setIsSimulating(false);
      setUserInputs({});
      setSimulationInputErrors({});
  }

  const handleRunSimulation = () => {
    if (wiringErrors.length > 0) {
        alert("Cannot run simulation with wiring errors. Please fix the connections first.");
        return;
    }
    if (!projectData) {
        if (droppedComponents.length > 0) {
            alert("Please generate the project first by clicking 'Generate Code' or 'Wire Components'.");
        }
        return;
    }
    if (
        (!projectData.simulationSteps || projectData.simulationSteps.length === 0) &&
        (!projectData.simulationTriggers || projectData.simulationTriggers.length === 0)
    ) {
        alert("This project has no simulation data to run.");
        return;
    }

    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser.");
      }
    }

    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    clearSimulation();
    setIsSimulating(true);

    const buzzers = droppedComponents.filter(c => c.id === 'buzzer');
    if (audioContextRef.current) {
      const audioCtx = audioContextRef.current;
      buzzers.forEach(buzzer => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        buzzerNodesRef.current[buzzer.instanceId] = { oscillator, gainNode };
      });
    }

    const initialInputs: Record<string, string | number> = {};
    const initialStates: Record<string, ComponentState> = {};

    if (projectData.simulationSteps) {
        const inputComponents = new Set<string>();
        projectData.simulationSteps.forEach(step => {
            if (step.action === 'setInput' && !inputComponents.has(step.instanceId)) {
                if(step.value !== undefined) {
                    initialInputs[step.instanceId] = step.value;
                }
                inputComponents.add(step.instanceId);
            }
        });
        
        const processStep = (step: SimulationStep, state: ComponentState): ComponentState => {
            const component = droppedComponents.find(c => c.instanceId === step.instanceId);
            const newState = { ...state };
            if (!component) return newState;

            switch(step.action) {
                case 'on': 
                    if (component.id === 'dc-motor') newState.isSpinning = true;
                    else {
                        newState.isOn = true;
                        if (component.id === 'rgb-led' && step.value) {
                            newState.color = step.value as string;
                        }
                    }
                    break;
                case 'off':
                    if (component.id === 'dc-motor') newState.isSpinning = false;
                    else {
                        newState.isOn = false;
                         if (component.id === 'rgb-led') {
                            newState.color = undefined;
                        }
                    }
                    break;
                case 'rotate': newState.angle = step.value as number; break;
                case 'display':
                    if (component.id === 'lcd-1602') {
                        if (step.line === 1) newState.textLine1 = step.value as string;
                        else if (step.line === 2) newState.textLine2 = step.value as string;
                    } else {
                        newState.displayValue = step.value as string;
                    }
                    break;
                case 'setInput':
                    if (component.id === 'keypad-4x4') {
                         newState.pressedKey = step.value as string;
                    } else {
                        newState.inputValue = step.value;
                        if (step.value === 'pressed') newState.isPressed = true;
                        else if (step.value === 'released') newState.isPressed = false;
                    }
                    break;
            }
            return newState;
        }

        const stepsByTime: Record<number, SimulationStep[]> = {};
        projectData.simulationSteps.forEach(step => {
            if (!stepsByTime[step.timestamp]) stepsByTime[step.timestamp] = [];
            stepsByTime[step.timestamp].push(step);
        });

        const initialSteps = stepsByTime[0] || [];
        initialSteps.forEach(step => {
            const current = initialStates[step.instanceId] || {};
            initialStates[step.instanceId] = processStep(step, current);
        });
        
        Object.keys(initialInputs).forEach(instanceId => {
            initialStates[instanceId] = { ...initialStates[instanceId], inputValue: initialInputs[instanceId] };
        });

        setUserInputs(initialInputs);
        setComponentStates(initialStates);
        
        Object.entries(stepsByTime).forEach(([timestampStr, steps]) => {
            const timestamp = parseInt(timestampStr, 10);
            if (timestamp === 0) return;

            const timeoutId = window.setTimeout(() => {
                setComponentStates(prevStates => {
                    const newStates = { ...prevStates };
                    steps.forEach(step => {
                        const current = newStates[step.instanceId] || {};
                        newStates[step.instanceId] = processStep(step, current);
                    });
                    return newStates;
                });
            }, timestamp);
            simulationTimeoutsRef.current.push(timeoutId);
        });
    } else {
        setUserInputs({});
        setComponentStates({});
    }

    const lastStepTimestamp = projectData.simulationSteps && projectData.simulationSteps.length > 0
        ? projectData.simulationSteps.reduce((max, s) => Math.max(max, s.timestamp), 0)
        : 0;

    if (lastStepTimestamp > 0 && (!projectData.simulationTriggers || projectData.simulationTriggers.length === 0)) {
        const finalTimeout = window.setTimeout(() => setIsSimulating(false), lastStepTimestamp + 500);
        simulationTimeoutsRef.current.push(finalTimeout);
    }
  };

  const handleStopSimulation = () => {
      clearSimulation();
  };


  const toggleFullScreen = () => setIsFullScreen(prev => !prev);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing && mainContainerRef.current) {
      const rect = mainContainerRef.current.getBoundingClientRect();
      const newWidth = rect.right - e.clientX;
      if (newWidth > 350 && newWidth < rect.width - 400) {
        setPanelWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);


  const addComponentToCanvas = useCallback((componentId: string, x: number, y: number) => {
    const component = allAvailableComponents.find(c => c.id === componentId);
    if (!component) return;

    const instanceId = `${componentId}-${Date.now()}`;
    const existingCount = projectState.droppedComponents.filter(c => c.id === componentId).length;
    const displayName = `${component.name} ${existingCount + 1}`;
    
    const newComponent: DroppedComponent = {
      ...component,
      x,
      y,
      instanceId,
      displayName,
    };

    setDroppedComponents(prev => [...prev, newComponent]);
    setProjectData(null); 
    clearSimulation();
    if(challenge) {
        setUserConnections([]);
    }
  }, [allAvailableComponents, challenge, projectState.droppedComponents]);

  const handleDrop = useCallback((componentId: string, x: number, y: number) => {
    addComponentToCanvas(componentId, Math.max(0, x), Math.max(0, y));
  }, [addComponentToCanvas]);
  
  const handleMoveComponent = useCallback((instanceId: string, newX: number, newY: number) => {
    const snappedX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
    setDroppedComponents(prev =>
      prev.map(comp =>
        comp.instanceId === instanceId ? { ...comp, x: snappedX, y: snappedY } : comp
      )
    );
  }, []);

  const handleAutoLayout = () => {
    const CANVAS_WIDTH = 2000;
    const CANVAS_HEIGHT = 1500;
    const BOARD_WIDTH = 410;
    const BOARD_SVG_WIDTH = 512;
    const BOARD_SVG_HEIGHT = board.id === 'arduino' ? 336 : 324;
    const scaleX = BOARD_WIDTH / BOARD_SVG_WIDTH;
    const boardHeight = BOARD_SVG_HEIGHT * scaleX;
    const boardX = (CANVAS_WIDTH - BOARD_WIDTH) / 2;
    const boardY = (CANVAS_HEIGHT - boardHeight) / 2;

    const currentDroppedComponents = [...projectState.droppedComponents];
    let finalComponents = [...currentDroppedComponents];
    const breadboardIndex = finalComponents.findIndex(c => c.id === 'breadboard');

    if (breadboardIndex !== -1) {
      const breadboard = finalComponents[breadboardIndex];
      const breadboardNewX = Math.round((boardX + (BOARD_WIDTH / 2) - (BREADBOARD_WIDTH / 2)) / GRID_SIZE) * GRID_SIZE;
      const breadboardNewY = Math.round((boardY + boardHeight + 50) / GRID_SIZE) * GRID_SIZE;
      finalComponents[breadboardIndex] = { ...breadboard, x: breadboardNewX, y: breadboardNewY };
    }
    
    const componentsToLayout = finalComponents.filter(c => c.id !== 'breadboard');
    
    const startX = 40;
    const startY = 40;
    const gridGap = 40;
    const columnWidth = 220;
    const rowHeight = 100;
    const itemsPerRow = Math.floor((boardX - startX - gridGap) / columnWidth);
    
    let currentX = startX;
    let currentY = startY;
    let countInRow = 0;

    const updatedComponents = componentsToLayout.map(comp => {
        if (itemsPerRow > 0 && countInRow >= itemsPerRow) {
            countInRow = 0;
            currentX = startX;
            currentY += rowHeight + gridGap;
        }
        const newComp = { ...comp, x: currentX, y: currentY };
        currentX += columnWidth + gridGap;
        countInRow++;
        return newComp;
    });

    const finalComponentMap = new Map<string, DroppedComponent>();
    if (breadboardIndex !== -1) {
      finalComponentMap.set(finalComponents[breadboardIndex].instanceId, finalComponents[breadboardIndex]);
    }
    updatedComponents.forEach(comp => finalComponentMap.set(comp.instanceId, comp));

    setDroppedComponents(currentDroppedComponents.map(oldComp => finalComponentMap.get(oldComp.instanceId) || oldComp));
  };

  const handleGenerateCode = async () => {
    if (droppedComponents.length === 0) return;

    const transactionId = crypto.randomUUID();
    const getProjectInfo = board.language === 'Python' ? getUnifiedProjectInfo : getArduinoUnifiedProjectInfo;
    const boardPinoutForAI = board.pinout?.map(p => ({name: p.name})) || [];
    const MAX_RETRIES = 3;

    setIsGenerating(true);
    setGenerationError(null);
    setWiringErrors([]);
    
    if (isChallengeMode) {
        let lastErrors: WiringError[] = [];
        try {
            for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                const aiData = await getProjectInfo(
                    droppedComponents, 
                    projectIdea,
                    `${board.id}-board`,
                    board.name,
                    boardPinoutForAI,
                    lastErrors,
                    transactionId,
                    attempt
                );
                setUserConnections(aiData.connections); 
                
                const validationErrors = validateConnections(aiData.connections, droppedComponents, board);
                if (validationErrors.length === 0) {
                    setWiringErrors([]);
                    setIsGenerating(false);
                    return;
                }
                lastErrors = validationErrors;
                setWiringErrors(validationErrors);
            }
            throw new Error(`AI failed to generate valid wiring after ${MAX_RETRIES} attempts.`);
        } catch (error) {
            setGenerationError(`Failed. Contact System admin xyz@gmail.com`);
        } finally {
            setIsGenerating(false);
        }
    } else {
        clearSimulation();
        let lastErrors: WiringError[] = [];
        try {
            for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                const aiData = await getProjectInfo(
                    droppedComponents, 
                    projectIdea,
                    `${board.id}-board`,
                    board.name,
                    boardPinoutForAI,
                    lastErrors,
                    transactionId,
                    attempt
                );
                
                setUserCode(aiData.code);
                setProjectData(aiData); 
                
                const validationErrors = validateConnections(aiData.connections, droppedComponents, board);
                if (validationErrors.length === 0) {
                    setWiringErrors([]);
                    setIsGenerating(false);
                    return; 
                }
                lastErrors = validationErrors;
                setWiringErrors(validationErrors);
            }
            throw new Error(`AI failed to generate a valid circuit after ${MAX_RETRIES} attempts.`);
        } catch (error) {
            setGenerationError(`Failed. Contact System admin xyz@gmail.com`);
        } finally {
            setIsGenerating(false);
        }
    }
  };

  const handleUserCodeChange = (newContent: string, index: number) => {
    setUserCode(prev => {
        // Prevent re-render if content is identical
        if (prev[index]?.content === newContent) {
            return prev;
        }
        const newCode = [...prev];
        if(newCode[index]) {
            newCode[index] = { ...newCode[index], content: newContent };
        }
        return newCode;
    });
  };

  const handleAnalyzeCode = async () => {
    if (!userCode.length || !projectData?.connections) {
        setGenerationError("Cannot analyze code without an existing circuit. Please generate the project first.");
        return;
    }
    const transactionId = crypto.randomUUID();
    setIsAnalyzingCode(true);
    setCodeErrors([]);
    setGenerationError(null);
    clearSimulation();
    try {
        const response = await updateSimulationFromCode(userCode, droppedComponents, projectData.connections, board, transactionId);

        if (response.errors && response.errors.length > 0) {
            setCodeErrors(response.errors);
        } else {
             setUserCode(prev => {
                const newCode = [...prev];
                newCode[0] = { ...newCode[0], content: response.code };
                return newCode;
            });
            setProjectData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    connections: response.connections || prev.connections, 
                    code: prev.code.map((file, index) => index === 0 ? { ...file, content: response.code } : file),
                    explanation: response.explanation,
                    simulationSteps: response.simulationSteps,
                    simulationTriggers: response.simulationTriggers,
                };
            });
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred during code analysis";
        setGenerationError(message);
    } finally {
        setIsAnalyzingCode(false);
    }
  };

  const handleSuggestComponents = async () => {
    if (!projectIdea) return;
    const transactionId = crypto.randomUUID();
    setIsSuggesting(true);
    setGenerationError(null);
    setFeasibilityError(null);
    setSuggestedComponents({});
    setUnavailableSuggestions([]);
    try {
        const availableIds = allAvailableComponents.map(c => c.id);
        
        // Step 1: Feasibility Check
        await checkProjectFeasibility(projectIdea, availableIds, transactionId);

        // Step 2: Get Suggestions (only if feasible)
        const getSuggestions = board.language === 'Python' ? getComponentSuggestionsForPi : getComponentSuggestionsForArduino;
        const suggestions = await getSuggestions(projectIdea, availableIds, transactionId);
        
        const validSuggestions: {id: string; count: number}[] = [];
        const invalidSuggestionIds: string[] = [];
        const availableComponentIds = new Set(availableIds);

        for (const suggestion of suggestions) {
            if (availableComponentIds.has(suggestion.id)) {
                validSuggestions.push(suggestion);
            } else {
                invalidSuggestionIds.push(suggestion.id);
            }
        }

        const suggestionsMap = validSuggestions.reduce((acc, comp) => {
            acc[comp.id] = (acc[comp.id] || 0) + comp.count;
            return acc;
        }, {} as Record<string, number>);
        
        setSuggestedComponents(suggestionsMap);
        setUnavailableSuggestions(invalidSuggestionIds);

    } catch (error: any) {
        if (error.details && error.details.name) {
            setFeasibilityError(`${error.details.name} component is not available to proceed.`);
        } else {
            const message = error instanceof Error ? error.message : "An unknown error occurred";
            setGenerationError(message);
            console.error(error);
        }
    } finally {
        setIsSuggesting(false);
    }
  };

  const handleScaffoldProject = async () => {
    if (!projectIdea) return;
    
    const transactionId = crypto.randomUUID();
    const currentIdea = projectIdea;

    setIsScaffolding(true);
    setGenerationError(null);
    setFeasibilityError(null);
    setUnavailableSuggestions([]);
    setWiringErrors([]);
    
    try {
        // Step 1: Feasibility Check
        const availableIds = allAvailableComponents.map(c => c.id);
        await checkProjectFeasibility(currentIdea, availableIds, transactionId);

        // Step 2: Scaffold (only if feasible)
        handleClear();
        setProjectIdea(currentIdea); 

        let lastErrors: WiringError[] = [];
        const MAX_RETRIES = 3;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            const getScaffold = board.language === 'Python' ? getProjectScaffoldForPi : getProjectScaffoldForArduino;
            const boardPinoutForAI = board.pinout?.map(p => ({name: p.name})) || [];
            
            const response: ProjectScaffoldResponse = await getScaffold(
                currentIdea,
                allAvailableComponents,
                `${board.id}-board`,
                board.name,
                boardPinoutForAI,
                lastErrors,
                transactionId,
                attempt
            );

            const newDroppedComponents: DroppedComponent[] = response.placedComponents.map(pc => {
                const componentDetails = allAvailableComponents.find(c => c.id === pc.id);
                if (!componentDetails) return null;
                return { ...componentDetails, instanceId: pc.instanceId, x: pc.x, y: pc.y, displayName: pc.displayName };
            }).filter((c): c is DroppedComponent => c !== null);

            setUserCode(response.code);
            setProjectState(prev => ({
                ...prev,
                droppedComponents: newDroppedComponents,
                projectData: {
                    connections: response.connections,
                    code: response.code,
                    explanation: response.explanation,
                    simulationSteps: response.simulationSteps,
                    simulationTriggers: response.simulationTriggers,
                }
            }));

            const validationErrors = validateConnections(response.connections, newDroppedComponents, board);
            if (validationErrors.length === 0) {
                setWiringErrors([]);
                setIsScaffolding(false);
                return;
            }
            lastErrors = validationErrors;
            setWiringErrors(validationErrors);
        }
        throw new Error(`AI failed to generate a valid scaffold after ${MAX_RETRIES} attempts.`);
    } catch (error: any) {
        if (error.details && error.details.name) {
             setFeasibilityError(`${error.details.name} component is not available to proceed.`);
        } else {
            setGenerationError(`Failed. Contact System admin xyz@gmail.com`);
        }
    } finally {
        setIsScaffolding(false);
    }
  };

  const handleClear = () => {
    const isChallenge = !!challenge;
    setCurrentProject({
      id: `proj_${Date.now()}`,
      name: isChallenge ? challenge.title : 'Untitled Project',
      boardType: board.id,
      createdAt: new Date().toISOString(),
    });
    setProjectState(getNewProjectState());
    setGenerationError(null);
    setUnavailableSuggestions([]);
    setWiringErrors([]);
    clearSimulation();
    if(isChallenge) {
        setProjectIdea(challenge.goal);
        setUserConnections([]);
        setUserCode([{ filename: board.language === 'Python' ? 'main.py' : 'sketch.ino', content: board.language === 'Python' ? '# Your Python code here\n' : '// Your C++ code here\n' }]);
    }
  };
  
  const handleSaveProject = async (name: string, isPublic: boolean, author: string) => {
      try {
        const projectToSave: SavedProject = {
            ...currentProject,
            name,
            isPublic,
            author,
            createdAt: currentProject.id.startsWith('proj_') ? new Date().toISOString() : currentProject.createdAt,
            state: {
                ...projectState,
                // Sanitize droppedComponents for storage by removing function components
                droppedComponents: projectState.droppedComponents.map(({ Icon, ...rest }) => rest) as any[],
            },
        };
        
        const savedProject = await saveProject(projectToSave);

        setCurrentProject(prev => ({
            ...prev,
            id: savedProject.id, // Update with the real ID from the database
            name: savedProject.name,
            createdAt: savedProject.createdAt,
        }));
        
        setIsSaveModalOpen(false);
      } catch (e) {
        console.error("Failed to save project", e);
        setGenerationError("Could not save project to the database.");
      }
  };
  
  const handleDeleteProject = async (projectId: string): Promise<boolean> => {
       try {
        await deleteProject(projectId);
        if (currentProject.id === projectId) {
            handleClear();
        }
        return true; 
      } catch (e) {
        console.error("Failed to delete project", e);
        setGenerationError("Could not delete project from the database.");
        return false;
      }
  };

  const handleCheckSolution = async () => {
    if (!challenge) return;
    const transactionId = crypto.randomUUID();
    setIsCheckingSolution(true);
    setChallengeFeedback(null);
    try {
        const allCode = userCode.map(c => `//--- ${c.filename} ---\n${c.content}`).join('\n\n');
        const result = await evaluateChallengeSolution(
            challenge.goal,
            challenge.successConditionPrompt,
            droppedComponents,
            userConnections,
            allCode,
            board.name,
            transactionId
        );
        if (result.isCorrect) {
            setIsChallengeComplete(true);
        } else {
            setChallengeFeedback({ ...result, type: 'evaluation' });
        }
    } catch (e) {
        setChallengeFeedback({ type: 'evaluation', isCorrect: false, feedback: "An error occurred while checking your solution."});
    } finally {
        setIsCheckingSolution(false);
    }
  };
  
  const handleGetHint = async () => {
    if (!challenge) return;
    const transactionId = crypto.randomUUID();
    setIsGettingHint(true);
    setChallengeFeedback(null);
    try {
        const allCode = userCode.map(c => `//--- ${c.filename} ---\n${c.content}`).join('\n\n');
        const result = await getChallengeHint(
            challenge.goal,
            droppedComponents,
            userConnections,
            allCode,
            board.name,
            transactionId
        );
        setChallengeFeedback({ type: 'hint', hint: result.hint });
    } catch (e) {
        setChallengeFeedback({ type: 'hint', hint: "Sorry, I couldn't get a hint right now. Please try again."});
    } finally {
        setIsGettingHint(false);
    }
  };

  useEffect(() => {
    if (!isSimulating || !audioContextRef.current) return;
    
    const audioCtx = audioContextRef.current;

    Object.entries(componentStates).forEach(([instanceId, state]) => {
        const buzzerNode = buzzerNodesRef.current[instanceId];
        if (buzzerNode) {
            const { gainNode } = buzzerNode;
            const targetGain = (state as ComponentState).isOn ? 0.2 : 0;
            
            if (gainNode.gain.value !== targetGain) {
                 gainNode.gain.linearRampToValueAtTime(targetGain, audioCtx.currentTime + 0.01);
            }
        }
    });
  }, [componentStates, isSimulating]);

  const handleProjectNameChange = (name: string) => {
    setCurrentProject(prev => ({ ...prev, name }));
  };


  const hasDroppedComponents = droppedComponents.length > 0;
  
  const canGenerateCode = useMemo(() => {
    if (!hasDroppedComponents) return false;
    if (challenge) return hasDroppedComponents; // In challenge, button becomes "Wire"

    if (Object.keys(suggestedComponents).length > 0) {
      const droppedCounts = droppedComponents.reduce((acc: Record<string, number>, comp: DroppedComponent) => {
        acc[comp.id] = (acc[comp.id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(suggestedComponents).every(([id, requiredCount]) => 
        (droppedCounts[id] || 0) >= requiredCount
      );
    }
    return true;
  }, [droppedComponents, suggestedComponents, hasDroppedComponents, challenge]);
  
  const remainingSuggestions = useMemo(() => {
    const droppedCounts = droppedComponents.reduce((acc, comp) => {
        acc[comp.id] = (acc[comp.id] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const remaining: Record<string, number> = {};
    Object.keys(suggestedComponents).forEach(id => {
        remaining[id] = Math.max(0, (suggestedComponents[id] || 0) - (droppedCounts[id] || 0));
    });
    return remaining;
  }, [suggestedComponents, droppedComponents]);

  const totalRemainingCount = useMemo(() => {
      return Object.values(remainingSuggestions).reduce((sum: number, count: number) => sum + count, 0);
  }, [remainingSuggestions]);

  const isEditable = (!challenge && !!projectData) || (!!challenge && isMcqPassed);
  const anyLoading = isGenerating || isScaffolding || isCheckingSolution || isGettingHint || isAnalyzingCode;

  return (
    <>
      {challenge && !isMcqPassed && (
        <ChallengeMCQModal 
            challenge={challenge} 
            onCorrectAnswer={() => setIsMcqPassed(true)}
            onClose={onBack}
        />
      )}
      {feasibilityError && (
          <FeasibilityErrorModal message={feasibilityError} onClose={() => setFeasibilityError(null)} />
      )}
      <div className={`flex h-screen w-screen overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-opacity duration-300 ${challenge && !isMcqPassed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {isSaveModalOpen && (
          <SaveProjectModal
              onSave={handleSaveProject}
              onClose={() => setIsSaveModalOpen(false)}
              currentName={currentProject.name === 'Untitled Project' ? '' : currentProject.name}
          />
        )}
        {isLoadModalOpen && (
            <LoadProjectModal
              onLoad={handleLoadProject}
              onDelete={handleDeleteProject}
              onClose={() => setIsLoadModalOpen(false)}
              boardType={board.id}
            />
        )}
        {challengeFeedback && <ChallengeFeedbackModal result={challengeFeedback} onClose={() => setChallengeFeedback(null)} />}
        {isChallengeComplete && challenge && <ChallengeSuccessModal challenge={challenge} onNext={onBack} />}

        {!isFullScreen && (
            <Sidebar 
              availableComponents={filteredAvailableComponents}
              onClear={handleClear} 
              onGenerateCode={handleGenerateCode}
              isGenerating={isGenerating}
              hasDroppedComponents={hasDroppedComponents}
              canGenerateCode={canGenerateCode}
              projectIdea={projectIdea}
              onProjectIdeaChange={setProjectIdea}
              onSuggestComponents={handleSuggestComponents}
              isSuggesting={isSuggesting}
              onScaffoldProject={handleScaffoldProject}
              isScaffolding={isScaffolding}
              remainingSuggestions={remainingSuggestions}
              totalRemainingCount={totalRemainingCount}
              unavailableSuggestions={unavailableSuggestions}
              boardName={`${board.name} Lab`}
              onBack={onBack}
              projectName={currentProject.name}
              onProjectNameChange={handleProjectNameChange}
              onSave={() => setIsSaveModalOpen(true)}
              onLoad={() => setIsLoadModalOpen(true)}
              wiringErrors={wiringErrors}
              challenge={challenge}
              isMcqPassed={isMcqPassed}
              onCheckSolution={handleCheckSolution}
              onGetHint={handleGetHint}
              isCheckingSolution={isCheckingSolution}
              isGettingHint={isGettingHint}
              userConnections={userConnections}
              componentSearchTerm={componentSearchTerm}
              onComponentSearchChange={setComponentSearchTerm}
            />
        )}
        <main ref={mainContainerRef} className="flex-grow flex h-full min-w-0">
          <LabCanvas 
            board={board}
            challenge={challenge}
            droppedComponents={droppedComponents} 
            onDrop={handleDrop} 
            onMove={handleMoveComponent}
            projectData={projectData}
            isFullScreen={isFullScreen}
            onToggleFullScreen={toggleFullScreen}
            componentStates={componentStates}
            isSimulating={isSimulating}
            onRun={handleRunSimulation}
            onStop={handleStopSimulation}
            hasSimulation={!!projectData || (!!challenge && userConnections.length > 0)}
            userInputs={userInputs}
            onUserInput={handleUserInput}
            simulationInputErrors={simulationInputErrors}
            theme={theme}
            projectName={currentProject.name}
            projectIdea={projectIdea}
            suggestedComponents={suggestedComponents}
            availableComponents={availableComponents}
            wiringErrors={wiringErrors}
            userConnections={userConnections}
            onUserConnectionsChange={setUserConnections}
            onAutoLayout={handleAutoLayout}
          />
          {!isFullScreen && (
              <>
                  <div 
                    className="w-1.5 flex-shrink-0 cursor-col-resize bg-gray-300 dark:bg-gray-700 hover:bg-cyan-500 dark:hover:bg-cyan-600 transition-colors"
                    onMouseDown={handleMouseDown}
                  />
                  <div style={{ width: `${panelWidth}px` }} className="flex-shrink-0 h-full">
                      <LabCodePanel 
                        projectData={projectData} 
                        isLoading={anyLoading && !isAnalyzingCode} 
                        theme={theme} 
                        language={board.language}
                        isEditable={isEditable}
                        userCode={userCode}
                        onUserCodeChange={handleUserCodeChange}
                        isChallengeMode={isChallengeMode}
                        onAnalyzeCode={handleAnalyzeCode}
                        isAnalyzingCode={isAnalyzingCode}
                        codeErrors={codeErrors}
                      />
                  </div>
              </>
          )}
          {generationError && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 dark:bg-red-800/90 text-white px-6 py-3 rounded-lg shadow-lg z-50">
              <p><span className="font-bold">Error:</span> {generationError}</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default LabApp;