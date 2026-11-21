import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { DroppedComponent, UnifiedGeminiResponse, ComponentState, Component, Board, WiringError, Connection, PinIdentifier, Challenge, BoardPin } from './types';
import Breadboard from './components/boards/Breadboard';
import { FullScreenEnterIcon, FullScreenExitIcon, DownloadIcon, PlusIcon, MinusIcon, ArrowPathIcon, PdfFileIcon, LayoutIcon, PlayIcon, StopIcon } from './components/icons';
import ComponentInspector from './components/ComponentInspector';
import L298nMotorDriver from './components/boards/L298nMotorDriver';
import { LoraModule } from './components/boards/Lora';
import { NodeMcu } from './components/boards/NodeMcu';
import RaspberryPiBoard from './components/boards/RaspberryPiBoard';
import ArduinoBoard from './components/boards/ArduinoBoard';
import { BREADBOARD_PIN_INFO, L298N_PIN_INFO, LORA_PIN_INFO, NODEMCU_PIN_INFO, DROPPED_ITEM_WIDTHS } from './data/boardData';

interface CanvasProps {
  board: Board;
  challenge: Challenge | null;
  droppedComponents: DroppedComponent[];
  projectData: UnifiedGeminiResponse | null;
  onDrop: (componentId: string, x: number, y: number) => void;
  onMove: (instanceId: string, x: number, y: number) => void;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
  componentStates: Record<string, ComponentState>;
  isSimulating: boolean;
  onRun: () => void;
  onStop: () => void;
  hasSimulation: boolean;
  userInputs: Record<string, string | number>;
  onUserInput: (instanceId: string, value: string) => void;
  simulationInputErrors: Record<string, string>;
  theme: 'light' | 'dark';
  projectName: string;
  projectIdea: string;
  suggestedComponents: Record<string, number>;
  availableComponents: Component[];
  wiringErrors: WiringError[];
  userConnections: Connection[];
  onUserConnectionsChange: (connections: Connection[]) => void;
  onAutoLayout: () => void;
}

const getPinLayout = (pinout: { pin: string }[] | undefined, componentWidth: number, componentHeight: number) => {
    if (!pinout || pinout.length === 0) return [];
    
    const positions: { name: string; x: number; y: number }[] = [];
    const leftPinsCount = Math.ceil(pinout.length / 2);
    const rightPinsCount = pinout.length - leftPinsCount;

    const leftPinout = pinout.slice(0, leftPinsCount);
    const rightPinout = pinout.slice(leftPinsCount);

    const leftSpacing = componentHeight / (leftPinsCount + 1);
    leftPinout.forEach((pin, i) => {
        positions.push({ name: pin.pin, x: 0, y: leftSpacing * (i + 1) });
    });

    const rightSpacing = componentHeight / (rightPinsCount + 1);
    rightPinout.forEach((pin, i) => {
        positions.push({ name: pin.pin, x: componentWidth, y: rightSpacing * (i + 1) });
    });
    return positions;
}


const SevenSegmentDisplay: React.FC<{ value: string }> = ({ value }) => {
    const segments = [ "M 5 2 L 15 2 L 17 4 L 15 6 L 5 6 L 3 4 Z", "M 16 3 L 18 5 L 18 13 L 16 15 L 14 13 L 14 5 Z", "M 16 17 L 18 19 L 18 27 L 16 29 L 14 27 L 14 19 Z", "M 5 28 L 15 28 L 17 30 L 15 32 L 5 32 L 3 30 Z", "M 4 17 L 6 19 L 6 27 L 4 29 L 2 27 L 2 19 Z", "M 4 3 L 6 5 L 6 13 L 4 15 L 2 13 L 2 5 Z", "M 5 15 L 15 15 L 17 17 L 15 19 L 5 19 L 3 17 Z" ];
    return ( <svg viewBox="0 0 20 34" className="w-8 h-14"> {segments.map((d, i) => ( <path key={i} d={d} className="transition-colors duration-100" fill={value && value[i] === '1' ? '#EF5350' : '#E0E0E0'} /> ))} </svg> );
};

const DotMatrixDisplay: React.FC<{ value: string }> = ({ value }) => {
    const icons: { [key: string]: number[][] } = { heart: [ [0,1,1,0,0,1,1,0], [1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1], [0,1,1,1,1,1,1,0], [0,0,1,1,1,1,0,0], [0,0,0,1,1,0,0,0], [0,0,0,0,0,0,0,0] ], smile: [ [0,0,1,1,1,1,0,0], [0,1,0,0,0,0,1,0], [1,0,1,0,0,1,0,1], [1,0,0,0,0,0,0,1], [1,0,1,0,0,1,0,1], [1,0,0,1,1,0,0,1], [0,1,0,0,0,0,1,0], [0,0,1,1,1,1,0,0] ], arrow: [ [0,0,0,1,1,0,0,0], [0,0,1,1,1,1,0,0], [0,1,0,1,1,0,1,0], [1,0,0,1,1,0,0,1], [0,0,0,1,1,0,0,0], [0,0,0,1,1,0,0,0], [0,0,0,1,1,0,0,0], [0,0,0,1,1,0,0,0] ] };
    const pattern = icons[value] || Array(8).fill(Array(8).fill(0));
    return ( <div className="grid grid-cols-8 gap-1 p-1 bg-gray-200 rounded"> {pattern.flat().map((dot, i) => ( <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors duration-100 ${dot ? 'bg-red-500' : 'bg-gray-400'}`} /> ))} </div> );
}

interface KeypadDisplayProps {
  pressedKey: string;
  onKeyPress: (key: string) => void;
  onKeyRelease: () => void;
  isSimulating: boolean;
}

const KeypadDisplay: React.FC<KeypadDisplayProps> = ({ pressedKey, onKeyPress, onKeyRelease, isSimulating }) => {
    const keys = [ ['1','2','3','A'], ['4','5','6','B'], ['7','8','9','C'], ['*','0','#','D'] ];
    
    return (
        <div className="p-1.5 bg-gray-200 dark:bg-gray-900 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 grid grid-cols-4 gap-1.5"
             onMouseLeave={() => isSimulating && onKeyRelease()}
        >
            {keys.flat().map(key => (
                <button
                    key={key}
                    onMouseDown={() => isSimulating && onKeyPress(key)}
                    onMouseUp={() => isSimulating && onKeyRelease()}
                    onTouchStart={(e) => { e.preventDefault(); isSimulating && onKeyPress(key); }}
                    onTouchEnd={(e) => { e.preventDefault(); isSimulating && onKeyRelease(); }}
                    disabled={!isSimulating}
                    className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-mono font-bold transition-all duration-75 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-cyan-400
                        ${
                            isSimulating
                            ? 'text-gray-800 dark:text-gray-200 bg-gray-300 dark:bg-gray-700 shadow-md active:bg-cyan-500 active:shadow-inner active:translate-y-px cursor-pointer'
                            : 'text-gray-500 bg-gray-400/50 dark:bg-gray-600/50 cursor-not-allowed'
                        }
                        ${pressedKey === key ? 'bg-cyan-600 !text-white ring-2 ring-cyan-400' : ''}
                    `}
                    aria-label={`Key ${key}`}
                >
                    {key}
                </button>
            ))}
        </div>
    );
};


const DroppedItem: React.FC<{ component: DroppedComponent, simulationState: ComponentState | undefined, isSimulating: boolean, userInputValue: string | number | undefined, onUserInput: (instanceId: string, value: string) => void, simulationInputError?: string, onHover: (component: DroppedComponent | null, e?: React.MouseEvent) => void, }> = ({ component, simulationState, isSimulating, userInputValue, onUserInput, simulationInputError, onHover }) => {
  const { Icon, name, x, y, instanceId, id, width: componentWidth, displayName } = component;
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => { const rect = e.currentTarget.getBoundingClientRect(); const offsetX = e.clientX - rect.left; const offsetY = e.clientY - rect.top; const moveData = JSON.stringify({ instanceId, offsetX, offsetY }); e.dataTransfer.setData('application/vnd.component-move', moveData); e.dataTransfer.effectAllowed = 'move'; };
  
    if (id === 'keypad-4x4') {
        const keypadWidth = 182;
        const keypadHeight = 182;
        const pinPositions = useMemo(() => {
            if (!component.pinout) return [];
            // Space pins out along the bottom edge.
            const spacing = keypadWidth / (component.pinout.length + 1);
            return component.pinout.map((pin, i) => ({
                name: pin.pin,
                x: spacing * (i + 1),
                y: keypadHeight, // Position pins at the bottom of the component
            }));
        }, [component.pinout]);
        
        return (
            <div
                onMouseEnter={(e) => onHover(component, e)}
                onMouseLeave={() => onHover(null)}
                style={{ left: `${x}px`, top: `${y}px` }}
                className={`absolute z-10`}
                aria-label={`${displayName} component`}
            >
                <div
                    draggable
                    onDragStart={handleDragStart}
                    className="relative cursor-move"
                    style={{width: `${keypadWidth}px`, height: `${keypadHeight}px`}}
                >
                    <KeypadDisplay
                        pressedKey={simulationState?.pressedKey ?? ""}
                        isSimulating={isSimulating}
                        onKeyPress={(key) => onUserInput(instanceId, key)}
                        onKeyRelease={() => onUserInput(instanceId, '')} 
                    />
                </div>
                {pinPositions.map((pin) => (
                  <div
                    key={pin.name}
                    className="absolute flex items-center pointer-events-none"
                    style={{
                        top: pin.y,
                        left: pin.x,
                    }}
                  >
                    <div style={{transform: 'translate(-50%, 4px)'}} className="flex flex-col items-center">
                        <div title={pin.name} className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full border border-white dark:border-gray-800" />
                        <span className="pt-1 text-[9px] font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">{pin.name}</span>
                    </div>
                  </div>
              ))}
            </div>
        );
    }
  
  const commonDivProps = { draggable: true, onDragStart: handleDragStart, onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => onHover(component, e), onMouseLeave: () => onHover(null), style: { left: `${x}px`, top: `${y}px`, cursor: 'move' }, className: "absolute z-10", 'aria-label': `${displayName} component`, };
  
  if (componentWidth) { return ( <div {...commonDivProps} style={{ ...commonDivProps.style, width: `${componentWidth}px`}} > <div className="p-1 bg-white dark:bg-gray-700 rounded-lg shadow-xl border-2 border-gray-300 dark:border-gray-600"> <Icon className="w-full h-auto text-current" /> </div> <p className="text-center text-xs font-semibold mt-1 text-gray-700 dark:text-gray-300">{displayName}</p> </div> ); }
  if (id === 'breadboard') return <div {...commonDivProps}><Breadboard /></div>;
  if (id === 'l298n') return <div {...commonDivProps}><L298nMotorDriver /></div>;
  if (id === 'lora-rfm9x') return <div {...commonDivProps}><LoraModule /></div>;
  if (id === 'nodemcu-esp8266') return <div {...commonDivProps}><NodeMcu /></div>;

  const width = DROPPED_ITEM_WIDTHS[id] || DROPPED_ITEM_WIDTHS['default'];
  const isGlowing = simulationState?.isOn ?? false;
  const isSpinning = simulationState?.isSpinning ?? false;
  const isPressed = simulationState?.isPressed ?? false;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { onUserInput(instanceId, e.target.value); };
  const isInputComponent = component.simulation?.isInput;
  const inputErrorClass = simulationInputError ? 'border-red-500 ring-1 ring-red-500' : 'border-cyan-400 dark:border-cyan-700';
  
  const renderInnerSimulationState = () => {
    switch (id) {
        case 'rgb-led':
            const color = simulationState?.color || '#4DD0E1';
            return <div className="absolute inset-0 rounded-lg transition-opacity duration-200" style={{ opacity: isGlowing ? 1 : 0, boxShadow: `0 0 15px 5px ${color}`, backgroundColor: color }} />;
        case 'led':
        case 'buzzer':
            return <div className="absolute inset-0 rounded-lg transition-opacity duration-200" style={{ opacity: isGlowing ? 1 : 0, boxShadow: '0 0 15px 5px #4DD0E1', backgroundColor: '#4DD0E1' }} />;
        case 'dc-motor':
            return <div className="absolute inset-0 rounded-lg transition-opacity duration-200" style={{ opacity: isSpinning ? 0.7 : 0, boxShadow: '0 0 15px 5px #4DD0E1', backgroundColor: '#4DD0E1' }} />;
        case 'sg90-servo':
        case '28byj-48':
            const angle = simulationState?.angle ?? 0;
            return <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4"><div style={{ transform: `rotate(${angle}deg)` }} className="absolute w-10 h-1.5 bg-cyan-400 rounded-sm top-1/2 left-1/2 origin-left -translate-y-1/2 transition-transform duration-200" /></div>;
        case '7-segment':
            return <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><SevenSegmentDisplay value={simulationState?.displayValue ?? "0000000"}/></div>;
        case 'dot-matrix-8x8':
            return <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><DotMatrixDisplay value={simulationState?.displayValue ?? ""}/></div>;
        default:
            return null;
    }
  }

  const componentHeight = 44; // approx height of the component box
  const pinPositions = useMemo(() => getPinLayout(component.pinout, width, componentHeight), [component.pinout, width]);
  
  return (
    <div onMouseEnter={(e) => onHover(component, e)} onMouseLeave={() => onHover(null)} style={{ left: `${x}px`, top: `${y}px` }} className={`absolute z-10`} aria-label={`${displayName} component`}>
        <div draggable onDragStart={handleDragStart} style={{ width: `${width}px` }} className={`relative p-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl border-2 border-gray-300 dark:border-gray-600 z-10 transition-transform duration-100 ${isPressed && id === 'button' ? 'transform scale-95 brightness-75' : ''} cursor-move`}>
            <div className="flex items-center relative z-10">
                <Icon className={`w-6 h-6 mr-2 text-cyan-500 dark:text-cyan-400 ${isSpinning ? 'animate-spin' : ''}`} />
                <h3 className="font-bold text-sm truncate text-gray-800 dark:text-gray-100">{displayName}</h3>
            </div>
            {isSimulating && renderInnerSimulationState()}
        </div>
        
        {pinPositions.map((pin) => (
          <div
            key={pin.name}
            className="absolute flex items-center pointer-events-none"
            style={{
                top: pin.y + 4, // +4px offset to center on component box
                left: pin.x,
            }}
          >
            {pin.x === 0 ? ( // Pin on the left
                <div style={{transform: 'translateX(-100%)'}} className="flex items-center">
                    <span className="text-[9px] font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap pr-1.5">{pin.name}</span>
                    <div title={pin.name} className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full border border-white dark:border-gray-800" />
                </div>
            ) : ( // Pin on the right
                <div className="flex items-center">
                    <div title={pin.name} className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full border border-white dark:border-gray-800" />
                    <span className="pl-1.5 text-[9px] font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">{pin.name}</span>
                </div>
            )}
          </div>
        ))}
        
        {isSimulating && id === 'lcd-1602' && ( <div className="absolute top-full mt-2 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-cyan-500 dark:border-cyan-800 rounded p-1.5 font-mono text-sm text-cyan-800 dark:text-cyan-200 pointer-events-none z-20"> <span className="block truncate">{simulationState?.textLine1 || ' '}</span> <span className="block truncate">{simulationState?.textLine2 || ' '}</span> </div> )}
        {isSimulating && isInputComponent && id !== 'button' && ( <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-32 z-20" onMouseDown={(e) => e.stopPropagation()} onMouseUp={(e) => e.stopPropagation()}> <input type="text" value={String(userInputValue ?? simulationState?.inputValue ?? '')} onChange={handleInputChange} draggable="false" className={`w-full bg-white dark:bg-gray-900 text-cyan-800 dark:text-cyan-300 text-center text-xs font-mono px-1 py-0.5 rounded border ${inputErrorClass} focus:ring-1 focus:ring-cyan-500 focus:outline-none cursor-text`} aria-label={`Input for ${displayName}`} /> {simulationInputError && <p className="text-red-500 text-[10px] mt-1 text-center">{simulationInputError}</p>} </div> )}
        {isSimulating && id === 'button' && ( <div onMouseDown={(e) => { e.stopPropagation(); onUserInput(instanceId, '1'); }} onMouseUp={(e) => { e.stopPropagation(); onUserInput(instanceId, '0'); }} onTouchStart={(e) => { e.stopPropagation(); onUserInput(instanceId, '1'); }} onTouchEnd={(e) => { e.stopPropagation(); onUserInput(instanceId, '0'); }} onMouseLeave={(e) => { e.stopPropagation(); if (userInputValue === '1') { onUserInput(instanceId, '0'); } }} className="absolute inset-0 z-20 cursor-pointer rounded-lg" aria-label={`Press ${displayName}`} /> )}
    </div>
  );
};

const BoardDisplay: React.FC<{ board: Board }> = ({ board }) => {
    if (board.boardComponent === 'RaspberryPiBoard') return <RaspberryPiBoard />;
    if (board.boardComponent === 'ArduinoBoard') return <ArduinoBoard />;
    if (board.boardComponent?.trim().startsWith('<svg')) {
      return <div className="w-full h-full text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: board.boardComponent }} />;
    }
    return null;
};

const LabCanvas: React.FC<CanvasProps> = ({ board, challenge, droppedComponents, projectData, onDrop, onMove, isFullScreen, onToggleFullScreen, componentStates, isSimulating, onRun, onStop, hasSimulation, userInputs, onUserInput, simulationInputErrors, theme, projectName, projectIdea, suggestedComponents, availableComponents, wiringErrors, userConnections, onUserConnectionsChange, onAutoLayout }) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [hoveredComponent, setHoveredComponent] = useState<{ component: DroppedComponent; position: { x: number; y: number } } | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const isPanningRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const [drawingWire, setDrawingWire] = useState<{ from: PinIdentifier; to: { x: number; y: number } } | null>(null);
  
  const CANVAS_WIDTH = 2000;
  const CANVAS_HEIGHT = 1500;
  const GRID_SIZE = 20;
  const BOARD_WIDTH = 328; // 410 * 0.8
  const BOARD_SVG_WIDTH = 512;
  const BOARD_SVG_HEIGHT = board.id === 'arduino' ? 336 : 324;
  const scaleX = BOARD_WIDTH / BOARD_SVG_WIDTH;
  const boardHeight = BOARD_SVG_HEIGHT * scaleX;
  const scaleY = boardHeight / BOARD_SVG_HEIGHT;

  const handleComponentHover = (component: DroppedComponent | null, e?: React.MouseEvent) => {
    if (component && e && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setHoveredComponent({ component, position: { x: e.clientX - rect.left, y: e.clientY - rect.top }, });
    } else { setHoveredComponent(null); }
  };
  
  const handleResetView = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const viewWidth = canvas.clientWidth;
    const viewHeight = canvas.clientHeight;
    
    // Fit board with some padding
    const newScale = Math.min(viewWidth / (BOARD_WIDTH * 1.8), viewHeight / (boardHeight * 1.8));
    const clampedScale = Math.max(0.2, Math.min(newScale, 2.0)); // Allow initial zoom up to 2x

    const initialPanX = viewWidth / 2 - (CANVAS_WIDTH / 2) * clampedScale;
    const initialPanY = viewHeight / 2 - (CANVAS_HEIGHT / 2) * clampedScale;
    
    const initialT = { scale: clampedScale, x: initialPanX, y: initialPanY };
    setTransform(initialT);
  }, [boardHeight]);

  useEffect(() => { const timeoutId = setTimeout(handleResetView, 0); return () => clearTimeout(timeoutId); }, [isFullScreen, handleResetView]);

  const handleZoom = useCallback((delta: number, mouseX?: number, mouseY?: number) => {
      if (!canvasRef.current) return;
      const viewWidth = canvasRef.current.clientWidth;
      const viewHeight = canvasRef.current.clientHeight;

      setTransform(prev => {
          const scaleFactor = 1.15;
          // Standard scroll is deltaY > 0 for down (zoom out), deltaY < 0 for up (zoom in)
          const newScale = delta > 0 ? prev.scale / scaleFactor : prev.scale * scaleFactor;
          const clampedScale = Math.max(0.2, Math.min(newScale, 3.0));

          let mX = mouseX !== undefined ? mouseX : viewWidth / 2;
          let mY = mouseY !== undefined ? mouseY : viewHeight / 2;

          // The position of the mouse in world coordinates before the zoom
          const worldX = (mX - prev.x) / prev.scale;
          const worldY = (mY - prev.y) / prev.scale;
          
          // The new top-left of the canvas, aiming to keep the world point under the mouse
          const newX = mX - worldX * clampedScale;
          const newY = mY - worldY * clampedScale;

          // Apply constraints
          const contentWidth = CANVAS_WIDTH * clampedScale;
          const contentHeight = CANVAS_HEIGHT * clampedScale;

          let clampedX = newX;
          if (contentWidth < viewWidth) {
              clampedX = (viewWidth - contentWidth) / 2; // Center horizontally
          } else {
              clampedX = Math.max(viewWidth - contentWidth, Math.min(newX, 0)); // Lock to edges
          }

          let clampedY = newY;
          if (contentHeight < viewHeight) {
              clampedY = (viewHeight - contentHeight) / 2; // Center vertically
          } else {
              clampedY = Math.max(viewHeight - contentHeight, Math.min(newY, 0)); // Lock to edges
          }

          return { scale: clampedScale, x: clampedX, y: clampedY };
      });
  }, []);

  const handleWheel = (e: React.WheelEvent) => { if (!canvasRef.current || drawingWire) return; e.preventDefault(); const rect = canvasRef.current.getBoundingClientRect(); const mouseX = e.clientX - rect.left; const mouseY = e.clientY - rect.top; handleZoom(e.deltaY, mouseX, mouseY); };
  const handleMouseDown = (e: React.MouseEvent) => { setSelectedConnection(null); if ((e.target as HTMLElement).closest('[draggable]') || e.target !== e.currentTarget) { return; } isPanningRef.current = true; lastMousePosRef.current = { x: e.clientX, y: e.clientY }; (e.target as HTMLElement).style.cursor = 'grabbing'; };
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (drawingWire) {
        if (!canvasRef.current) return;
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const screenX = e.clientX - canvasRect.left;
        const screenY = e.clientY - canvasRect.top;
        const worldX = (screenX - transform.x) / transform.scale;
        const worldY = (screenY - transform.y) / transform.scale;
        setDrawingWire(prev => prev ? { ...prev, to: { x: worldX, y: worldY } } : null);
    } else if (isPanningRef.current) {
        if (!canvasRef.current) return;
        const viewWidth = canvasRef.current.clientWidth;
        const viewHeight = canvasRef.current.clientHeight;

        const dx = e.clientX - lastMousePosRef.current.x;
        const dy = e.clientY - lastMousePosRef.current.y;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        
        setTransform(prev => {
            const newX = prev.x + dx;
            const newY = prev.y + dy;

            const contentWidth = CANVAS_WIDTH * prev.scale;
            const contentHeight = CANVAS_HEIGHT * prev.scale;

            let clampedX = newX;
            if (contentWidth < viewWidth) {
                clampedX = (viewWidth - contentWidth) / 2;
            } else {
                clampedX = Math.max(viewWidth - contentWidth, Math.min(newX, 0));
            }

            let clampedY = newY;
            if (contentHeight < viewHeight) {
                clampedY = (viewHeight - contentHeight) / 2;
            } else {
                clampedY = Math.max(viewHeight - contentHeight, Math.min(newY, 0));
            }

            return { ...prev, x: clampedX, y: clampedY };
        });
    }
  }, [drawingWire, transform]);

  const handleMouseUp = (e: React.MouseEvent) => { isPanningRef.current = false; (e.currentTarget as HTMLElement).style.cursor = 'grab'; };
  
  const handleDownloadImage = async () => { if (!captureRef.current || isDownloading) return; if (typeof (window as any).html2canvas === 'undefined') { alert('Image generation library is not available. Please check your connection.'); console.error('html2canvas is not defined'); return; } setIsDownloading(true); try { const canvasElement = await (window as any).html2canvas(captureRef.current, { backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb', scale: 1.5, logging: false, useCORS: true, }); const link = document.createElement('a'); link.href = canvasElement.toDataURL('image/jpeg', 0.95); link.download = `${board.id}-lab-diagram.jpeg`; link.click(); } catch (error) { console.error("Failed to download image:", error); } finally { setIsDownloading(false); } };
  
  const handleDownloadPdf = async () => {
    if (!captureRef.current || isDownloadingPdf) return;
    if (!projectData && !challenge) {
        alert("Please generate a project first to download the PDF report.");
        return;
    }
    if (typeof (window as any).jspdf === 'undefined' || typeof (window as any).html2canvas === 'undefined') {
        alert('PDF generation library is not available. Please check your connection.');
        console.error('jspdf or html2canvas is not defined');
        return;
    }
    setIsDownloadingPdf(true);
    try {
        const { jsPDF } = (window as any).jspdf;
        const canvasElement = await (window as any).html2canvas(captureRef.current, {
            backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
            scale: 2,
            logging: false,
            useCORS: true,
        });
        const imgData = canvasElement.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const margin = 40;
        let yPos = margin;
        const pageHeight = pdf.internal.pageSize.getHeight();
        const addTitle = (title: string) => {
            pdf.setFontSize(22).setFont(undefined, 'bold');
            pdf.text(title, pdfWidth / 2, yPos, { align: 'center' });
            yPos += 30;
        };
        const addSection = (title: string, body: string, isCode: boolean = false) => {
            const lineHeight = isCode ? 10 : 12;
            const font = isCode ? 'Courier' : 'Helvetica';
            const fontSize = isCode ? 9 : 10;
            if (yPos + 40 > pageHeight - margin) {
                pdf.addPage();
                yPos = margin;
            }
            pdf.setFontSize(16).setFont(undefined, 'bold');
            pdf.text(title, margin, yPos);
            yPos += 25;
            pdf.setFontSize(fontSize).setFont(font, 'normal');
            const lines = pdf.splitTextToSize(body, pdfWidth - margin * 2);
            lines.forEach((line: string) => {
                if (yPos + lineHeight > pageHeight - margin) {
                    pdf.addPage();
                    yPos = margin;
                }
                pdf.text(line, margin, yPos);
                yPos += lineHeight;
            });
            yPos += 20;
        };
        addTitle(projectName);
        if (projectIdea) addSection('Project Idea', projectIdea);
        if (!challenge && Object.keys(suggestedComponents).length > 0) {
            const componentsText = Object.entries(suggestedComponents).map(([id, count]) => {
                const component = availableComponents.find(c => c.id === id);
                return `- ${component ? component.name : id} (x${count})`;
            }).join('\n');
            addSection('Suggested Components', componentsText);
        }
        const conns = challenge ? userConnections : projectData!.connections;
        (pdf as any).autoTable({
            startY: yPos,
            head: [['From', 'Pin', 'To', 'Pin']],
            body: conns.map(c => [c.from.ownerName, c.from.pin, c.to.ownerName, c.to.pin]),
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] },
            margin: { left: margin, right: margin }
        });
        yPos = (pdf as any).autoTable.previous.finalY + 20;

        pdf.addPage();
        yPos = margin;
        pdf.setFontSize(16).setFont(undefined, 'bold');
        pdf.text('Wiring Diagram', margin, yPos);
        yPos += 20;
        const imgProps = pdf.getImageProperties(imgData);
        const aspect = imgProps.height / imgProps.width;
        const availableWidth = pdfWidth - margin * 2;
        const calculatedHeight = availableWidth * aspect;
        pdf.addImage(imgData, 'PNG', margin, yPos, availableWidth, calculatedHeight, undefined, 'FAST');
        
        pdf.addPage();
        yPos = margin;
        
        // Fix: Format projectData.code into a string before passing it to addSection.
        const codeBody = challenge 
            ? "User-written code available in the lab." 
            : projectData!.code.map(file => `// --- ${file.filename} ---\n\n${file.content}`).join('\n\n');
        
        const explanationBody = challenge ? challenge.goal : projectData!.explanation.replace(/\* /g, '• ');
        
        addSection('Project Code', codeBody, true);
        addSection('Explanation', explanationBody);

        pdf.save(`${projectName.replace(/\s/g, '_')}_Report.pdf`);
    } catch (error) {
        console.error("Failed to download PDF:", error);
    } finally {
        setIsDownloadingPdf(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); if (!canvasRef.current) return; const canvasRect = canvasRef.current.getBoundingClientRect(); const screenX = e.clientX - canvasRect.left; const screenY = e.clientY - canvasRect.top; const worldX = (screenX - transform.x) / transform.scale; const worldY = (screenY - transform.y) / transform.scale; const moveDataString = e.dataTransfer.getData('application/vnd.component-move'); if (moveDataString) { try { const { instanceId, offsetX, offsetY } = JSON.parse(moveDataString); const newX = worldX - (offsetX / transform.scale); const newY = worldY - (offsetY / transform.scale); onMove(instanceId, newX, newY); } catch (error) { console.error("Failed to parse move data", error); } return; } const componentData = e.dataTransfer.getData('application/json'); if (!componentData) return; try { const component = JSON.parse(componentData); const width = component.width || DROPPED_ITEM_WIDTHS[component.id] || DROPPED_ITEM_WIDTHS['default']; const x = worldX - (width / 2); const y = worldY - 24; const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE; const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE; onDrop(component.id, snappedX, snappedY); } catch (error) { console.error("Failed to parse dropped component data", error); } };

  const getPinPosition = useCallback((ownerId: string, pin: string): { x: number; y: number } | null => {
    if (ownerId.startsWith(board.id)) {
        const pinNameToFind = pin.trim().toUpperCase().replace(/\s/g, '');
        if (!pinNameToFind) return null;

        const boardPin = board.pinout?.find(p => {
            const defName = p.name.trim().toUpperCase().replace(/\s/g, '');
            if (defName === pinNameToFind) return true;

            const defBaseName = p.name.split('(')[0].trim().toUpperCase().replace(/\s/g, '');
            if (defBaseName === pinNameToFind) return true;
            
            const functionalMatch = p.name.match(/\((.*?)\)/);
            if (functionalMatch && functionalMatch[1]) {
                const funcName = functionalMatch[1].trim().toUpperCase().replace(/\s/g, '');
                if (funcName === pinNameToFind) return true;
            }
            
            // Handle aliases like 3V3 vs 3.3V
            if ((pinNameToFind === '3V3' || pinNameToFind === '3.3V') && p.name.includes('3.3V')) {
                return true;
            }
            if (pinNameToFind === '5V' && p.name.includes('5V')) {
                return true;
            }
            if ((pinNameToFind === 'GND' || pinNameToFind === 'GROUND') && p.name.toUpperCase().includes('GND')) {
                return true;
            }

            const defUnderscoreBaseName = p.name.split('_')[0].trim().toUpperCase().replace(/\s/g, '');
            if (defUnderscoreBaseName === pinNameToFind) return true;

            return false;
        });
        
        if (boardPin) {
            const boardX = (CANVAS_WIDTH - BOARD_WIDTH) / 2;
            const boardY = (CANVAS_HEIGHT - boardHeight) / 2;
            const pinX = boardX + boardPin.x * scaleX;
            const pinY = boardY + boardPin.y * scaleY;
            return { x: pinX, y: pinY };
        }
        return null;
    }

    const component = droppedComponents.find(c => c.instanceId === ownerId);
    if (!component) return null;
    
    const pinNameToFind = pin.trim().toUpperCase().replace(/\s/g, '');

    if (component.id === 'keypad-4x4') {
        if (!component.pinout) return null;
        const keypadWidth = 182;
        const keypadHeight = 182;
        const pinIndex = component.pinout.findIndex(p => p.pin.trim().toUpperCase().replace(/\s/g, '') === pinNameToFind);
        if (pinIndex === -1) return null;

        const spacing = keypadWidth / (component.pinout.length + 1);
        const pinX = component.x + spacing * (pinIndex + 1);
        const pinY = component.y + keypadHeight + 8;
        return { x: pinX, y: pinY };
    }

    if (component.id === 'breadboard') {
        let pinKey = pin.toUpperCase().replace(/\s/g, '');
        const powerAliases = ['VCC', '+5V', '+3.3V', 'POWER', '5V', '3.3V'];
        const groundAliases = ['GND', 'GROUND'];
        if (powerAliases.includes(pinKey)) pinKey = '+';
        else if (groundAliases.includes(pinKey)) pinKey = '-';
        const railPatternMatch = pinKey.match(/^([+-])([AB])(\d*)$/);
        if (railPatternMatch) {
            const rail = railPatternMatch[2] === 'A' ? 'T' : 'B';
            pinKey = `${railPatternMatch[1]}${rail}${railPatternMatch[3] || '0'}`;
        }
        const simpleRailMatch = pinKey.match(/^([+-])(\d+)$/);
        if (simpleRailMatch) pinKey = `${simpleRailMatch[1]}T${simpleRailMatch[2]}`;
        if (pinKey === '+T' || pinKey === '+A') pinKey = '+T0';
        if (pinKey === '-T' || pinKey === '-A') pinKey = '-T0';
        if (pinKey === '+B') pinKey = '+B0';
        if (pinKey === '-B') pinKey = '-B0';
        let pinCoord = BREADBOARD_PIN_INFO[pinKey];
        if (!pinCoord) {
            if (pinKey.includes('+') || pinKey.includes('POS') || pinKey.includes('VCC')) pinCoord = BREADBOARD_PIN_INFO['+T0'];
            else if (pinKey.includes('-') || pinKey.includes('NEG') || pinKey.includes('GND')) pinCoord = BREADBOARD_PIN_INFO['-T0'];
        }
        return pinCoord ? { x: component.x + pinCoord.x, y: component.y + pinCoord.y } : null;
    }
    if (component.id === 'l298n') { const pinCoord = L298N_PIN_INFO[pinNameToFind]; return pinCoord ? { x: component.x + pinCoord.x, y: component.y + pinCoord.y } : null; }
    if (component.id === 'lora-rfm9x') { const pinCoord = LORA_PIN_INFO[pinNameToFind]; return pinCoord ? { x: component.x + pinCoord.x, y: component.y + pinCoord.y } : null; }
    if (component.id === 'nodemcu-esp8266') {
      const pinCoord = NODEMCU_PIN_INFO[pinNameToFind];
      if (!pinCoord) return null;
      const scale = 128 / 256;
      return { x: component.x + pinCoord.x * scale, y: component.y + pinCoord.y * scale };
    }
    if (component.pinout?.some(p => typeof p.x === 'number' && typeof p.y === 'number')) {
         const pinInfo = component.pinout.find(p => p.pin.trim().toUpperCase().replace(/\s/g, '') === pinNameToFind);
         if (pinInfo && typeof pinInfo.x === 'number' && typeof pinInfo.y === 'number') {
            const componentWidth = component.width || 256;
            const svgViewBoxWidth = (component as any).svgViewBoxWidth || 512;
            const svgViewBoxHeight = (component as any).svgViewBoxHeight || svgViewBoxWidth;
            const aspectRatio = svgViewBoxHeight / svgViewBoxWidth;
            const componentHeight = componentWidth * aspectRatio;
            const scaleX = componentWidth / svgViewBoxWidth;
            const scaleY = componentHeight / svgViewBoxHeight;
            return { x: component.x + pinInfo.x * scaleX, y: component.y + pinInfo.y * scaleY };
        }
    }

    const componentWidth = component.width || DROPPED_ITEM_WIDTHS[component.id] || DROPPED_ITEM_WIDTHS.default;
    const componentHeight = 44;
    const pinPositions = getPinLayout(component.pinout, componentWidth, componentHeight);
    const targetPin = pinPositions.find(p => p.name.trim().toUpperCase().replace(/\s/g, '') === pinNameToFind);

    if (targetPin) {
        const pinY = component.y + targetPin.y + 8;
        const pinX = component.x + targetPin.x + (targetPin.x === 0 ? -4 : 4);
        return { x: pinX, y: pinY };
    }
    return null;
  }, [board, droppedComponents, boardHeight, scaleX, scaleY]);

  const allPins = useMemo(() => {
    const pins: { pinId: PinIdentifier; pos: { x: number; y: number } }[] = [];
    board.pinout?.forEach(pinInfo => {
        const pos = getPinPosition(`${board.id}-board`, pinInfo.name);
        if(pos) pins.push({ pinId: { ownerId: `${board.id}-board`, ownerName: board.name, pin: pinInfo.name }, pos });
    });
    droppedComponents.forEach(comp => {
        if(comp.id === 'breadboard') {
            Object.keys(BREADBOARD_PIN_INFO).forEach(pinName => {
                if (/^[A-J]\d+$/.test(pinName) || /^[+-][TB]\d+$/.test(pinName)) {
                    const pos = getPinPosition(comp.instanceId, pinName);
                    if (pos) pins.push({ pinId: { ownerId: comp.instanceId, ownerName: comp.displayName, pin: pinName }, pos });
                }
            });
        } else {
            comp.pinout?.forEach(pinInfo => {
                const pos = getPinPosition(comp.instanceId, pinInfo.pin);
                if (pos) pins.push({ pinId: { ownerId: comp.instanceId, ownerName: comp.displayName, pin: pinInfo.pin }, pos });
            });
        }
    });
    return pins;
  }, [board, droppedComponents, getPinPosition]);

  const handlePinMouseDown = (pin: { pinId: PinIdentifier; pos: { x: number; y: number } }, e: React.MouseEvent) => {
    if (!challenge) return;
    e.stopPropagation();
    setDrawingWire({ from: pin.pinId, to: pin.pos });
  };

  const handlePinMouseUp = (pin: { pinId: PinIdentifier; pos: { x: number; y: number } }) => {
    if (drawingWire && drawingWire.from.ownerId !== pin.pinId.ownerId || drawingWire.from.pin !== pin.pinId.pin) {
        onUserConnectionsChange([...userConnections, { from: drawingWire.from, to: pin.pinId }]);
    }
    setDrawingWire(null);
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setDrawingWire(null);
    if(drawingWire) window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [drawingWire]);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if ((e.key === 'Delete' || e.key === 'Backspace') && selectedConnection) {
              onUserConnectionsChange(userConnections.filter(c => c !== selectedConnection));
              setSelectedConnection(null);
          }
      };
      if (challenge) {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }
  }, [selectedConnection, userConnections, onUserConnectionsChange, challenge]);

  const faultyConnections = useMemo(() => {
    const set = new Set<string>();
    wiringErrors.forEach(error => {
        error.faultyConnections.forEach(conn => {
            set.add(JSON.stringify(conn));
        });
    });
    return set;
  }, [wiringErrors]);

  const isLedOrBuzzerDataPin = (pinId: { ownerId: string, pin: string }): boolean => { const component = droppedComponents.find(c => c.instanceId === pinId.ownerId); if (!component) return false; const isTargetComponent = component.id.includes('led') || component.id.includes('buzzer'); if (!isTargetComponent) return false; const pinLower = pinId.pin.toLowerCase().trim(); return !['vcc', 'gnd', '5v', '3.3v', 'ground', 'cathode', 'g', '-', '+', 'positive (+)', 'negative (-)'].includes(pinLower); };
  const DATA_WIRE_COLORS = ['#4DD0E1', '#FFD54F', '#81C784', '#BA68C8', '#FF8A65', '#90A4AE']; let dataWireCounter = 0; const fullscreenClasses = isFullScreen ? 'fixed top-0 left-0 w-screen h-screen z-50' : 'relative';
  const connectionsToRender = challenge ? userConnections : projectData?.connections || [];
  
  const bgStyleLight = { backgroundColor: '#f9fafb' };
  const bgStyleDark = { backgroundColor: '#111827' };

  return ( <div ref={canvasContainerRef} className={`flex-grow h-full min-w-0 ${fullscreenClasses}`} style={theme === 'dark' ? bgStyleDark : bgStyleLight}> <div className="absolute top-4 right-4 z-30 flex items-center space-x-2"> <button onClick={handleDownloadImage} disabled={isDownloading} className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50" aria-label="Download as JPEG" title="Download as JPEG"> {isDownloading ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <DownloadIcon className="w-5 h-5" />} </button> <button onClick={handleDownloadPdf} disabled={isDownloadingPdf} className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50" aria-label="Download Project Report as PDF" title="Download Project Report as PDF"> {isDownloadingPdf ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <PdfFileIcon className="w-5 h-5" />} </button> <button onClick={onToggleFullScreen} className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white transition-colors" aria-label={isFullScreen ? 'Exit full screen' : 'Enter full screen'} title={isFullScreen ? 'Exit full screen' : 'Enter full screen'}> {isFullScreen ? <FullScreenExitIcon className="w-5 h-5" /> : <FullScreenEnterIcon className="w-5 h-5" />} </button> </div> <div className="absolute bottom-4 right-4 z-30 flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-full cursor-auto"> <button onClick={onAutoLayout} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white transition-colors" aria-label="Tidy up layout" title="Tidy Up"> <LayoutIcon className="w-5 h-5" /> </button> <button onClick={() => handleZoom(1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white transition-colors" aria-label="Zoom in"> <PlusIcon className="w-5 h-5" /> </button> <button onClick={() => handleZoom(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white transition-colors" aria-label="Zoom out"> <MinusIcon className="w-5 h-5" /> </button> <button onClick={handleResetView} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white transition-colors" aria-label="Reset view"> <ArrowPathIcon className="w-5 h-5" /> </button> </div> <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-2 rounded-full shadow-lg cursor-auto"> <button onClick={onRun} disabled={!hasSimulation || isSimulating || wiringErrors.length > 0} className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed" aria-label="Run simulation" title="Run Simulation"> <PlayIcon className="w-5 h-5" /> </button> <button onClick={onStop} disabled={!isSimulating} className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed" aria-label="Stop simulation" title="Stop Simulation"> <StopIcon className="w-5 h-5" /> </button> </div> <div ref={canvasRef} onDragOver={handleDragOver} onDrop={handleDrop} onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} className="w-full h-full overflow-auto cursor-grab" > <div ref={captureRef} className="relative" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0', }} > <div className="absolute" style={{ width: BOARD_WIDTH, height: boardHeight, left: `${(CANVAS_WIDTH - BOARD_WIDTH) / 2}px`, top: `${(CANVAS_HEIGHT - boardHeight) / 2}px`, }} > <BoardDisplay board={board} /> </div> {droppedComponents.map((component) => ( <DroppedItem key={component.instanceId} component={component} simulationState={componentStates[component.instanceId]} isSimulating={isSimulating} userInputValue={userInputs[component.instanceId]} onUserInput={onUserInput} simulationInputError={simulationInputErrors[component.instanceId]} onHover={handleComponentHover} /> ))} {challenge && allPins.map(pin => ( <div key={`${pin.pinId.ownerId}-${pin.pinId.pin}`} className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 z-30 rounded-full cursor-crosshair hover:bg-cyan-500/50" style={{ left: pin.pos.x, top: pin.pos.y, }} onMouseDown={(e) => handlePinMouseDown(pin, e)} onMouseUp={() => handlePinMouseUp(pin)} /> ))} <svg className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none" aria-hidden="true">
                <style> {`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`} </style>
                {connectionsToRender.map((conn, index) => { const start = getPinPosition(conn.from.ownerId, conn.from.pin); const end = getPinPosition(conn.to.ownerId, conn.to.pin); if (!start || !end) { console.warn("Could not find pin position for connection:", conn); return null; } const isFaulty = faultyConnections.has(JSON.stringify(conn)); const isSelected = selectedConnection && JSON.stringify(conn) === JSON.stringify(selectedConnection); const fromPinLower = conn.from.pin.toLowerCase().trim(); let color; if (fromPinLower.startsWith('5v') || fromPinLower.startsWith('3.3v') || fromPinLower.startsWith('vin') || fromPinLower === '+' || fromPinLower.includes('positive')) { color = '#EF5350'; } else if (fromPinLower.startsWith('gnd') || fromPinLower === '-' || fromPinLower.includes('negative')) { color = '#424242'; } else { color = DATA_WIRE_COLORS[dataWireCounter % DATA_WIRE_COLORS.length]; dataWireCounter++; } const needsResistor = isLedOrBuzzerDataPin(conn.from) || isLedOrBuzzerDataPin(conn.to); let d; if (needsResistor) { const vx = end.x - start.x; const vy = end.y - start.y; const len = Math.sqrt(vx*vx + vy*vy); const resWidth = 30; if (len < resWidth * 1.5) { d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`; } else { const nx = vx / len; const ny = vy / len; const px = -ny; const py = nx; const resHeight = 10; const midX = start.x + vx / 2; const midY = start.y + vy / 2; const p1x = midX - nx * (resWidth / 2); const p1y = midY - ny * (resWidth / 2); const p2x = p1x + nx * (resWidth/4) + px * (resHeight/2); const p2y = p1y + ny * (resWidth/4) + py * (resHeight/2); const p3x = p1x + nx * (resWidth*3/4) - px * (resHeight/2); const p3y = p1y + ny * (resWidth*3/4) - py * (resHeight/2); const p4x = midX + nx * (resWidth / 2); const p4y = midY + ny * (resWidth / 2); d = `M ${start.x} ${start.y} L ${p1x} ${p1y} L ${p2x} ${p2y} L ${p3x} ${p3y} L ${p4x} ${p4y} L ${end.x} ${end.y}`; } } else { d = `M ${start.x} ${start.y} C ${start.x + (end.x - start.x) * 0.5} ${start.y}, ${end.x - (end.x - start.x) * 0.5} ${end.y}, ${end.x} ${end.y}`; } return ( <path key={`wire-${index}`} className={challenge || isFaulty ? "" : "wire-path"} d={d} stroke={isFaulty ? '#f44336' : color} strokeWidth={isSelected ? "4.5" : "2.5"} fill="none" strokeLinecap="round" strokeDasharray={isFaulty ? '5 5' : 'none'} style={{ pointerEvents: 'stroke', filter: isSelected ? 'drop-shadow(0 0 3px #06b6d4)' : 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setSelectedConnection(conn); }} /> ); })} 
                {drawingWire && (() => {
                    const start = getPinPosition(drawingWire.from.ownerId, drawingWire.from.pin);
                    if (!start) return null;
                    return <path d={`M ${start.x} ${start.y} L ${drawingWire.to.x} ${drawingWire.to.y}`} stroke="#06b6d4" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="5 5" />;
                })()}
                {selectedConnection && (() => {
                    const start = getPinPosition(selectedConnection.from.ownerId, selectedConnection.from.pin);
                    const end = getPinPosition(selectedConnection.to.ownerId, selectedConnection.to.pin);
                    if (!start || !end) return null;
                    const EndpointLabel = ({ point, pinId }: { point: {x:number, y:number}, pinId: PinIdentifier}) => { const textContent = `${pinId.ownerName}: ${pinId.pin}`; const textWidth = textContent.length * 6; const rectWidth = textWidth + 10; const side = (point.x + 12 + rectWidth) > CANVAS_WIDTH ? 'left' : 'right'; const rectX = side === 'right' ? point.x + 12 : point.x - 12 - rectWidth; const textX = side === 'right' ? point.x + 17 : point.x - 17; const textAnchor = side === 'right' ? 'start' : 'end'; return ( <g> <circle cx={point.x} cy={point.y} r="8" fill="#06b6d4" stroke="white" strokeWidth="2" /> <rect x={rectX} y={point.y - 10} width={rectWidth} height="20" rx="3" fill="rgba(0,0,0,0.7)" /> <text x={textX} y={point.y + 4} fontFamily="monospace" fontSize="10" fill="white" textAnchor={textAnchor}> {textContent} </text> </g> ) };
                    return ( <g className="pointer-events-none" style={{animation: 'fadeIn 0.2s ease-out'}}> <EndpointLabel point={start} pinId={selectedConnection.from} /> <EndpointLabel point={end} pinId={selectedConnection.to} /> </g> );
                })()}
            </svg> </div> </div> {hoveredComponent && ( <ComponentInspector component={hoveredComponent.component} position={hoveredComponent.position} /> )} </div> );
};

export default LabCanvas;