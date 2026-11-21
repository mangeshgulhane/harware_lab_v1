import { GoogleGenAI, Type } from "@google/genai";
import { AIProvider } from './types';
import { PromptFactory } from '../services/promptFactory';
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

// Schemas (specific to Gemini's responseSchema feature)
const feasibilityCheckSchema = {
    type: Type.OBJECT,
    properties: {
        isFeasible: { type: Type.BOOLEAN },
        missingComponent: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING }
            },
            nullable: true
        }
    },
    required: ["isFeasible"]
};
const pinIdentifierSchema = {
    type: Type.OBJECT,
    properties: {
        ownerId: { type: Type.STRING, description: "The unique instance ID of the component or a special ID for the main board (e.g., 'raspberry-pi-board', 'arduino-r3-board')." },
        ownerName: { type: Type.STRING, description: "The unique display name of the owner, e.g., 'Raspberry Pi', 'LED 1', 'Bluetooth Module 2'." },
        pin: { type: Type.STRING, description: "The name of the pin, e.g., 'GPIO17', 'Anode', 'J10' for breadboard row, '+a' for top power rail." }
    },
    required: ["ownerId", "ownerName", "pin"]
};
const simulationStepSchema = {
    type: Type.OBJECT,
    properties: {
        timestamp: { type: Type.INTEGER, description: "Time in milliseconds from the start of the simulation when this action occurs." },
        instanceId: { type: Type.STRING, description: "The instanceId of the component to be affected." },
        action: { type: Type.STRING, description: "The action to perform: 'on', 'off', 'rotate', 'display', 'setInput'." },
        value: { oneOf: [{ type: Type.STRING }, { type: Type.NUMBER }], description: "The value for the action (e.g., angle for 'rotate', text for 'display', sensor reading for 'setInput')." },
        line: { type: Type.INTEGER, description: "The line number (1 or 2) for LCD 'display' actions." }
    },
    required: ["timestamp", "instanceId", "action"]
};
const triggerActionSchema = {
    type: Type.OBJECT,
    properties: {
        instanceId: { type: Type.STRING },
        action: { type: Type.STRING, description: "'on', 'off', 'rotate', 'display'" },
        value: { oneOf: [{ type: Type.STRING }, { type: Type.NUMBER }] },
        line: { type: Type.INTEGER }
    },
    required: ["instanceId", "action"]
};
const simulationTriggerSchema = {
    type: Type.OBJECT,
    properties: {
        source: {
            type: Type.OBJECT,
            properties: {
                instanceId: { type: Type.STRING },
                condition: { type: Type.STRING, description: "'==', '!=', '>', '<', '>=', '<='" },
                value: { oneOf: [{ type: Type.STRING }, { type: Type.NUMBER }] }
            },
            required: ["instanceId", "condition", "value"]
        },
        actions: { type: Type.ARRAY, items: triggerActionSchema }
    },
    required: ["source", "actions"]
};
const codeFileSchema = {
    type: Type.OBJECT,
    properties: {
        filename: { type: Type.STRING, description: "The name of the code file (e.g., 'main.py', 'nodemcu.ino')." },
        content: { type: Type.STRING, description: "The full source code for the file." }
    },
    required: ["filename", "content"]
};
const unifiedResponseSchema = {
    type: Type.OBJECT,
    properties: {
        connections: { type: Type.ARRAY, description: "A flat array of all wire connections in the circuit.", items: { type: Type.OBJECT, properties: { from: pinIdentifierSchema, to: pinIdentifierSchema, }, required: ["from", "to"] }, },
        code: { type: Type.ARRAY, description: "An array of code files for the project. The first file is always for the main board.", items: codeFileSchema },
        explanation: { type: Type.STRING, description: "A student-friendly explanation of the project. Use newlines for paragraphs and start lines with '* ' for bullet points." },
        simulationSteps: { type: Type.ARRAY, description: "A time-sequenced array of simulation steps based on the generated code. If the code is not simulatable, you MUST return an empty array.", items: simulationStepSchema },
        simulationTriggers: { type: Type.ARRAY, description: "An array of cause-and-effect triggers for interactive simulation, based on conditional logic in the code. If there is no conditional logic, you MUST return an empty array.", items: simulationTriggerSchema }
    },
    required: ["connections", "code", "explanation", "simulationSteps", "simulationTriggers"],
};
const placedComponentSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "The component's general ID from the available list, e.g., 'led'." },
        instanceId: { type: Type.STRING, description: "A unique identifier for this specific instance, must follow the format 'id-timestamp', e.g., 'led-167854829'." },
        displayName: { type: Type.STRING, description: "A unique, user-facing name for this instance, e.g., 'LED 1', 'Button 1'. If you select two LEDs, they must be named 'LED 1' and 'LED 2'." },
        x: { type: Type.INTEGER, description: "The x-coordinate for the component's top-left corner on a 2000x1500 canvas. Position components logically around the central board." },
        y: { type: Type.INTEGER, description: "The y-coordinate for the component's top-left corner on a 2000x1500 canvas. Position components logically around the central board." }
    },
    required: ["id", "instanceId", "displayName", "x", "y"]
};
const projectScaffoldSchema = {
    type: Type.OBJECT,
    properties: { ...unifiedResponseSchema.properties, placedComponents: { type: Type.ARRAY, description: "An array of all components selected from the available list, with their assigned instance IDs and canvas coordinates.", items: placedComponentSchema } },
    required: [...(unifiedResponseSchema.required || []), "placedComponents"]
};
const componentDetailsSchema = {
    type: Type.OBJECT,
    properties: {
        description: { type: Type.STRING, description: "A brief, student-friendly description of the component." },
        voltage: { type: Type.STRING, description: "The typical operating voltage range, e.g., '3.3V - 5V'." },
        pinout: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { pin: { type: Type.STRING, description: "The name of the pin (e.g., 'VCC', 'GND', 'DATA')." }, description: { type: Type.STRING, description: "A short description of the pin's function." } }, required: ["pin", "description"] } },
        svgIconString: { type: Type.STRING, description: "A valid, complete, single-color SVG string for the component's icon. It must be simple, viewable on light and dark backgrounds, use 'currentColor' for fill, and have a viewBox='0 0 24 24'." }
    },
    required: ["description", "voltage", "pinout", "svgIconString"]
};
const boardPinSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the pin, e.g., 'GPIO17', 'D13', 'A0', '5V'." },
        x: { type: Type.NUMBER, description: "The x-coordinate of the pin relative to the 512x324 SVG viewBox." },
        y: { type: Type.NUMBER, description: "The y-coordinate of the pin relative to the 512x324 SVG viewBox." },
        type: { type: Type.STRING, description: "The type of the pin. Must be one of: 'power-5v', 'power-3.3v', 'gnd', 'gpio', 'i2c-sda', 'i2c-scl', 'spi-mosi', 'spi-miso', 'spi-sclk', 'spi-cs', 'uart-tx', 'uart-rx', 'analog', 'vin', 'aref', 'id', 'unknown'." }
    },
    required: ["name", "x", "y", "type"]
};
const boardDetailsSchema = {
    type: Type.OBJECT,
    properties: {
        description: { type: Type.STRING, description: "A brief, student-friendly description of the board, its purpose, and common use cases." },
        language: { type: Type.STRING, description: "The primary programming language for this board. Must be either 'Python' or 'C++'." },
        svgSchematicStrings: { type: Type.ARRAY, description: "An array containing exactly 3 distinct, valid, complete, single-color SVG strings for the board's simplified 2D schematic.", items: { type: Type.STRING } },
        pinout: { type: Type.ARRAY, description: "An array of all major pin coordinates on the board, relative to the 512x324 SVG viewBox. Include all power, ground, digital, and analog pins.", items: boardPinSchema }
    },
    required: ["description", "language", "svgSchematicStrings", "pinout"]
};
const boardNameSuggestionsSchema = { type: Type.OBJECT, properties: { suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 corrected or related board names." } }, required: ["suggestions"] };
const challengeEvaluationSchema = { type: Type.OBJECT, properties: { isCorrect: { type: Type.BOOLEAN, description: "Whether the user's solution correctly meets all requirements of the challenge goal." }, feedback: { type: Type.STRING, description: "A concise, student-friendly explanation. If incorrect, explain what is wrong and give a gentle pointer. If correct, provide a congratulatory message." } }, required: ["isCorrect", "feedback"] };
const hintSchema = { type: Type.OBJECT, properties: { hint: { type: Type.STRING, description: "A single, helpful, specific hint to guide the student. Do not give away the whole solution. Focus on one aspect, like a specific wiring connection or a line of code." } }, required: ["hint"] };
const codeUpdateResponseSchema = {
    type: Type.OBJECT,
    properties: {
        code: { type: Type.STRING, description: "The student's code, possibly with minor corrections or reformatting." },
        explanation: { type: Type.STRING, description: "A new, student-friendly explanation of what the modified code does." },
        simulationSteps: { type: Type.ARRAY, items: simulationStepSchema },
        simulationTriggers: { type: Type.ARRAY, items: simulationTriggerSchema },
        errors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of syntax or logical errors found in the code." },
        connections: { type: Type.ARRAY, description: "OPTIONAL. If the code changes pin assignments, return the new wiring diagram here. If wiring is unchanged, OMIT this field.", items: { type: Type.OBJECT, properties: { from: pinIdentifierSchema, to: pinIdentifierSchema, }, required: ["from", "to"] }, },
    },
    required: ["code", "explanation"]
};
const suggestionSchema = { type: Type.OBJECT, properties: { components: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, count: { type: Type.INTEGER } }, required: ["id", "count"] } } }, required: ["components"] };

export class GeminiProvider implements AIProvider {
    private ai: GoogleGenAI;
    private promptFactory: PromptFactory;
    private model: string;

    constructor(config: { apiKey?: string; vertexai?: boolean; project?: string; location?: string; model?: string }, promptFactory: PromptFactory) {
        this.model = config.model || 'gemini-4-argon';
        this.promptFactory = promptFactory;

        if (config.vertexai) {
            if (!config.project) {
                throw new Error("GOOGLE_CLOUD_PROJECT is required for Vertex AI mode.");
            }
            this.ai = new GoogleGenAI({
                vertexai: true,
                project: config.project,
                location: config.location || 'global',
            });
            console.log(`[Gemini] Initialized with Vertex AI (project: ${config.project}, model: ${this.model})`);
        } else {
            if (!config.apiKey) {
                throw new Error("Gemini API key is required for api_key mode.");
            }
            this.ai = new GoogleGenAI({ apiKey: config.apiKey });
            console.log(`[Gemini] Initialized with API Key (model: ${this.model})`);
        }
    }

    private async generate(prompt: string, schema: any): Promise<{ data: any, usageMetadata: any }> {
        const response = await this.ai.models.generateContent({
            model: this.model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
            },
        });

        if (!response.text) {
            throw new Error("Received an empty response from the Gemini AI.");
        }

        const data = JSON.parse(response.text.trim());
        const usageMetadata = (response as any).usageMetadata;

        return { data, usageMetadata };
    }

    async checkProjectFeasibility(idea: string, availableIds: string[]) {
        const prompt = this.promptFactory.createFeasibilityCheckPrompt(idea, availableIds);
        return this.generate(prompt, feasibilityCheckSchema);
    }

    async getComponentSuggestionsForPi(idea: string, availableIds: string[]) {
        const prompt = this.promptFactory.createPiSuggestionPrompt(idea, availableIds);
        return this.generate(prompt, suggestionSchema);
    }

    async getUnifiedProjectInfo(components: DroppedComponent[], projectIdea: string, boardId: string, boardName: string, boardPinout: { name: string; }[], errors?: WiringError[] | undefined) {
        const prompt = this.promptFactory.createUnifiedPiPrompt(components, projectIdea, boardId, boardName, boardPinout, errors);
        return this.generate(prompt, unifiedResponseSchema);
    }

    async getComponentSuggestionsForArduino(idea: string, availableIds: string[]) {
        const prompt = this.promptFactory.createArduinoSuggestionPrompt(idea, availableIds);
        return this.generate(prompt, suggestionSchema);
    }

    async getArduinoUnifiedProjectInfo(components: DroppedComponent[], projectIdea: string, boardId: string, boardName: string, boardPinout: { name: string; }[], errors?: WiringError[] | undefined) {
        const prompt = this.promptFactory.createUnifiedArduinoPrompt(components, projectIdea, boardId, boardName, boardPinout, errors);
        return this.generate(prompt, unifiedResponseSchema);
    }

    async getProjectScaffoldForPi(projectIdea: string, availableComponents: Component[], boardId: string, boardName: string, boardPinout: { name: string; }[], errors?: WiringError[] | undefined) {
        const prompt = this.promptFactory.createScaffoldPiPrompt(projectIdea, availableComponents, boardId, boardName, boardPinout, errors);
        return this.generate(prompt, projectScaffoldSchema);
    }

    async getProjectScaffoldForArduino(projectIdea: string, availableComponents: Component[], boardId: string, boardName: string, boardPinout: { name: string; }[], errors?: WiringError[] | undefined) {
        const prompt = this.promptFactory.createScaffoldArduinoPrompt(projectIdea, availableComponents, boardId, boardName, boardPinout, errors);
        return this.generate(prompt, projectScaffoldSchema);
    }

    async getComponentDetails(componentName: string) {
        const prompt = this.promptFactory.createComponentDetailsPrompt(componentName);
        return this.generate(prompt, componentDetailsSchema);
    }

    async getBoardDetails(boardName: string, additionalPrompt?: string | undefined) {
        const prompt = this.promptFactory.createBoardDetailsPrompt(boardName, additionalPrompt);
        return this.generate(prompt, boardDetailsSchema);
    }

    async getBoardNameSuggestions(query: string) {
        const prompt = this.promptFactory.createBoardNameSuggestionsPrompt(query);
        return this.generate(prompt, boardNameSuggestionsSchema);
    }

    async evaluateChallengeSolution(goal: string, successCondition: string, components: DroppedComponent[], connections: Connection[], code: string, boardName: string) {
        const prompt = this.promptFactory.createChallengeEvaluationPrompt(goal, successCondition, components, connections, code, boardName);
        return this.generate(prompt, challengeEvaluationSchema);
    }

    async getChallengeHint(goal: string, components: DroppedComponent[], connections: Connection[], code: string, boardName: string) {
        const prompt = this.promptFactory.createHintPrompt(goal, components, connections, code, boardName);
        return this.generate(prompt, hintSchema);
    }

    async updateSimulationFromCode(userCode: { filename: string; content: string; }[], components: DroppedComponent[], connections: Connection[], board: Board) {
        const prompt = this.promptFactory.createCodeUpdatePrompt(userCode, components, connections, board);
        return this.generate(prompt, codeUpdateResponseSchema);
    }
}