/**
 * Tavily Search Adapter
 */

export class TavilyAdapter {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string): Promise<any> {
    // Stub implementation
    return { results: [] };
  }
}
