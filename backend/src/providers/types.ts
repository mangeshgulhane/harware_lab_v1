import type {
  UnifiedGeminiResponse,
  ProjectScaffoldResponse,
  Component,
  BoardPin,
  WiringError,
  DroppedComponent,
  Connection,
  ChallengeEvaluationResponse,
  HintResponse,
  CodeUpdateResponse,
  Board,
} from '../../../types';

export interface AIProvider {
  checkProjectFeasibility(idea: string, availableIds: string[]): Promise<any>;

  getComponentSuggestionsForPi(idea: string, availableIds: string[]): Promise<any>;

  getUnifiedProjectInfo(
    components: DroppedComponent[],
    projectIdea: string,
    boardId: string,
    boardName: string,
    boardPinout: { name: string }[],
    errors?: WiringError[]
  ): Promise<any>;
  
  getComponentSuggestionsForArduino(idea: string, availableIds: string[]): Promise<any>;

  getArduinoUnifiedProjectInfo(
    components: DroppedComponent[],
    projectIdea: string,
    boardId: string,
    boardName: string,
    boardPinout: { name: string }[],
    errors?: WiringError[]
  ): Promise<any>;

  getProjectScaffoldForPi(
    projectIdea: string,
    availableComponents: Component[],
    boardId: string,
    boardName: string,
    boardPinout: { name: string }[],
    errors?: WiringError[]
  ): Promise<any>;

  getProjectScaffoldForArduino(
    projectIdea: string,
    availableComponents: Component[],
    boardId: string,
    boardName: string,
    boardPinout: { name: string }[],
    errors?: WiringError[]
  ): Promise<any>;

  getComponentDetails(componentName: string): Promise<any>;
  
  getBoardDetails(boardName: string, additionalPrompt?: string): Promise<any>;
  
  getBoardNameSuggestions(query: string): Promise<any>;
  
  evaluateChallengeSolution(
    goal: string,
    successCondition: string,
    components: DroppedComponent[],
    connections: Connection[],
    code: string,
    boardName: string
  ): Promise<any>;
  
  getChallengeHint(
    goal: string,
    components: DroppedComponent[],
    connections: Connection[],
    code: string,
    boardName: string
  ): Promise<any>;
  
  updateSimulationFromCode(
    userCode: { filename: string; content: string }[],
    components: DroppedComponent[],
    connections: Connection[],
    board: Board
  ): Promise<any>;
}