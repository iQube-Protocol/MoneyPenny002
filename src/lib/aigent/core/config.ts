/**
 * Core configuration utilities for AgentiQ
 */

export interface AgentiQConfig {
  agentClass: string;
  tenantId?: string;
  enableA2A?: boolean;
  enableMetaMask?: boolean;
  enableUniSat?: boolean;
  enablePhantom?: boolean;
  tavilyApiKey?: string;
  redisUrl?: string;
  apiBaseUrl?: string;
  quotesUrl?: string;
}

export function createConfigFromEnv(): AgentiQConfig {
  return {
    agentClass: import.meta.env.VITE_AGENT_CLASS || 'moneypenny',
    tenantId: import.meta.env.VITE_TENANT_ID,
    enableA2A: import.meta.env.VITE_ENABLE_A2A === 'true',
    enableMetaMask: import.meta.env.VITE_ENABLE_METAMASK !== 'false',
    enableUniSat: import.meta.env.VITE_ENABLE_UNISAT !== 'false',
    enablePhantom: import.meta.env.VITE_ENABLE_PHANTOM !== 'false',
    tavilyApiKey: import.meta.env.VITE_TAVILY_API_KEY,
    redisUrl: import.meta.env.VITE_REDIS_URL,
  };
}

export function validateConfig(config: AgentiQConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.agentClass) {
    errors.push('agentClass is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
