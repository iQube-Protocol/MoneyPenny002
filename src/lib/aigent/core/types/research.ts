/**
 * Research types for AgentiQ
 */

export interface ResearchQuery {
  query: string;
  sources?: string[];
  maxResults?: number;
}

export interface ResearchResult {
  title: string;
  url: string;
  snippet: string;
  score?: number;
}

export interface ResearchMemo {
  topic: string;
  strategy?: any;
  sources?: ResearchResult[];
  riskScore?: number;
  trustScore?: number;
}

export interface ResearchResponse {
  memo: ResearchMemo;
}
