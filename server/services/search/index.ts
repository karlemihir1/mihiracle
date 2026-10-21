import { config } from '../../config.js';
import { SearchProvider } from './SearchProvider.js';
import { LiveWebSearchProvider } from './LiveWebSearchProvider.js';

let instance: SearchProvider | null = null;

export function getSearchProvider(): SearchProvider {
  if (instance) return instance;

  instance = new LiveWebSearchProvider(config.searchApiKey);
  return instance;
}

export * from './SearchProvider.js';
