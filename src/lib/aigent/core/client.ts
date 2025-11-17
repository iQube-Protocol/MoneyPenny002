/**
 * Base AgentiQ Client
 */

import { QueryClient } from '@tanstack/react-query';
import { AgentiQConfig, AgentScope } from './types';

export class AgentiQClient {
  protected config: AgentiQConfig;
  protected queryClient: QueryClient;

  constructor(config: AgentiQConfig, queryClient: QueryClient) {
    this.config = config;
    this.queryClient = queryClient;
  }

  getConfig(): AgentiQConfig {
    return this.config;
  }

  getScope(): AgentScope {
    return {
      tenantId: this.config.tenantId,
    };
  }
}
