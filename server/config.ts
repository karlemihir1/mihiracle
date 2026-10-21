import dotenv from 'dotenv';
dotenv.config();

export interface ServerConfig {
  port: number;
  openAiApiKey?: string;
  openAiBaseUrl?: string;
  aiModel: string;
  searchProvider: 'tavily' | 'duckduckgo' | 'live-web' | 'demo';
  searchApiKey?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceRoleKey?: string;
  isDemoMode: boolean;
}

const openAiApiKey = process.env.OPENAI_API_KEY?.trim();
const openAiBaseUrl = process.env.OPENAI_BASE_URL?.trim();
const searchApiKey = process.env.SEARCH_API_KEY?.trim();
const forceDemo = process.env.FORCE_DEMO_MODE === 'true';

export const config: ServerConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  openAiApiKey: openAiApiKey || undefined,
  openAiBaseUrl: openAiBaseUrl || undefined,
  aiModel: process.env.AI_MODEL || 'gpt-4o-mini',
  searchProvider: (process.env.SEARCH_PROVIDER as any) || (searchApiKey ? 'tavily' : 'live-web'),
  searchApiKey: searchApiKey || undefined,
  supabaseUrl: process.env.SUPABASE_URL?.trim() || undefined,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY?.trim() || undefined,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || undefined,
  isDemoMode: forceDemo,
};
