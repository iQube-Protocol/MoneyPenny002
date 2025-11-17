/**
 * Memories Module
 */

import type { MoneyPennyClient } from '../client';

export class MemoriesModule {
  constructor(private client: MoneyPennyClient) {}

  async append(memory: any): Promise<void> {
    // Stub implementation
    console.log('Memory append:', memory);
  }

  async appendInsight(insight: any): Promise<void> {
    // Stub implementation
    console.log('Insight append:', insight);
  }
}
