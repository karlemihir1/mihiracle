import { config } from '../../config.js';
import { AIProvider } from './AIProvider.js';
import { OpenAIService } from './OpenAIService.js';
import { CuratedAIService } from './CuratedAIService.js';

let instance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (instance) return instance;

  if (config.openAiApiKey) {
    instance = new OpenAIService(config.openAiApiKey, config.aiModel, config.openAiBaseUrl);
  } else {
    instance = new CuratedAIService();
  }

  return instance;
}

export * from './AIProvider.js';
