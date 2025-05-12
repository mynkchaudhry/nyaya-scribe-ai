
/**
 * API configuration for the application
 */
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  TIMEOUT: 30000, // 30 seconds timeout
};

export const MODELS = {
  'gpt-3.5-turbo': 'GPT-3.5 Turbo',
  'gpt-4o-mini': 'GPT-4o Mini',
  'gpt-4o': 'GPT-4o'
};

export type ModelType = keyof typeof MODELS;

export const DEFAULT_MODEL: ModelType = 'gpt-3.5-turbo';
