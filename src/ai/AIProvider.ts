export interface CodeReviewRequest {
  code: string;
  sceneId: string;
  presetKey?: string;
  runOutput?: string;
  runError?: string;
  hintLevel?: number;
}

export interface AIResponse {
  type: 'hint' | 'question' | 'observation';
  content: string;
  hasMore: boolean;
}

export interface AIProvider {
  reviewCode(req: CodeReviewRequest): Promise<AIResponse>;
  giveHint(req: CodeReviewRequest): Promise<AIResponse>;
  explainError(req: CodeReviewRequest): Promise<AIResponse>;
}
