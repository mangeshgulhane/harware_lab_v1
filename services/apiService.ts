import type { UnifiedGeminiResponse, DroppedComponent, BoardPin, ProjectScaffoldResponse, Component, Connection, ChallengeEvaluationResponse, HintResponse, CodeUpdateResponse, Board, WiringError, SavedProject, ApiLog } from '../types';

// --- UNIFIED BACKEND URL ---
// For local development, you will run one backend server.
const BACKEND_URL = 'http://localhost:3001'; // The unified AI and Database service
// -------------------------

// Helper function to handle API calls to a specific base URL
async function callApi<T>(baseUrl: string, endpoint: string, method: 'POST' | 'PUT' | 'GET' | 'DELETE', body?: any): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  let url = `${baseUrl}/api${endpoint}`;
  if (method === 'GET' && body) {
    const params = new URLSearchParams(body);
    url += `?${params.toString()}`;
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorBody = await response.text();
      // Handle feasibility check failure specifically
      if (response.status === 422) {
          try {
              const parsedError = JSON.parse(errorBody);
              const feasibilityError = new Error(parsedError.reason || 'Project is not feasible.');
              (feasibilityError as any).details = parsedError;
              throw feasibilityError;
          } catch (e) {
              // Fallback if the body is not JSON
              throw new Error(`Project not feasible: ${errorBody}`);
          }
      }
      console.error("API Error Body:", errorBody);
      throw new Error(`API error! Status: ${response.status} from ${url}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling endpoint ${endpoint} on ${baseUrl}:`, error);
    if (error instanceof Error) {
        throw error; // Re-throw the original error (could be our custom one)
    }
    throw new Error('An unknown network error occurred.');
  }
}

// --- Project Persistence (Calls BACKEND_URL) ---
export const loadProjects = (boardType: string): Promise<SavedProject[]> => {
  return callApi<SavedProject[]>(BACKEND_URL, '/projects', 'GET', { boardType });
};

export const loadCommunityProjects = (): Promise<SavedProject[]> => {
  return callApi<SavedProject[]>(BACKEND_URL, '/community-projects', 'GET');
};

export const saveProject = async (project: SavedProject): Promise<SavedProject> => {
  if (project.id && !project.id.startsWith('proj_')) {
    // Existing project, use PUT
    await callApi(BACKEND_URL, `/projects/${project.id}`, 'PUT', project);
    return project;
  } else {
    // New project, use POST
    const { id, ...newProjectData } = project;
    return callApi(BACKEND_URL, '/projects', 'POST', newProjectData);
  }
};

export const deleteProject = (projectId: string): Promise<void> => {
  return callApi(BACKEND_URL, `/projects/${projectId}`, 'DELETE');
};

// --- Admin & Reporting Endpoints ---
export const loadApiLogs = (): Promise<ApiLog[]> => {
  return callApi<ApiLog[]>(BACKEND_URL, '/api-logs', 'GET');
};


// --- AI/LLM Endpoints (Calls BACKEND_URL) ---
export const checkProjectFeasibility = async (projectIdea: string, availableComponentIds: string[], transactionId: string): Promise<{ feasible: boolean }> => {
    return callApi(BACKEND_URL, '/checkProjectFeasibility', 'POST', { projectIdea, availableComponentIds, transactionId });
};

export const getComponentSuggestionsForPi = async (idea: string, availableIds: string[], transactionId: string): Promise<{id: string; count: number}[]> => {
    const result = await callApi<{components: {id: string; count: number}[]}>(BACKEND_URL, '/getComponentSuggestionsForPi', 'POST', { idea, availableIds, transactionId, retryAttempt: 1 });
    return result.components || [];
};

export const getUnifiedProjectInfo = async (
    components: DroppedComponent[], 
    projectIdea: string,
    boardId: string,
    boardName: string,
    boardPinout: { name: string }[],
    errors: WiringError[] | undefined,
    transactionId: string,
    retryAttempt: number
): Promise<UnifiedGeminiResponse> => {
  return callApi<UnifiedGeminiResponse>(BACKEND_URL, '/getUnifiedProjectInfo', 'POST', { components, projectIdea, boardId, boardName, boardPinout, errors, transactionId, retryAttempt });
};

export const getComponentSuggestionsForArduino = async (idea: string, availableIds: string[], transactionId: string): Promise<{id: string; count: number}[]> => {
    const result = await callApi<{components: {id: string; count: number}[]}>(BACKEND_URL, '/getComponentSuggestionsForArduino', 'POST', { idea, availableIds, transactionId, retryAttempt: 1 });
    return result.components || [];
};

export const getArduinoUnifiedProjectInfo = async (
    components: DroppedComponent[], 
    projectIdea: string,
    boardId: string,
    boardName: string,
    boardPinout: { name: string }[],
    errors: WiringError[] | undefined,
    transactionId: string,
    retryAttempt: number
): Promise<UnifiedGeminiResponse> => {
    return callApi<UnifiedGeminiResponse>(BACKEND_URL, '/getArduinoUnifiedProjectInfo', 'POST', { components, projectIdea, boardId, boardName, boardPinout, errors, transactionId, retryAttempt });
};

export const getProjectScaffoldForPi = async (
    projectIdea: string,
    availableComponents: Component[],
    boardId: string,
    boardName: string,
    boardPinout: { name: string }[],
    errors: WiringError[] | undefined,
    transactionId: string,
    retryAttempt: number
): Promise<ProjectScaffoldResponse> => {
    return callApi<ProjectScaffoldResponse>(BACKEND_URL, '/getProjectScaffoldForPi', 'POST', { projectIdea, availableComponents, boardId, boardName, boardPinout, errors, transactionId, retryAttempt });
};

export const getProjectScaffoldForArduino = async (
    projectIdea: string,
    availableComponents: Component[],
    boardId: string,
    boardName: string,
    boardPinout: { name: string }[],
    errors: WiringError[] | undefined,
    transactionId: string,
    retryAttempt: number
): Promise<ProjectScaffoldResponse> => {
    return callApi<ProjectScaffoldResponse>(BACKEND_URL, '/getProjectScaffoldForArduino', 'POST', { projectIdea, availableComponents, boardId, boardName, boardPinout, errors, transactionId, retryAttempt });
};

export const getComponentDetails = async (componentName: string): Promise<{description: string; voltage: string; pinout: {pin: string; description: string}[]; svgIconString: string;}> => {
    return callApi(BACKEND_URL, '/getComponentDetails', 'POST', { componentName, transactionId: `admin-${Date.now()}` });
}

export const getBoardDetails = async (boardName: string, additionalPrompt?: string): Promise<{ description: string; language: 'Python' | 'C++'; svgSchematicStrings: string[]; pinout: BoardPin[]; }> => {
    return callApi(BACKEND_URL, '/getBoardDetails', 'POST', { boardName, additionalPrompt, transactionId: `admin-${Date.now()}` });
};

export const getBoardNameSuggestions = async (query: string): Promise<string[]> => {
    const result = await callApi<{suggestions: string[]}>(BACKEND_URL, '/getBoardNameSuggestions', 'POST', { query, transactionId: `admin-${Date.now()}` });
    return result.suggestions || [];
};

export const evaluateChallengeSolution = async (
    goal: string,
    successCondition: string,
    components: DroppedComponent[],
    connections: Connection[],
    code: string,
    boardName: string,
    transactionId: string,
): Promise<ChallengeEvaluationResponse> => {
    return callApi(BACKEND_URL, '/evaluateChallengeSolution', 'POST', { goal, successCondition, components, connections, code, boardName, transactionId, retryAttempt: 1 });
};

export const getChallengeHint = async (
    goal: string,
    components: DroppedComponent[],
    connections: Connection[],
    code: string,
    boardName: string,
    transactionId: string,
): Promise<HintResponse> => {
    return callApi(BACKEND_URL, '/getChallengeHint', 'POST', { goal, components, connections, code, boardName, transactionId, retryAttempt: 1 });
};

export const updateSimulationFromCode = async (
    userCode: { filename: string; content: string; }[],
    components: DroppedComponent[],
    connections: Connection[],
    board: Board,
    transactionId: string,
): Promise<CodeUpdateResponse> => {
    return callApi(BACKEND_URL, '/updateSimulationFromCode', 'POST', { userCode, components, connections, board, transactionId, retryAttempt: 1 });
};