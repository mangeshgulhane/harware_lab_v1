// backend/src/index.ts
// FIX: Use standard express imports to resolve type conflicts.
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import { AIProvider } from './providers/types';
import { PromptFactory } from './services/promptFactory';
import { GeminiProvider } from './providers/geminiProvider';
import { OpenAICompatibleProvider } from './providers/openAICompatibleProvider';
import { ApiLog, SavedProject } from '../../types';

dotenv.config();

let db: admin.firestore.Firestore | null = null;

// --- Firebase Admin SDK Initialization ---
try {
    const serviceAccount = require('../../serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log("Firebase Admin SDK initialized successfully.");
} catch (error) {
    console.log("Could not initialize Firebase Admin SDK. This is optional. To enable project saving, place 'serviceAccountKey.json' in the project root.");
}
// -----------------------------------------

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const promptFactory = new PromptFactory();
const DUMMY_USER_ID = "Dummy";

function getAIProvider(): AIProvider {
    const provider = process.env.LLM_PROVIDER?.toLowerCase();
    switch (provider) {
        case 'openai':
            const openaiApiKey = process.env.OPENAI_API_KEY;
            if (!openaiApiKey) throw new Error("OPENAI_API_KEY not found in .env for 'openai' provider");
            return new OpenAICompatibleProvider(openaiApiKey, 'https://api.openai.com/v1', 'gpt-4-turbo', promptFactory);
        case 'ollama':
            const ollamaBaseUrl = process.env.OLLAMA_BASE_URL;
            const ollamaModel = process.env.OLLAMA_MODEL;
            if (!ollamaBaseUrl) throw new Error("OLLAMA_BASE_URL not found in .env for 'ollama' provider");
            if (!ollamaModel) throw new Error("OLLAMA_MODEL not found in .env for 'ollama' provider");
            return new OpenAICompatibleProvider(undefined, ollamaBaseUrl, ollamaModel, promptFactory);
        case 'gemini':
        default:
            const geminiModel = process.env.GEMINI_MODEL || 'gemini-4-argon';
            const authMode = process.env.GEMINI_AUTH_MODE?.toLowerCase();

            if (authMode === 'vertex') {
                return new GeminiProvider({
                    vertexai: true,
                    project: process.env.GOOGLE_CLOUD_PROJECT,
                    location: process.env.GOOGLE_CLOUD_LOCATION || 'global',
                    model: geminiModel,
                }, promptFactory);
            } else {
                const geminiApiKey = process.env.API_KEY;
                if (!geminiApiKey) throw new Error("API_KEY (for Gemini) not found in .env");
                return new GeminiProvider({
                    apiKey: geminiApiKey,
                    model: geminiModel,
                }, promptFactory);
            }
        }
}

async function logApiCall(logData: Omit<ApiLog, 'logId' | 'timestamp'>) {
    if (!db) return;
    try {
        await db.collection('api_logs').add({
            ...logData,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
        // Log to console, but don't crash the main request if logging fails
        console.error("CRITICAL: Failed to write to api_logs collection:", error);
    }
}

async function handleAIRequest(req: Request, res: Response, handler: (provider: AIProvider, body: any) => Promise<any>) {
    const startTime = Date.now();
    let isSuccess = false;
    let errorDetails: object | null = null;
    let usageMetadata: any = null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { transactionId, retryAttempt, ...payload } = req.body;

    try {
        const aiProvider = getAIProvider();
        const providerResult = await handler(aiProvider, req.body);
        
        usageMetadata = providerResult.usageMetadata;
        isSuccess = true;
        
        res.json(providerResult.data);
    } catch (error) {
        isSuccess = false;
        console.error(`Error in AI endpoint ${req.path}:`, error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        errorDetails = { message, name: error instanceof Error ? error.name : 'UnknownError', stack: error instanceof Error ? error.stack : undefined };
        res.status(500).json({ error: `An error occurred while calling the AI provider: ${message}` });
    } finally {
        if (db) {
            const durationMs = Date.now() - startTime;
            
            const llmProvider = process.env.LLM_PROVIDER?.toLowerCase() || 'gemini';
            let modelUsed = '';
            if (llmProvider === 'gemini') modelUsed = process.env.GEMINI_MODEL || 'gemini-4-argon';
            else if (llmProvider === 'ollama') modelUsed = process.env.OLLAMA_MODEL || 'unknown';
            else if (llmProvider === 'openai') modelUsed = 'gpt-4-turbo';

            const logData: Omit<ApiLog, 'logId' | 'timestamp'> = {
                transactionId: transactionId || `no-txn-${Date.now()}`,
                retryAttempt: retryAttempt || 1,
                userId: DUMMY_USER_ID,
                apiEndpoint: req.path,
                llmProvider,
                modelUsed,
                isSuccess,
                durationMs,
                tokenUsage: usageMetadata ? {
                    inputTokens: usageMetadata.promptTokenCount || 0,
                    outputTokens: usageMetadata.candidatesTokenCount || 0,
                    totalTokens: usageMetadata.totalTokenCount || 0,
                } : null,
                requestPayloadSummary: {
                    idea: payload.projectIdea,
                    componentDisplayNames: (payload.components || []).map((c: any) => c.displayName),
                    hasErrors: !!payload.errors,
                    boardName: payload.boardName
                },
                errorDetails,
            };
            // Do not await this, so the response is not blocked
            logApiCall(logData);
        }
    }
}

// AI Endpoints
app.post('/api/checkProjectFeasibility', async (req: Request, res: Response) => {
    // This endpoint has custom logic and doesn't use the generic handleAIRequest
    const startTime = Date.now();
    let isSuccess = false;
    let errorDetails: object | null = null;
    let usageMetadata: any = null;
    const { projectIdea, availableComponentIds, transactionId } = req.body;

    try {
        const aiProvider = getAIProvider();
        const providerResult = await aiProvider.checkProjectFeasibility(projectIdea, availableComponentIds);
        
        usageMetadata = providerResult.usageMetadata;
        
        if (!providerResult.data.isFeasible) {
            isSuccess = true; // The API call succeeded, even if the project is not feasible
            res.status(422).json(providerResult.data.missingComponent);
        } else {
            isSuccess = true;
            res.json({ feasible: true });
        }
    } catch (error) {
        isSuccess = false;
        console.error(`Error in /api/checkProjectFeasibility:`, error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        errorDetails = { message, name: error instanceof Error ? error.name : 'UnknownError', stack: error instanceof Error ? error.stack : undefined };
        res.status(500).json({ error: `An error occurred during feasibility check: ${message}` });
    } finally {
        if (db) {
            const durationMs = Date.now() - startTime;
            const logData: Omit<ApiLog, 'logId' | 'timestamp'> = {
                transactionId: transactionId || `no-txn-${Date.now()}`,
                retryAttempt: 1,
                userId: DUMMY_USER_ID,
                apiEndpoint: req.path,
                llmProvider: process.env.LLM_PROVIDER?.toLowerCase() || 'gemini',
                modelUsed: process.env.GEMINI_MODEL || 'gemini-4-argon',
                isSuccess,
                durationMs,
                tokenUsage: usageMetadata ? {
                    inputTokens: usageMetadata.promptTokenCount || 0,
                    outputTokens: usageMetadata.candidatesTokenCount || 0,
                    totalTokens: usageMetadata.totalTokenCount || 0,
                } : null,
                requestPayloadSummary: { idea: projectIdea },
                errorDetails,
            };
            logApiCall(logData);
        }
    }
});
app.post('/api/getComponentSuggestionsForPi', (req: Request, res: Response) => handleAIRequest(req, res, (provider, body) => provider.getComponentSuggestionsForPi(body.idea, body.availableIds)));
app.post('/api/getUnifiedProjectInfo', (req: Request, res: Response) => handleAIRequest(req, res, (provider, body) => provider.getUnifiedProjectInfo(body.components, body.projectIdea, body.boardId, body.boardName, body.boardPinout, body.errors)));
app.post('/api/getComponentSuggestionsForArduino', (req: Request, res: Response) => handleAIRequest(req, res, (provider, body) => provider.getComponentSuggestionsForArduino(body.idea, body.availableIds)));
app.post('/api/getArduinoUnifiedProjectInfo', (req: Request, res: Response) => handleAIRequest(req, res, (provider, body) => provider.getArduinoUnifiedProjectInfo(body.components, body.projectIdea, body.boardId, body.boardName, body.boardPinout, body.errors)));
app.post('/api/getProjectScaffoldForPi', (req: Request, res: Response) => handleAIRequest(req, res, (provider, body) => provider.getProjectScaffoldForPi(body.projectIdea, body.availableComponents, body.boardId, body.boardName, body.boardPinout, body.errors)));
app.post('/api/getProjectScaffoldForArduino', (req: Request, res: Response) => handleAIRequest(req, res, (provider, body) => provider.getProjectScaffoldForArduino(body.projectIdea, body.availableComponents, body.boardId, body.boardName, body.boardPinout, body.errors)));
app.post('/api/getComponentDetails', (req: Request, res: Response) => handleAIRequest(req, res, (provider, body) => provider.getComponentDetails(body.componentName)));
app.post('/api/getBoardDetails', (req: Request, res: Response) => handleAIRequest(req, res, (provider, body) => provider.getBoardDetails(body.boardName, body.additionalPrompt)));
app.post('/api/getBoardNameSuggestions', (req: Request, res: Response) => handleAIRequest(req, res, (provider, body) => provider.getBoardNameSuggestions(body.query)));
app.post('/api/evaluateChallengeSolution', (req: Request, res: Response) => handleAIRequest(req, res, (provider, body) => provider.evaluateChallengeSolution(body.goal, body.successCondition, body.components, body.connections, body.code, body.boardName)));
app.post('/api/getChallengeHint', (req: Request, res: Response) => handleAIRequest(req, res, (provider, body) => provider.getChallengeHint(body.goal, body.components, body.connections, body.code, body.boardName)));
app.post('/api/updateSimulationFromCode', (req: Request, res: Response) => handleAIRequest(req, res, (provider, body) => provider.updateSimulationFromCode(body.userCode, body.components, body.connections, body.board)));

// --- Project Persistence Routes ---
app.get('/api/projects', async (req: Request, res: Response) => {
    if (!db) {
        return res.status(503).json({ error: "Database service is not configured. Please check server logs for setup instructions." });
    }
    const { boardType } = req.query;
    try {
        const snapshot = await db.collection('projects')
            .where('userId', '==', DUMMY_USER_ID)
            .where('boardType', '==', boardType)
            .get();
        const projects: SavedProject[] = [];
        snapshot.forEach(doc => {
            projects.push({ id: doc.id, ...doc.data() } as SavedProject);
        });
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Failed to fetch projects." });
    }
});

app.get('/api/community-projects', async (req: Request, res: Response) => {
    if (!db) {
        return res.status(503).json({ error: "Database service is not configured." });
    }
    try {
        const snapshot = await db.collection('projects')
            .where('isPublic', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();
        const projects: SavedProject[] = [];
        snapshot.forEach(doc => {
            projects.push({ id: doc.id, ...doc.data() } as SavedProject);
        });
        res.json(projects);
    } catch (error) {
        console.error("Error fetching community projects:", error);
        res.status(500).json({ error: "Failed to fetch community projects." });
    }
});

app.get('/api/api-logs', async (req: Request, res: Response) => {
    if (!db) {
        return res.status(503).json({ error: "Database service is not configured." });
    }
    try {
        const snapshot = await db.collection('api_logs')
            .orderBy('timestamp', 'desc')
            .limit(1000) // Prevent excessively large payloads
            .get();
        const logs: Partial<ApiLog>[] = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            // Firestore timestamp needs to be converted for safe JSON serialization
            const logEntry = { 
                logId: doc.id, 
                ...data,
                timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString(),
            };
            logs.push(logEntry);
        });
        res.json(logs);
    } catch (error) {
        console.error("Error fetching API logs:", error);
        res.status(500).json({ error: "Failed to fetch API logs." });
    }
});


app.post('/api/projects', async (req: Request, res: Response) => {
    if (!db) {
        return res.status(503).json({ error: "Database service is not configured. Please check server logs for setup instructions." });
    }
    try {
        const projectData = req.body;
        const docRef = await db.collection('projects').add({
            ...projectData,
            userId: DUMMY_USER_ID,
        });
        const newProject = await docRef.get();
        res.status(201).json({ id: newProject.id, ...newProject.data() });
    } catch (error) {
        console.error("Error saving new project:", error);
        res.status(500).json({ error: "Failed to save project." });
    }
});

app.put('/api/projects/:id', async (req: Request, res: Response) => {
    if (!db) {
        return res.status(503).json({ error: "Database service is not configured. Please check server logs for setup instructions." });
    }
    try {
        const projectId = req.params.id;
        const projectData = req.body;
        const projectRef = db.collection('projects').doc(projectId);
        const doc = await projectRef.get();
        if (!doc.exists || doc.data()?.userId !== DUMMY_USER_ID) {
            return res.status(404).json({ error: "Project not found or access denied." });
        }
        delete projectData.userId;
        await projectRef.set(projectData, { merge: true });
        res.status(200).json({ id: projectId, ...projectData });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Failed to update project." });
    }
});

app.delete('/api/projects/:id', async (req: Request, res: Response) => {
    if (!db) {
        return res.status(503).json({ error: "Database service is not configured. Please check server logs for setup instructions." });
    }
    try {
        const projectId = req.params.id;
        const projectRef = db.collection('projects').doc(projectId);
        const doc = await projectRef.get();
        if (!doc.exists || doc.data()?.userId !== DUMMY_USER_ID) {
             return res.status(404).json({ error: "Project not found or access denied." });
        }
        await projectRef.delete();
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Failed to delete project." });
    }
});

app.get('/', (req: Request, res: Response) => {
    res.send('Unified Backend Service is running.');
});

app.listen(port, () => {
  console.log(`[server]: Unified Backend Service is running at http://localhost:${port}`);
});
