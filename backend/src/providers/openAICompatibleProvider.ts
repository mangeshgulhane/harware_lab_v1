import OpenAI from 'openai';
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

export class OpenAICompatibleProvider implements AIProvider {
  private client: OpenAI;
  private model: string;
  private promptFactory: PromptFactory;

  constructor(
    apiKey: string | undefined, // API key is optional for local services like Ollama
    baseUrl: string,
    model: string, 
    promptFactory: PromptFactory
  ) {
    this.client = new OpenAI({ 
      apiKey: apiKey || 'ollama', // SDK requires a key, but for Ollama the value doesn't matter.
      baseURL: baseUrl 
    });
    this.model = model;
    this.promptFactory = promptFactory;
  }
  
  private async generate(prompt: string): Promise<{ data: any, usageMetadata: any }> {
      // NOTE: This relies on the model's ability to generate valid JSON. 
      // Newer OpenAI models (gpt-4-turbo) and many Ollama models (Llama 3) support JSON mode.
      const response = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            { 
              role: "system", 
              content: "You are an expert systems engineer. Your response MUST be a valid JSON object. Do not include markdown formatting or any other text outside of the JSON structure." 
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
      });

      const jsonText = response.choices[0]?.message?.content;
      if (!jsonText) {
          throw new Error("Received an empty response from the OpenAI-compatible API.");
      }
      
      const usage = response.usage;
      const usageMetadata = usage ? {
        promptTokenCount: usage.prompt_tokens,
        candidatesTokenCount: usage.completion_tokens,
        totalTokenCount: usage.total_tokens,
      } : undefined;

      return { data: JSON.parse(jsonText), usageMetadata };
  }

  // The following methods will create the correct prompt and then call the generic 'generate' method.
  // This demonstrates the power of the Prompt Factory pattern.
  async checkProjectFeasibility(idea: string, availableIds: string[]) {
    const prompt = this.promptFactory.createFeasibilityCheckPrompt(idea, availableIds);
    return this.generate(prompt);
  }

  async getComponentSuggestionsForPi(idea: string, availableIds: string[]) {
    const prompt = this.promptFactory.createPiSuggestionPrompt(idea, availableIds);
    return this.generate(prompt);
  }

  async getUnifiedProjectInfo(components: DroppedComponent[], projectIdea: string, boardId: string, boardName: string, boardPinout: { name: string; }[], errors?: WiringError[]) {
    const prompt = this.promptFactory.createUnifiedPiPrompt(components, projectIdea, boardId, boardName, boardPinout, errors);
    return this.generate(prompt);
  }

  async getComponentSuggestionsForArduino(idea: string, availableIds: string[]) {
    const prompt = this.promptFactory.createArduinoSuggestionPrompt(idea, availableIds);
    return this.generate(prompt);
  }

  async getArduinoUnifiedProjectInfo(components: DroppedComponent[], projectIdea: string, boardId: string, boardName: string, boardPinout: { name: string; }[], errors?: WiringError[]) {
    const prompt = this.promptFactory.createUnifiedArduinoPrompt(components, projectIdea, boardId, boardName, boardPinout, errors);
    return this.generate(prompt);
  }

  async getProjectScaffoldForPi(projectIdea: string, availableComponents: Component[], boardId: string, boardName: string, boardPinout: { name: string; }[], errors?: WiringError[]) {
    const prompt = this.promptFactory.createScaffoldPiPrompt(projectIdea, availableComponents, boardId, boardName, boardPinout, errors);
    return this.generate(prompt);
  }

  async getProjectScaffoldForArduino(projectIdea: string, availableComponents: Component[], boardId: string, boardName: string, boardPinout: { name: string; }[], errors?: WiringError[]) {
    const prompt = this.promptFactory.createScaffoldArduinoPrompt(projectIdea, availableComponents, boardId, boardName, boardPinout, errors);
    return this.generate(prompt);
  }

  async getComponentDetails(componentName: string) {
    const prompt = this.promptFactory.createComponentDetailsPrompt(componentName);
    return this.generate(prompt);
  }

  async getBoardDetails(boardName: string, additionalPrompt?: string) {
    const prompt = this.promptFactory.createBoardDetailsPrompt(boardName, additionalPrompt);
    return this.generate(prompt);
  }

  async getBoardNameSuggestions(query: string) {
    const prompt = this.promptFactory.createBoardNameSuggestionsPrompt(query);
    return this.generate(prompt);
  }

  async evaluateChallengeSolution(goal: string, successCondition: string, components: DroppedComponent[], connections: Connection[], code: string, boardName: string) {
    const prompt = this.promptFactory.createChallengeEvaluationPrompt(goal, successCondition, components, connections, code, boardName);
    return this.generate(prompt);
  }

  async getChallengeHint(goal: string, components: DroppedComponent[], connections: Connection[], code: string, boardName: string) {
    const prompt = this.promptFactory.createHintPrompt(goal, components, connections, code, boardName);
    return this.generate(prompt);
  }

  async updateSimulationFromCode(userCode: { filename: string; content: string; }[], components: DroppedComponent[], connections: Connection[], board: Board) {
    const prompt = this.promptFactory.createCodeUpdatePrompt(userCode, components, connections, board);
    return this.generate(prompt);
  }
}