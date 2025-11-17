/**
 * Core types for AgentiQ framework
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

export interface AgentScope {
  userId?: string;
  tenantId?: string;
  personaId?: string;
}
