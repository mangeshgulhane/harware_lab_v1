import type { FC, SVGProps } from 'react';

export interface SimulationValidationRule {
  type: 'number' | 'regex';
  min?: number;
  max?: number;
  pattern?: string; // for regex type
  errorMessage: string;
}

export interface Component {
  id: string;
  name: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
  description?: string;
  voltage?: string;
  pinout?: { pin: string; description: string; x?: number; y?: number }[];
  width?: number;
  svgViewBoxWidth?: number;
  svgViewBoxHeight?: number;
  category: string;
  simulation?: {
    isInput: boolean;
    validationRule?: SimulationValidationRule;
  };
}

export interface PinIdentifier {
  ownerId: string; // instanceId, or special IDs like 'raspberry-pi-board', 'arduino-r3-board'
  ownerName: string; // The display name of the owner, e.g., 'Raspberry Pi', 'LED'
  pin: string; // e.g., 'GPIO17', 'Anode', 'J10', '+a'
}

export interface Connection {
  from: PinIdentifier;
  to: PinIdentifier;
}

export interface SimulationStep {
    timestamp: number; // in milliseconds from the start of the simulation
    instanceId: string; // which component is affected
    action: 'on' | 'off' | 'rotate' | 'display' | 'setInput';
    value?: string | number; // e.g., angle for servo, text for LCD, value for sensor
    line?: number; // for LCD line number
}

export interface TriggerAction {
    instanceId: string;
    action: 'on' | 'off' | 'rotate' | 'display';
    value?: string | number;
    line?: number;
}

export interface SimulationTrigger {
    source: {
        instanceId: string;
        condition: '==' | '!=' | '>' | '<' | '>=' | '<=';
        value: string | number;
    };
    actions: TriggerAction[];
}

export interface UnifiedGeminiResponse {
  connections: Connection[];
  code: { filename: string; content: string; }[];
  explanation: string;
  simulationSteps?: SimulationStep[];
  simulationTriggers?: SimulationTrigger[];
}

export interface DroppedComponent extends Component {
  x: number;
  y: number;
  instanceId:string;
  displayName: string;
}

export interface ComponentState {
    isOn?: boolean;
    color?: string; // For RGB LED color
    brightness?: number; // For PWM controlled components like LEDs (0-1)
    angle?: number;
    textLine1?: string;
    textLine2?: string;
    inputValue?: string | number;
    isPressed?: boolean;
    // New states for new components
    isSpinning?: boolean; // For DC Motor
    displayValue?: string; // For 7-segment (e.g., "1111110") or Dot Matrix (e.g., "heart")
    pressedKey?: string; // For Keypad
}

export interface SavedProject {
  id: string; // e.g., timestamp
  name: string;
  author?: string;
  isPublic?: boolean;
  boardType: string; // e.g. 'raspberry-pi', 'arduino', or custom id
  createdAt: string; // ISO string
  // The entire state needed to restore the lab
  state: {
    droppedComponents: DroppedComponent[];
    projectData: UnifiedGeminiResponse | null;
    projectIdea: string;
    suggestedComponents: Record<string, number>;
  };
}

// For project scaffolding
export interface PlacedComponent {
  id: string; // 'led'
  instanceId: string; // 'led-16782'
  displayName: string; // 'LED 1'
  x: number;
  y: number;
}

export interface ProjectScaffoldResponse extends UnifiedGeminiResponse {
  placedComponents: PlacedComponent[];
}


// Admin Panel Types
export type PinType = 'power-5v' | 'power-3.3v' | 'gnd' | 'gpio' | 'i2c-sda' | 'i2c-scl' | 'spi-mosi' | 'spi-miso' | 'spi-sclk' | 'spi-cs' | 'uart-tx' | 'uart-rx' | 'analog' | 'vin' | 'aref' | 'id' | 'unknown';

export interface BoardPin {
  name: string; // e.g., GPIO17, D13, 5V
  x: number; // x-coordinate relative to board SVG viewBox
  y: number; // y-coordinate relative to board SVG viewBox
  type: PinType;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  boardComponent?: string; // Can hold a component key like 'RaspberryPiBoard' or a full SVG string
  language: 'Python' | 'C++';
  pinout?: BoardPin[];
}

// Stored in localStorage, uses string for Icon
export interface StoredComponent {
  id: string;
  name: string;
  Icon: string; // Key from iconMap
  description?: string;
  voltage?: string;
  pinout?: { pin: string; description: string; x?: number; y?: number }[];
  supportedBoards: string[]; // Array of board IDs
  width?: number;
  svgViewBoxWidth?: number;
  svgViewBoxHeight?: number;
  category: string;
  simulation?: {
    isInput: boolean;
    validationRule?: SimulationValidationRule;
  };
}

export interface AdminData {
  boards: Board[];
  components: StoredComponent[];
}

export interface WiringError {
  type: 'Short Circuit' | 'Voltage Mismatch' | 'Missing Ground' | 'GPIO to Power';
  message: string;
  faultyConnections: Connection[];
}

// Challenge Mode Types
export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  boardId: string; // 'raspberry-pi' or 'arduino'
  goal: string;
  availableComponentIds: string[];
  successConditionPrompt: string; // A prompt for the AI to check for success
  mcq: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
  };
}

export interface ChallengeEvaluationResponse {
  isCorrect: boolean;
  feedback: string; // Constructive feedback or congratulations
}

export interface HintResponse {
    hint: string;
}

export interface CodeUpdateResponse {
  code: string;
  explanation: string;
  simulationSteps?: SimulationStep[];
  simulationTriggers?: SimulationTrigger[];
  errors?: string[];
  connections?: Connection[];
}

// Academy Types
export interface AcademySubTopic {
  id: string;
  title: string;
  content: string;
  AnimationComponent: FC | null;
}

export interface AcademyTopic {
  id: string;
  title: string;
  subTopics: AcademySubTopic[];
}
// FIX: Add missing types for Academy/Tutorial feature.
export interface StepValidation {
  type: 'placeComponent' | 'createConnection' | 'mcq' | 'checkCode';
  params: {
    componentId?: string;
    from?: { owner: 'board' | 'breadboard' | 'led' | string; pin: string };
    to?: { owner: 'board' | 'breadboard' | 'led' | string; pin: string };
    mcq?: {
      question: string;
      options: string[];
      correctAnswerIndex: number;
    };
    codeCheck?: {
      keywords: string[];
    };
  };
  errorMessage: string;
}

export interface Step {
  type: 'concept' | 'task';
  title: string;
  content: string;
  illustration?: string;
  highlight?: { type: 'pin'; ownerId: string; pin: string };
  task?: {
    instruction: string;
    validation: StepValidation;
  };
}

export interface Lesson {
  id: string;
  title: string;
  steps: Step[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  boardId: string;
  modules: Module[];
}

// Shop Types
export interface KitSensor {
  type: string;
  name: string;
  purpose: string;
}

export interface ProductKit {
  id: string;
  name: string;
  goal: string;
  sensors: KitSensor[];
  imagePlaceholder: string;
}

// API Logging Types
export interface ApiLogTokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface ApiLog {
  logId: string; // auto-generated by Firestore
  transactionId: string;
  userId: string;
  timestamp: string; // Firestore Server Timestamp as ISO string
  apiEndpoint: string;
  llmProvider: string;
  modelUsed: string;
  isSuccess: boolean;
  durationMs: number;
  tokenUsage: ApiLogTokenUsage | null;
  errorDetails: object | null;
  // FIX: Add missing properties for API logging to resolve type errors in backend/src/index.ts
  retryAttempt?: number;
  requestPayloadSummary?: any;
}

// User Authentication Types
export interface UserProfile {
  uid: string;
  email: string;
  plan: 'explorer' | 'creator' | 'pro';
  projectCount: number;
  projectLimit: number;
}